import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Éditeur du site</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Nom de l'entreprise :</strong> PoubelleDay SAS</p>
              <p><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
              <p><strong>Capital social :</strong> 10 000 €</p>
              <p><strong>Siège social :</strong> 123 rue de la République, 75001 Paris, France</p>
              <p><strong>RCS :</strong> Paris B 123 456 789</p>
              <p><strong>TVA intracommunautaire :</strong> FR 12 345678901</p>
              <p><strong>Email :</strong> contact@poubelleday.com</p>
              <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Directeur de la publication</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Nom :</strong> Jean Dupont</p>
              <p><strong>Qualité :</strong> Président de PoubelleDay SAS</p>
              <p><strong>Email :</strong> direction@poubelleday.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Hébergeur</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Nom :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p><strong>Base de données :</strong> Supabase Inc.</p>
              <p><strong>Adresse :</strong> 970 Toa Payoh North #07-04, Singapore 318992</p>
              <p><strong>Site web :</strong> <a href="https://supabase.com" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu présent sur le site PoubelleDay (textes, images, logos, 
              graphismes, icônes, sons, logiciels, etc.) est la propriété exclusive de 
              PoubelleDay SAS ou de ses partenaires.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification, publication, adaptation de 
              tout ou partie des éléments du site, quel que soit le moyen ou le procédé 
              utilisé, est interdite sauf autorisation écrite préalable de PoubelleDay SAS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Protection des données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à 
              la loi Informatique et Libertés, vous disposez de droits sur vos données 
              personnelles.
            </p>
            <p className="mt-2">
              <strong>Délégué à la protection des données (DPO) :</strong><br />
              Email : dpo@poubelleday.com
            </p>
            <p className="mt-2">
              Pour plus d'informations, consultez notre{" "}
              <a href="/legal/privacy" className="text-green-600 hover:underline">
                Politique de Confidentialité
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies</h2>
            <p>
              Le site PoubelleDay utilise des cookies pour améliorer l'expérience utilisateur 
              et analyser le trafic. En continuant à naviguer sur le site, vous acceptez 
              l'utilisation de cookies conformément à notre politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation de responsabilité</h2>
            <p>
              PoubelleDay SAS s'efforce d'assurer l'exactitude et la mise à jour des 
              informations diffusées sur ce site. Toutefois, PoubelleDay SAS ne peut 
              garantir l'exactitude, la précision ou l'exhaustivité des informations 
              mises à disposition sur ce site.
            </p>
            <p className="mt-2">
              En conséquence, PoubelleDay SAS décline toute responsabilité pour toute 
              imprécision, inexactitude ou omission portant sur des informations 
              disponibles sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Droit applicable et juridiction</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. 
              En cas de contestation ou de litige, les tribunaux français seront 
              seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Crédits</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Conception et développement :</strong> PoubelleDay SAS</p>
              <p><strong>Technologies utilisées :</strong> Next.js, React, TypeScript, Tailwind CSS</p>
              <p><strong>Icônes :</strong> Lucide Icons</p>
              <p><strong>Illustrations :</strong> Propriété de PoubelleDay SAS</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales ou le site en général :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>Email général :</strong> contact@poubelleday.com</p>
              <p><strong>Support technique :</strong> support@poubelleday.com</p>
              <p><strong>Service commercial :</strong> commercial@poubelleday.com</p>
              <p><strong>Réclamations :</strong> reclamation@poubelleday.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Médiation</h2>
            <p>
              En cas de litige, vous pouvez recourir gratuitement au service de médiation 
              MEDICYS dont nous sommes adhérents :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>MEDICYS - Centre de médiation et de règlement amiable</strong></p>
              <p>73 Boulevard de Clichy, 75009 Paris</p>
              <p>Site web : <a href="https://www.medicys.fr" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">www.medicys.fr</a></p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t text-sm text-gray-600">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            <p>© {new Date().getFullYear()} PoubelleDay SAS - Tous droits réservés</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}