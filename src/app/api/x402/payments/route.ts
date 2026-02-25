// src/app/api/x402/payments/route.ts
// X402 Payment Records API
//
// GET  — List payment records (authenticated users see their own, admin sees all)
// Supports filtering by: status, product, network, date range

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "edge";

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);
  const status = url.searchParams.get("status"); // pending, verified, settled, failed
  const product = url.searchParams.get("product"); // product slug
  const network = url.searchParams.get("network");
  const from = url.searchParams.get("from"); // ISO date string
  const to = url.searchParams.get("to"); // ISO date string
  const search = url.searchParams.get("q"); // search term

  // Check if user is admin
  const adminClient = getAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "staff";

  // Build query — regular users see only their payments
  let query = adminClient
    .from("x402_payments")
    .select("*", { count: "exact" });

  if (!isAdmin) {
    // Try to match by user_id or by wallet addresses linked to the user
    query = query.eq("user_id", user.id);
  }

  // Apply filters
  if (status) {
    query = query.eq("settlement_status", status);
  }
  if (product) {
    query = query.eq("product_slug", product);
  }
  if (network) {
    query = query.eq("network", network);
  }
  if (from) {
    query = query.gte("created_at", from);
  }
  if (to) {
    query = query.lte("created_at", to);
  }
  if (search) {
    query = query.or(
      `payer_address.ilike.%${search}%,product_name.ilike.%${search}%,transaction_hash.ilike.%${search}%`
    );
  }

  // Pagination
  const offset = (page - 1) * limit;
  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: payments, count, error } = await query;

  if (error) {
    console.error("[X402] Payment records query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment records" },
      { status: 500 }
    );
  }

  // Calculate summary stats
  let statsQuery = adminClient
    .from("x402_payments")
    .select("settlement_status, amount, amount_usd");

  if (!isAdmin) {
    statsQuery = statsQuery.eq("user_id", user.id);
  }

  const { data: allPayments } = await statsQuery;

  const stats = {
    total: allPayments?.length || 0,
    settled: allPayments?.filter((p) => p.settlement_status === "settled").length || 0,
    pending: allPayments?.filter((p) => p.settlement_status === "pending" || p.settlement_status === "verified").length || 0,
    failed: allPayments?.filter((p) => p.settlement_status === "failed").length || 0,
    totalUsd: allPayments
      ?.filter((p) => p.settlement_status === "settled")
      .reduce((sum, p) => sum + (p.amount_usd || 0), 0) || 0,
  };

  return NextResponse.json({
    success: true,
    data: payments || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
    stats,
  });
}
