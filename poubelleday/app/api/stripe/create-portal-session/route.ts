import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { customerId } = await request.json();

    if (!customerId) {
      // Get customer ID from database
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .single();

      if (!(subscription as any)?.stripe_customer_id) {
        return NextResponse.json(
          { error: "Aucun abonnement trouvé" },
          { status: 404 }
        );
      }
    }

    // Create Stripe portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du portail" },
      { status: 500 }
    );
  }
}