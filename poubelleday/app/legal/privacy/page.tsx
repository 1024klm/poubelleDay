import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              PoubelleDay s'engage à protéger la confidentialité de vos données personnelles. 
              Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Données collectées</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">Données d'inscription</h3>
            <ul className="list-disc pl-6">
              <li>Nom complet</li>
              <li>Adresse email</li>
              <li>Mot de passe (chiffré)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Données d'utilisation</h3>
            <ul className="list-disc pl-6">
              <li>Historique des conversions</li>
              <li>Préférences de configuration</li>
              <li>Statistiques d'utilisation</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Données techniques</h3>
            <ul className="list-disc pl-6">
              <li>Adresse IP</li>
              <li>Type de navigateur</li>
              <li>Système d'exploitation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Utilisation des données</h2>
            <p>Nous utilisons vos données pour :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et vos abonnements</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Assurer la sécurité de la plateforme</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Traitement des fichiers PDF</h2>
            <p className="font-semibold">Important :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Les fichiers PDF uploadés sont traités en mémoire uniquement</li>
              <li>Aucun fichier PDF n'est stocké sur nos serveurs après conversion</li>
              <li>Seules les métadonnées extraites (dates, types de collecte) sont conservées</li>
              <li>Les fichiers ICS générés sont créés à la volée et non stockés</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Partage des données</h2>
            <p>
              Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers, 
              sauf dans les cas suivants :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Avec votre consentement explicite</li>
              <li>Pour traiter les paiements (Stripe)</li>
              <li>Pour envoyer des emails (Resend)</li>
              <li>Pour respecter une obligation légale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Sécurité des données</h2>
            <p>Nous mettons en œuvre des mesures de sécurité appropriées :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Chiffrement SSL/TLS pour toutes les communications</li>
              <li>Mots de passe hachés avec bcrypt</li>
              <li>Authentification à deux facteurs disponible</li>
              <li>Audits de sécurité réguliers</li>
              <li>Accès restreint aux données personnelles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
            <p>
              Nous utilisons des cookies essentiels pour le fonctionnement du site :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Cookies de session pour l'authentification</li>
              <li>Cookies de préférences utilisateur</li>
              <li>Cookies analytiques (anonymisés)</li>
            </ul>
            <p className="mt-2">
              Vous pouvez désactiver les cookies dans votre navigateur, mais cela peut 
              affecter le fonctionnement du service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Accès :</strong> Obtenir une copie de vos données</li>
              <li><strong>Rectification :</strong> Corriger vos données</li>
              <li><strong>Effacement :</strong> Supprimer votre compte et vos données</li>
              <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Opposition :</strong> Vous opposer à certains traitements</li>
              <li><strong>Limitation :</strong> Limiter le traitement de vos données</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à : 
              <a href="mailto:privacy@poubelleday.com" className="text-green-600 hover:underline">privacy@poubelleday.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Conservation des données</h2>
            <ul className="list-disc pl-6">
              <li>Données de compte : Jusqu'à suppression du compte</li>
              <li>Historique des conversions : 2 ans</li>
              <li>Logs techniques : 90 jours</li>
              <li>Données de facturation : 10 ans (obligation légale)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Transferts internationaux</h2>
            <p>
              Vos données sont stockées sur des serveurs situés dans l'Union Européenne. 
              Si un transfert hors UE est nécessaire, nous nous assurons que des garanties 
              appropriées sont en place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Mineurs</h2>
            <p>
              PoubelleDay n'est pas destiné aux personnes de moins de 16 ans. 
              Nous ne collectons pas sciemment de données personnelles de mineurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. Nous vous informerons de tout 
              changement substantiel par email ou via une notification sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact</h2>
            <p>Pour toute question concernant vos données personnelles :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email : <a href="mailto:privacy@poubelleday.com" className="text-green-600 hover:underline">privacy@poubelleday.com</a></li>
              <li>Adresse : PoubelleDay, 123 rue de la République, 75001 Paris</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">14. Autorité de contrôle</h2>
            <p>
              Vous pouvez introduire une réclamation auprès de la CNIL :
              <a href="https://www.cnil.fr" className="text-green-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                www.cnil.fr
              </a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t text-sm text-gray-600">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            <p>Version : 1.0</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}