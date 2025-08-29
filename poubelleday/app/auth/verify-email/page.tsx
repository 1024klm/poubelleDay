import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Vérifiez votre email</CardTitle>
          <CardDescription>
            Nous avons envoyé un lien de confirmation à votre adresse email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Cliquez sur le lien dans l'email pour activer votre compte. 
            Si vous ne voyez pas l'email, vérifiez votre dossier spam.
          </p>
          
          <div className="flex flex-col gap-2">
            <Link href="/auth/login">
              <Button className="w-full" variant="outline">
                Retour à la connexion
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Vous n'avez pas reçu l'email ? Vous pouvez demander un nouveau lien 
            de confirmation depuis la page de connexion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}