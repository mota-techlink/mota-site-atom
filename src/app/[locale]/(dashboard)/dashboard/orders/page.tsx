import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersTable } from "./orders-table"
import { queryPostgREST } from "@/lib/supabase/direct-postgrest"

export const metadata = {
  title: "My Orders",
}

// 🟢 1. 修改 props 类型定义：searchParams 必须是 Promise
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const supabase = await createClient()

  // 1. 验证用户登录
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // 🟢 2. 关键修改：先 await 解析参数，再使用
  const params = await searchParams;
  const queryTerm = params.q || ""
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public';

  // 使用直接 PostgREST API 绕过 Supabase JS 库的 schema 缓存限制
  // 构建 PostgREST 查询参数
  const postgrestParams: Record<string, string> = {
    'select': '*',
    'user_id': `eq.${user.id}`,
    'order': 'created_at.desc'
  };
  
  if (queryTerm) {
    // PostgREST 的 OR 操作符格式
    postgrestParams['or'] = `(order_number.ilike.*${queryTerm}*,product_name.ilike.*${queryTerm}*)`;
  }

  let orders: any[] = [];
  let error: Error | null = null;

  console.log(`\n📋 [OrdersPage Debug]`);
  console.log(`   User ID: ${user.id}`);
  console.log(`   Schema: ${schema}`);

  // 首先尝试使用 order_details_view（可能有关联信息）
  const {
    data: viewData,
    error: viewError
  } = await queryPostgREST(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    'order_details_view',
    schema,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    postgrestParams
  );

  if (viewError) {
    console.warn(`⚠️  order_details_view failed: ${viewError.message}`)
    
    // 退回到 orders 表
    const {
      data: tableData,
      error: tableError
    } = await queryPostgREST(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      'orders',
      schema,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      postgrestParams
    );
    
    orders = tableData || [];
    error = tableError;
    
    if (!error) {
      console.log(`✅ Successfully fetched ${orders.length} orders from ${schema}.orders`);
      if (orders.length > 0) {
        console.log(`   First order: ${orders[0].order_number}`);
      }
    }
  } else {
    orders = viewData || [];
    console.log(`✅ Successfully fetched ${orders.length} orders from ${schema}.order_details_view`);
    if (orders.length > 0) {
      console.log(`   First order: ${orders[0].order_number}`);
    }
  }

  if (error) {
    const errorMsg = error.message || "Unknown error"
    return <div className="text-red-600 p-4">Failed to load orders: {errorMsg}</div>
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          View and manage your recent transactions and invoices.
        </p>
      </div>

      {/* 将数据传递给客户端组件 */}
      <OrdersTable initialOrders={orders || []} />
    </div>
  )
}