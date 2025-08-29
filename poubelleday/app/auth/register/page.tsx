"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Trash2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validatePassword = () => {
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation");
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Create free subscription
      if (data.user) {
        const { error: subError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: data.user.id,
            plan: "free",
          } as any);

        if (subError) {
          console.error("Error creating subscription:", subError);
        }
      }

      toast.success("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
      router.push("/auth/verify-email");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-green-600" />
            <span className="font-bold text-2xl">PoubelleDay</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Créez votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>
                Créez un compte pour sauvegarder vos conversions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-0.5"
                />
                <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
                  J'accepte les{" "}
                  <Link href="/legal/terms" className="text-green-600 hover:text-green-500">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/legal/privacy" className="text-green-600 hover:text-green-500">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Plan Gratuit inclus
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 3 conversions par an</li>
                  <li>• Export format .ics</li>
                  <li>• Rappels personnalisés</li>
                  <li>• Support par email</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}