import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { AdminOrdersTable } from "@/components/admin/orders-table";
import { queryPostgREST } from "@/lib/supabase/direct-postgrest";
import { resolveDbSchema } from "@/lib/supabase/schema-mode";

export const metadata = {
  title: "Orders Management",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  await requireAdmin("staff"); // staff 和 admin 都可以看

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const queryTerm = params.q || "";
  const statusFilter = params.status || "";
  const schemaResolution = resolveDbSchema();
  const schema = schemaResolution.schema;
  const useDirectPostgrest = schemaResolution.mode === 'custom';
  const authToken = session?.access_token;

  const postgrestParams: Record<string, string> = {
    select: "*",
    order: "created_at.desc",
  };

  if (queryTerm) {
    postgrestParams.or = `(order_number.ilike.*${queryTerm}*,product_name.ilike.*${queryTerm}*,customer_email.ilike.*${queryTerm}*)`;
  }

  if (statusFilter) {
    postgrestParams.status = `eq.${statusFilter}`;
  }

  let orders: any[] | null = null;
  let error: Error | null = null;

  if (useDirectPostgrest) {
    const result = await queryPostgREST(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      "order_details_view",
      schema,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      authToken,
      postgrestParams
    );
    orders = result.data;
    error = result.error;
  } else {
    let query = supabase
      .from("order_details_view")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryTerm) {
      query = query.or(`order_number.ilike.%${queryTerm}%,product_name.ilike.%${queryTerm}%,customer_email.ilike.%${queryTerm}%`);
    }

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const result = await query;
    orders = result.data;
    error = result.error as Error | null;
  }

  if (error) {
    console.error("Error fetching orders:", error);
    return <div>Failed to load orders.</div>;
  }

  // 获取当前用户的角色
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">
          View and manage all orders on the platform
        </p>
      </div>

      <AdminOrdersTable 
        initialOrders={orders || []} 
        userRole={userProfile?.role || "member"}
      />
    </div>
  );
}
