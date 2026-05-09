import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersTable } from "./orders-table"

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

  const buildViewQuery = () => {
    let query = supabase
      .from("order_details_view")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (queryTerm) {
      query = query.or(`order_number.ilike.%${queryTerm}%,product_name.ilike.%${queryTerm}%`)
    }

    return query
  }

  let { data: orders, error } = await buildViewQuery()

  if (error) {
    console.warn("⚠️ order_details_view query failed:", error?.message || JSON.stringify(error))

    let fallbackQuery = supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (queryTerm) {
      fallbackQuery = fallbackQuery.or(`order_number.ilike.%${queryTerm}%,product_name.ilike.%${queryTerm}%`)
    }

    const fallbackResult = await fallbackQuery
    orders = fallbackResult.data
    error = fallbackResult.error
    console.warn("📋 Fallback to orders table - error:", error?.message || JSON.stringify(error))
  }

  if (error) {
    const errorMsg = error?.message || JSON.stringify(error) || "Unknown error"
    console.error("❌ Error fetching orders:", errorMsg, "Type:", typeof error, "Keys:", Object.keys(error || {}))
    return <div className="text-red-600">Failed to load orders: {errorMsg}</div>
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