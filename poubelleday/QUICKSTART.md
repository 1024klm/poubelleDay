# Guide de Démarrage Rapide - PoubelleDay

## 🚀 Configuration en 5 minutes

### 1. Configuration Supabase (2 min)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans **Settings > API**, copiez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY`
4. Dans **SQL Editor**, exécutez le contenu de `supabase/migrations/001_initial_schema.sql`

### 2. Configuration Stripe (2 min)

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Dans **Developers > API keys**, copiez :
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
3. Créez deux produits dans **Products** :
   - **Particulier** : 4€/an → Copiez le Price ID
   - **Pro** : 29€/an → Copiez le Price ID
4. Dans **Webhooks**, créez un endpoint :
   - URL : `https://votre-domaine.com/api/stripe/webhook`
   - Events : Sélectionnez tous les events `customer.subscription.*` et `invoice.*`
   - Copiez le `Signing secret` → `STRIPE_WEBHOOK_SECRET`

### 3. Configuration locale (1 min)

```bash
# Copiez le fichier d'environnement
cp .env.local.example .env.local

# Éditez .env.local avec vos vraies clés
nano .env.local  # ou utilisez votre éditeur préféré
```

### 4. Lancement

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Ouvrez http://localhost:3000
```

## 📋 Checklist de vérification

- [ ] Supabase : Les tables sont créées
- [ ] Stripe : Les produits sont configurés
- [ ] .env.local : Toutes les variables sont remplies
- [ ] L'application se lance sans erreur
- [ ] La page d'accueil s'affiche correctement
- [ ] Le convertisseur PDF fonctionne
- [ ] L'inscription/connexion fonctionne
- [ ] Les paiements Stripe fonctionnent (mode test)

## 🔧 Commandes utiles

```bash
# Développement
npm run dev              # Lance le serveur de développement

# Production
npm run build           # Build pour production
npm run start           # Lance le serveur de production

# Stripe (nécessite Stripe CLI)
npm run stripe:listen   # Écoute les webhooks en local

# Qualité
npm run lint            # Vérifie le code
npm run typecheck       # Vérifie les types TypeScript
```

## 🚢 Déploiement sur Vercel

1. Pushez votre code sur GitHub
2. Connectez-vous à [vercel.com](https://vercel.com)
3. Importez votre repository
4. Ajoutez les variables d'environnement
5. Déployez !

## 📝 Test de l'application

### Test sans authentification
1. Allez sur `/convert`
2. Uploadez un PDF de calendrier de collecte
3. Configurez les rappels
4. Téléchargez le fichier .ics
5. Importez dans votre calendrier

### Test avec compte gratuit
1. Créez un compte sur `/auth/register`
2. Confirmez votre email
3. Connectez-vous
4. Faites 3 conversions (limite gratuite)
5. Vérifiez que la 4ème est bloquée

### Test du paiement (mode test Stripe)
1. Cliquez sur "Passer au plan Particulier"
2. Utilisez la carte test : `4242 4242 4242 4242`
3. Date d'expiration : N'importe quelle date future
4. CVC : N'importe quel nombre à 3 chiffres
5. Vérifiez que l'abonnement est actif

## 🐛 Dépannage

### Erreur Supabase
- Vérifiez que les clés API sont correctes
- Vérifiez que les tables sont créées
- Vérifiez les politiques RLS

### Erreur Stripe
- Vérifiez que vous êtes en mode Test
- Vérifiez que les Price IDs sont corrects
- Vérifiez le webhook secret

### Erreur PDF
- Vérifiez que le fichier est bien un PDF
- Vérifiez qu'il fait moins de 10MB
- Essayez avec un PDF simple d'abord

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 💬 Support

- Email : support@poubelleday.com
- GitHub Issues : [github.com/yourusername/poubelleday/issues](https://github.com/yourusername/poubelleday/issues)

---

**Bon développement !** 🚀