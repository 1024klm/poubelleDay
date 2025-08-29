import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
};

export const STRIPE_PRICES = {
  individual: process.env.STRIPE_PRICE_INDIVIDUAL_YEARLY || "price_individual",
  pro: process.env.STRIPE_PRICE_PRO_YEARLY || "price_pro",
} as const;

export const STRIPE_PRODUCTS = {
  individual: {
    name: "PoubelleDay Particulier",
    description: "Conversions illimitées pour un usage personnel",
    features: [
      "Conversions illimitées",
      "Export format .ics",
      "Rappels personnalisés",
      "Historique des conversions",
      "Support prioritaire",
    ],
  },
  pro: {
    name: "PoubelleDay Pro",
    description: "Pour les professionnels et les syndics",
    features: [
      "Tout du plan Particulier",
      "Multi-utilisateurs",
      "API dédiée",
      "Personnalisation avancée",
      "Support téléphonique",
      "Formation incluse",
    ],
  },
} as const;