"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Tarifs simples et transparents
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative ${plan.highlighted ? 'border-green-500 shadow-xl' : ''}`}>
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                    Populaire
                  </Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}€
                    </span>
                    {plan.price > 0 && <span className="text-gray-600">/an</span>}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Link href={plan.id === 'free' ? '/convert' : '/auth/register'} className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.id === 'free' ? 'Essayer gratuitement' : 'Commencer'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Tous les prix sont en euros TTC. Paiement sécurisé par Stripe.
          </p>
        </div>
      </div>
    </section>
  );
}