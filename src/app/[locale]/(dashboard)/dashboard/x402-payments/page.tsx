// src/app/[locale]/(dashboard)/dashboard/x402-payments/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { X402PaymentsContent } from "./x402-payments-content";

export const metadata = {
  title: "X402 Payments",
  description: "View your X402 protocol payment history",
};

export default async function X402PaymentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return <X402PaymentsContent />;
}
