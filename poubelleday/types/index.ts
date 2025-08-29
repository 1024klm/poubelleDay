export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'individual' | 'pro';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
}

export interface Conversion {
  id: string;
  user_id?: string;
  filename: string;
  extracted_events: ExtractedEvent[];
  ics_url?: string;
  config: ConversionConfig;
  created_at: string;
}

export interface ExtractedEvent {
  date: string;
  type: WasteType;
  label: string;
  color: string;
  time: string;
  recurrence?: RecurrenceRule;
}

export type WasteType = 
  | 'ordures_menageres' 
  | 'recyclage' 
  | 'verre' 
  | 'encombrants' 
  | 'dechets_verts'
  | 'cartons'
  | 'autres';

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  byweekday?: number[];
  bymonthday?: number[];
  count?: number;
  until?: string;
}

export interface ConversionConfig {
  timezone: string;
  reminders: ReminderConfig;
  colors: Record<WasteType, string>;
}

export interface ReminderConfig {
  evening: boolean;
  eveningTime: string;
  morning: boolean;
  morningTime: string;
}

export interface UsageStats {
  user_id: string;
  conversions_count: number;
  last_conversion?: string;
  updated_at: string;
}

export interface PricingPlan {
  id: 'free' | 'individual' | 'pro';
  name: string;
  price: number;
  features: string[];
  conversionsLimit?: number;
  highlighted?: boolean;
}