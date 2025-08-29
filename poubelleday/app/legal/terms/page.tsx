import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service PoubelleDay, 
              une plateforme de conversion de calendriers PDF de collecte des déchets en fichiers ICS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptation des conditions</h2>
            <p>
              L'utilisation de PoubelleDay implique l'acceptation pleine et entière des présentes CGU. 
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Description du service</h2>
            <p>PoubelleDay propose :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>La conversion de calendriers PDF en fichiers ICS</li>
              <li>La génération de rappels personnalisés</li>
              <li>La sauvegarde de l'historique des conversions (utilisateurs inscrits)</li>
              <li>Différents plans d'abonnement (Gratuit, Particulier, Pro)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Inscription et compte utilisateur</h2>
            <p>
              Pour accéder à certaines fonctionnalités, vous devez créer un compte en fournissant 
              des informations exactes et à jour. Vous êtes responsable de la confidentialité 
              de vos identifiants de connexion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Plans et tarification</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">Plan Gratuit</h3>
            <ul className="list-disc pl-6">
              <li>3 conversions par an</li>
              <li>Fonctionnalités de base</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Plan Particulier (4€/an)</h3>
            <ul className="list-disc pl-6">
              <li>Conversions illimitées</li>
              <li>Historique des conversions</li>
              <li>Support prioritaire</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Plan Pro (29€/an)</h3>
            <ul className="list-disc pl-6">
              <li>Toutes les fonctionnalités du plan Particulier</li>
              <li>Multi-utilisateurs</li>
              <li>API dédiée</li>
              <li>Support téléphonique</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Paiement et facturation</h2>
            <p>
              Les paiements sont traités de manière sécurisée via Stripe. Les abonnements sont 
              renouvelés automatiquement chaque année. Vous pouvez annuler votre abonnement 
              à tout moment depuis votre tableau de bord.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Propriété intellectuelle</h2>
            <p>
              PoubelleDay et l'ensemble de ses contenus sont protégés par le droit d'auteur. 
              Vous conservez la propriété des fichiers que vous uploadez et des calendriers générés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Protection des données</h2>
            <p>
              Nous nous engageons à protéger vos données personnelles conformément au RGPD. 
              Les fichiers PDF uploadés ne sont pas conservés après conversion. 
              Consultez notre <a href="/legal/privacy" className="text-green-600 hover:underline">Politique de Confidentialité</a> pour plus de détails.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation de responsabilité</h2>
            <p>
              PoubelleDay est fourni "en l'état". Nous ne garantissons pas que le service 
              sera exempt d'erreurs ou disponible en permanence. Notre responsabilité est 
              limitée au montant que vous avez payé pour le service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Résiliation</h2>
            <p>
              Nous nous réservons le droit de suspendre ou résilier votre compte en cas 
              de violation des présentes CGU ou d'utilisation abusive du service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Modifications des CGU</h2>
            <p>
              Nous pouvons modifier ces CGU à tout moment. Les modifications entrent en 
              vigueur dès leur publication. Votre utilisation continue du service après 
              modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Droit applicable</h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tout litige sera soumis 
              aux tribunaux compétents de Paris.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact</h2>
            <p>
              Pour toute question concernant ces CGU, contactez-nous à : 
              <a href="mailto:legal@poubelleday.com" className="text-green-600 hover:underline">legal@poubelleday.com</a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t text-sm text-gray-600">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}