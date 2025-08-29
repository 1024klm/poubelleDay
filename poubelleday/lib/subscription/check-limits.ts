import { createClient } from "@/lib/supabase/server";

export async function checkConversionLimit(userId?: string): Promise<{
  canConvert: boolean;
  remainingConversions: number | "unlimited";
  message?: string;
}> {
  // Anonymous users get 1 free conversion
  if (!userId) {
    return {
      canConvert: true,
      remainingConversions: 1,
      message: "Conversion anonyme disponible",
    };
  }

  const supabase = await createClient();

  // Get user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .single();

  const plan = (subscription as any)?.plan || "free";

  // Paid plans have unlimited conversions
  if (plan !== "free") {
    return {
      canConvert: true,
      remainingConversions: "unlimited",
    };
  }

  // For free plan, check usage stats
  const { data: usageStats } = await supabase
    .from("usage_stats")
    .select("conversions_count, last_conversion")
    .eq("user_id", userId)
    .single();

  const conversionsCount = (usageStats as any)?.conversions_count || 0;
  const yearlyLimit = 3;

  // Check if we need to reset the counter (new year)
  if ((usageStats as any)?.last_conversion) {
    const lastConversionDate = new Date((usageStats as any).last_conversion);
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());

    // If last conversion was more than a year ago, reset the counter
    if (lastConversionDate < oneYearAgo) {
      await supabase
        .from("usage_stats")
        .update({ conversions_count: 0 } as any)
        .eq("user_id", userId);
      
      return {
        canConvert: true,
        remainingConversions: yearlyLimit,
      };
    }
  }

  const remaining = Math.max(0, yearlyLimit - conversionsCount);

  if (remaining === 0) {
    return {
      canConvert: false,
      remainingConversions: 0,
      message: "Limite de conversions gratuites atteinte. Passez au plan Particulier pour des conversions illimitées.",
    };
  }

  return {
    canConvert: true,
    remainingConversions: remaining,
  };
}

export async function incrementConversionCount(userId: string): Promise<void> {
  const supabase = await createClient();

  // This is handled by a database trigger, but we can also do it here as backup
  const { data: existing } = await supabase
    .from("usage_stats")
    .select("conversions_count")
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase
      .from("usage_stats")
      .update({
        conversions_count: ((existing as any).conversions_count || 0) + 1,
        last_conversion: new Date().toISOString(),
      } as any)
      .eq("user_id", userId);
  } else {
    await supabase
      .from("usage_stats")
      .insert({
        user_id: userId,
        conversions_count: 1,
        last_conversion: new Date().toISOString(),
      } as any);
  }
}