"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Conversion, Subscription, UsageStats } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  Settings,
  LogOut,
  Crown,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PRICING_PLANS } from "@/lib/constants";

interface DashboardContentProps {
  user: User;
  subscription: Subscription | null;
  conversions: Conversion[];
  usageStats: UsageStats | null;
}

export function DashboardContent({ 
  user, 
  subscription, 
  conversions, 
  usageStats 
}: DashboardContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = subscription?.plan || "free";
  const planInfo = PRICING_PLANS.find(p => p.id === currentPlan);
  const conversionsCount = usageStats?.conversions_count || 0;
  const remainingConversions = currentPlan === "free" 
    ? Math.max(0, 3 - conversionsCount) 
    : "Illimité";

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    // Redirect to Stripe Customer Portal
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: subscription?.stripe_customer_id,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error("Erreur lors de l'accès au portail");
    }
  };

  const downloadICS = async (conversionId: string, filename: string) => {
    try {
      const conversion = conversions.find(c => c.id === conversionId);
      if (!conversion) return;

      const response = await fetch("/api/conversion/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events: conversion.extracted_events,
          config: conversion.config,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la génération");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename.replace(".pdf", "")}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Téléchargement démarré");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Bienvenue, {user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan actuel</CardTitle>
            <Crown className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{currentPlan}</div>
            <p className="text-xs text-gray-500">
              {planInfo?.price === 0 ? "Gratuit" : `${planInfo?.price}€/an`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions restantes</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {remainingConversions}
            </div>
            <p className="text-xs text-gray-500">
              {currentPlan === "free" ? "Sur 3 par an" : "Plan illimité"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionsCount}</div>
            <p className="text-xs text-gray-500">Depuis la création</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière conversion</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats?.last_conversion 
                ? format(new Date(usageStats.last_conversion), "dd MMM", { locale: fr })
                : "Aucune"}
            </div>
            <p className="text-xs text-gray-500">
              {usageStats?.last_conversion 
                ? format(new Date(usageStats.last_conversion), "yyyy", { locale: fr })
                : "Commencez maintenant"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Free Plan Alert */}
      {currentPlan === "free" && remainingConversions === 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="h-5 w-5" />
              Limite atteinte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 mb-4">
              Vous avez utilisé vos 3 conversions gratuites annuelles. 
              Passez au plan Particulier pour des conversions illimitées.
            </p>
            <Link href="/dashboard/upgrade">
              <Button>
                Passer au plan Particulier (4€/an)
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="conversions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversions">Mes conversions</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="conversions" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Historique des conversions</h2>
            <Link href="/convert">
              <Button disabled={currentPlan === "free" && remainingConversions === 0}>
                Nouvelle conversion
              </Button>
            </Link>
          </div>

          {conversions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune conversion</h3>
                <p className="text-gray-600 mb-4">
                  Commencez par convertir votre premier calendrier PDF
                </p>
                <Link href="/convert">
                  <Button>Convertir un calendrier</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {conversions.map((conversion) => (
                <Card key={conversion.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{conversion.filename}</CardTitle>
                        <CardDescription>
                          {conversion.extracted_events.length} événements • 
                          Créé le {format(new Date(conversion.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadICS(conversion.id, conversion.filename)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon abonnement</CardTitle>
              <CardDescription>
                Gérez votre plan et vos informations de facturation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Plan {currentPlan}</h3>
                  <p className="text-sm text-gray-600">
                    {planInfo?.features.join(" • ")}
                  </p>
                </div>
                <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
                  {currentPlan === "free" ? "Gratuit" : "Actif"}
                </Badge>
              </div>

              {currentPlan !== "free" && subscription?.current_period_end && (
                <div className="text-sm text-gray-600">
                  Prochain renouvellement le {format(new Date(subscription.current_period_end), "dd MMMM yyyy", { locale: fr })}
                </div>
              )}

              <div className="flex gap-4">
                {currentPlan === "free" ? (
                  <Link href="/dashboard/upgrade" className="flex-1">
                    <Button className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Passer au plan supérieur
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={handleManageSubscription} variant="outline" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gérer l'abonnement
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">ID Utilisateur</label>
                  <p className="text-gray-600 font-mono text-xs">{user.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Membre depuis</label>
                  <p className="text-gray-600">
                    {user.created_at && format(new Date(user.created_at), "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}