"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quels formats de PDF sont supportés ?",
    answer: "PoubelleDay supporte la plupart des formats de calendriers PDF émis par les collectivités : tableaux mensuels, listes chronologiques, calendriers visuels. Notre algorithme intelligent détecte automatiquement les dates et types de collecte."
  },
  {
    question: "Comment importer le fichier .ics dans mon calendrier ?",
    answer: "Une fois le fichier .ics généré, vous pouvez l'importer dans : Google Calendar (Paramètres > Importer), Apple Calendar (Fichier > Importer), Outlook (Ouvrir > Importer). Les événements et rappels seront automatiquement ajoutés."
  },
  {
    question: "Les rappels fonctionnent-ils sur tous les appareils ?",
    answer: "Oui ! Une fois importé dans votre calendrier, les rappels se synchronisent automatiquement sur tous vos appareils connectés au même compte (smartphone, tablette, ordinateur)."
  },
  {
    question: "Puis-je modifier les rappels après génération ?",
    answer: "Vous pouvez configurer les rappels avant la génération du fichier .ics. Une fois importé dans votre calendrier, vous pouvez également modifier chaque événement individuellement selon vos besoins."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Nous ne stockons pas vos fichiers PDF après conversion. Seules les métadonnées des événements extraits sont conservées pour votre historique. Nous sommes conformes au RGPD."
  },
  {
    question: "Que faire si mon PDF n'est pas reconnu ?",
    answer: "Notre parser est constamment amélioré. Si votre PDF n'est pas reconnu, vous pouvez nous le signaler. En attendant, vous pouvez utiliser le mode édition manuelle pour ajuster les événements détectés."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tout ce que vous devez savoir sur PoubelleDay
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}