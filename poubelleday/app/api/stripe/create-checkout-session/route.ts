import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, STRIPE_PRICES, STRIPE_PRODUCTS } from "@/lib/stripe/config";

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

    const { plan } = await request.json();

    if (!plan || !["individual", "pro"].includes(plan)) {
      return NextResponse.json(
        { error: "Plan invalide" },
        { status: 400 }
      );
    }

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let customerId = (existingSubscription as any)?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Update subscription with customer ID
      await supabase
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          plan: "free",
        } as any);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES],
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: plan,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan: plan,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}