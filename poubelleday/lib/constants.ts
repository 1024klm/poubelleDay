import { WasteType, PricingPlan } from '@/types';

export const WASTE_TYPES: Record<WasteType, { label: string; color: string; icon: string }> = {
  ordures_menageres: {
    label: 'Ordures ménagères',
    color: '#666666',
    icon: '🗑️'
  },
  recyclage: {
    label: 'Tri sélectif',
    color: '#0EA5E9',
    icon: '♻️'
  },
  verre: {
    label: 'Verre',
    color: '#10B981',
    icon: '🍾'
  },
  encombrants: {
    label: 'Encombrants',
    color: '#F59E0B',
    icon: '🛋️'
  },
  dechets_verts: {
    label: 'Déchets verts',
    color: '#84CC16',
    icon: '🌿'
  },
  cartons: {
    label: 'Cartons',
    color: '#8B5CF6',
    icon: '📦'
  },
  autres: {
    label: 'Autres',
    color: '#6B7280',
    icon: '📋'
  }
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    features: [
      '3 conversions par an',
      'Export format .ics',
      'Rappels basiques',
      'Support par email'
    ],
    conversionsLimit: 3
  },
  {
    id: 'individual',
    name: 'Particulier',
    price: 4,
    features: [
      'Conversions illimitées',
      'Export format .ics',
      'Rappels personnalisés',
      'Historique des conversions',
      'Support prioritaire'
    ],
    highlighted: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: [
      'Tout du plan Particulier',
      'Multi-utilisateurs',
      'API dédiée',
      'Personnalisation avancée',
      'Support téléphonique',
      'Formation incluse'
    ]
  }
];

export const DEFAULT_REMINDER_CONFIG = {
  evening: true,
  eveningTime: '19:00',
  morning: false,
  morningTime: '07:00'
};

export const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (France)' },
  { value: 'Europe/Brussels', label: 'Bruxelles (Belgique)' },
  { value: 'Europe/Luxembourg', label: 'Luxembourg' },
  { value: 'Europe/Zurich', label: 'Zurich (Suisse)' },
  { value: 'America/Montreal', label: 'Montréal (Canada)' },
  { value: 'Indian/Reunion', label: 'La Réunion' },
  { value: 'America/Martinique', label: 'Martinique' },
  { value: 'America/Guadeloupe', label: 'Guadeloupe' },
  { value: 'Pacific/Noumea', label: 'Nouvelle-Calédonie' },
  { value: 'Pacific/Tahiti', label: 'Tahiti' }
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf']
};

export const PDF_PARSING_KEYWORDS = {
  ordures_menageres: ['ordures ménagères', 'om', 'ordures', 'déchets ménagers', 'poubelle noire', 'poubelle grise'],
  recyclage: ['recyclage', 'tri sélectif', 'tri', 'emballages', 'poubelle jaune', 'recyclables'],
  verre: ['verre', 'bouteilles', 'bocaux', 'poubelle verte'],
  encombrants: ['encombrants', 'gros déchets', 'monstres', 'volumineux'],
  dechets_verts: ['déchets verts', 'végétaux', 'jardin', 'compost', 'biodéchets'],
  cartons: ['cartons', 'papiers', 'journaux', 'magazines']
};

export const DATE_PATTERNS = [
  /(\d{1,2})\/(\d{1,2})\/(\d{4})/g, // DD/MM/YYYY
  /(\d{1,2})-(\d{1,2})-(\d{4})/g, // DD-MM-YYYY
  /(\d{1,2}) (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) (\d{4})/gi,
  /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche) (\d{1,2})/gi,
  /tous les (lundis|mardis|mercredis|jeudis|vendredis|samedis|dimanches)/gi
];