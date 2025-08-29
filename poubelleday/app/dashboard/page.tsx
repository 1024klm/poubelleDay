import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Header } from "@/components/layout/header";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch user's conversions
  const { data: conversions } = await supabase
    .from("conversions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch usage stats
  const { data: usageStats } = await supabase
    .from("usage_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardContent 
        user={user}
        subscription={subscription}
        conversions={conversions || []}
        usageStats={usageStats}
      />
    </div>
  );
}