"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Bell, CheckCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Ne ratez plus jamais vos{" "}
            <span className="text-green-600">jours de poubelles</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Convertissez votre calendrier PDF de collecte des déchets en rappels automatiques.
            Compatible avec tous vos calendriers : Google, Apple, Outlook...
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/convert">
              <Button size="lg" className="gap-2">
                Convertir mon calendrier
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg">
                Comment ça marche ?
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex justify-center gap-8 flex-wrap">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Import .ics universel</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <Bell className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Rappels personnalisés</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">100% gratuit (3 conv/an)</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 blur-3xl opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Uploadez votre PDF</h3>
                <p className="text-sm text-gray-600">
                  Glissez-déposez votre calendrier de collecte des déchets
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Configurez vos rappels</h3>
                <p className="text-sm text-gray-600">
                  Choisissez quand être notifié (veille au soir, matin même...)
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Importez dans votre calendrier</h3>
                <p className="text-sm text-gray-600">
                  Téléchargez le fichier .ics et importez-le en un clic
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}