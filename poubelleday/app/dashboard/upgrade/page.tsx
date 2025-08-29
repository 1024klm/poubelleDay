"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Crown, Zap } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleUpgrade = async (planId: "individual" | "pro") => {
    setIsLoading(planId);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe n'est pas chargé");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error(error.message || "Une erreur est survenue");
      setIsLoading(null);
    }
  };

  const plans = PRICING_PLANS.filter(p => p.id !== "free");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Passez au niveau supérieur
          </h1>
          <p className="text-xl text-gray-600">
            Débloquez des conversions illimitées et plus de fonctionnalités
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.highlighted ? "border-green-500 shadow-xl" : ""}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                  Recommandé
                </Badge>
              )}

              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {plan.id === "individual" ? (
                    <Crown className="h-8 w-8 text-green-600" />
                  ) : (
                    <Zap className="h-8 w-8 text-purple-600" />
                  )}
                  <div className="text-right">
                    <span className="text-3xl font-bold">{plan.price}€</span>
                    <span className="text-gray-600">/an</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.id === "individual" 
                    ? "Parfait pour un usage personnel"
                    : "Pour les professionnels et syndics"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id as "individual" | "pro")}
                  disabled={isLoading !== null}
                >
                  {isLoading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    `Choisir ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Paiement sécurisé par Stripe • Annulation à tout moment
          </p>
          <Button variant="ghost" onClick={() => router.back()}>
            Retour au dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}