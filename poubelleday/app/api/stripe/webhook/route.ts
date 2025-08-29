import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription") {
          const userId = session.metadata?.supabase_user_id;
          const plan = session.metadata?.plan;
          
          if (userId && plan) {
            // Update subscription in database
            await supabase
              .from("subscriptions")
              .update({
                plan: plan,
                stripe_subscription_id: session.subscription as string,
                stripe_customer_id: session.customer as string,
              } as any)
              .eq("user_id", userId);
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get user ID from customer
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata?.supabase_user_id;
        
        if (userId) {
          const plan = subscription.metadata?.plan || "individual";
          const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);
          
          await supabase
            .from("subscriptions")
            .update({
              plan: plan,
              stripe_subscription_id: subscription.id,
              current_period_end: currentPeriodEnd.toISOString(),
            } as any)
            .eq("user_id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get user ID from customer
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata?.supabase_user_id;
        
        if (userId) {
          // Downgrade to free plan
          await supabase
            .from("subscriptions")
            .update({
              plan: "free",
              stripe_subscription_id: null,
              current_period_end: null,
            } as any)
            .eq("user_id", userId);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
          const userId = customer.metadata?.supabase_user_id;
          
          if (userId) {
            const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);
            
            await supabase
              .from("subscriptions")
              .update({
                current_period_end: currentPeriodEnd.toISOString(),
              } as any)
              .eq("user_id", userId);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Get user ID from customer
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata?.supabase_user_id;
        
        if (userId) {
          // You might want to send an email notification here
          console.error(`Payment failed for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook handler error: ${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}