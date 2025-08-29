"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">PoubelleDay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tarifs
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/convert">
              <Button>Convertir PDF</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="py-4 space-y-4">
                <Link 
                  href="#pricing" 
                  className="block text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link 
                  href="#faq" 
                  className="block text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link href="/convert" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Convertir PDF</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}