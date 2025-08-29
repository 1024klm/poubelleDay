import Link from "next/link";
import { Trash2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="h-6 w-6 text-green-500" />
              <span className="font-bold text-xl text-white">PoubelleDay</span>
            </div>
            <p className="text-sm">
              Ne ratez plus jamais vos jours de poubelles. 
              Convertissez vos calendriers PDF en rappels automatiques.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/convert" className="hover:text-white transition-colors">
                  Convertisseur
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} PoubelleDay. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}