# PoubelleDay - Convertisseur de calendrier de collecte des déchets

## Description

PoubelleDay est un micro-SaaS qui convertit les calendriers PDF de collecte des déchets en fichiers .ics importables dans tous les calendriers numériques (Google Calendar, Apple Calendar, Outlook, etc.).

## Fonctionnalités

- ✅ **Parser PDF intelligent** : Extraction automatique des dates et types de collecte
- ✅ **Génération ICS universelle** : Compatible avec tous les calendriers
- ✅ **Rappels personnalisés** : Notifications la veille et/ou le matin même
- ✅ **Interface intuitive** : Process en 3 étapes simples
- ✅ **Multi-types de déchets** : Ordures ménagères, recyclage, verre, encombrants, etc.
- ✅ **Édition manuelle** : Ajout/modification/suppression d'événements
- ✅ **Multi-timezone** : Support de différents fuseaux horaires

## Stack technique

- **Frontend** : Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components** : shadcn/ui, Framer Motion
- **Backend** : Next.js API Routes
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **Paiements** : Stripe
- **Email** : Resend
- **PDF Parsing** : pdf-parse
- **ICS Generation** : ical-generator

## Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase (gratuit)
- Compte Stripe (pour les paiements)
- Compte Resend (pour les emails)

### 1. Cloner le repository

```bash
git clone https://github.com/yourusername/poubelleday.git
cd poubelleday
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com)
2. Récupérez votre URL et clés API dans Settings > API
3. Exécutez les migrations SQL :

```bash
npx supabase db push
```

Ou copiez le contenu de `supabase/migrations/001_initial_schema.sql` dans l'éditeur SQL de Supabase.

### 4. Variables d'environnement

Copiez `.env.local.example` en `.env.local` et remplissez avec vos vraies valeurs :

```bash
cp .env.local.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@votredomaine.com

# App
NEXT_PUBLIC_APP_URL=https://votredomaine.com
```

### 5. Configuration Stripe

1. Créez les produits et prix dans Stripe Dashboard
2. Notez les Price IDs pour les plans Individual et Pro
3. Configurez le webhook endpoint : `https://votredomaine.com/api/stripe/webhook`

### 6. Lancer le développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Structure du projet

```
poubelleday/
├── app/                    # Pages et routes Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   ├── convert/           # Page de conversion
│   └── dashboard/         # Dashboard utilisateur
├── components/            # Composants React
│   ├── convert/          # Composants de conversion
│   ├── landing/          # Composants page d'accueil
│   ├── layout/           # Header, Footer, etc.
│   └── ui/               # Composants shadcn/ui
├── lib/                   # Logique métier
│   ├── calendar/         # Génération ICS
│   ├── pdf/              # Parsing PDF
│   ├── stripe/           # Intégration Stripe
│   └── supabase/         # Client Supabase
├── types/                 # Types TypeScript
└── utils/                 # Utilitaires

```

## Déploiement

### Vercel (recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez

```bash
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Utilisation

### Pour les utilisateurs

1. **Upload PDF** : Glissez-déposez votre calendrier PDF
2. **Configuration** : Choisissez vos préférences de rappel
3. **Téléchargement** : Récupérez le fichier .ics
4. **Import** : Importez dans votre calendrier

### Pour les développeurs

#### Ajouter un nouveau type de déchet

Modifiez `lib/constants.ts` :

```typescript
export const WASTE_TYPES = {
  // ...
  nouveau_type: {
    label: 'Nouveau Type',
    color: '#123456',
    icon: '🆕'
  }
};
```

#### Améliorer le parser PDF

Le parser est dans `lib/pdf/parser.ts`. Ajoutez de nouveaux patterns de détection dans les méthodes :
- `extractByDatePatterns()` : Pour les formats de date
- `detectWasteType()` : Pour les mots-clés de types de déchets

## Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Linting
npm run lint
```

## Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Roadmap

- [ ] Support OCR pour les images de calendriers
- [ ] Notifications SMS (Twilio)
- [ ] API pour les syndics/collectivités
- [ ] Application mobile
- [ ] Multi-langue
- [ ] Import direct depuis sites de mairies

## Support

Pour toute question ou problème :
- Email : support@poubelleday.com
- Issues : [GitHub Issues](https://github.com/yourusername/poubelleday/issues)

## License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Crédits

Développé avec ❤️ par l'équipe PoubelleDay

---

**Note** : Ce projet est en phase MVP. Des bugs peuvent survenir. N'hésitez pas à les signaler !