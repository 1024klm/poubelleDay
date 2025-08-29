export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string
          user_id: string | null
          plan: 'free' | 'individual' | 'pro'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          plan?: 'free' | 'individual' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          plan?: 'free' | 'individual' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversions: {
        Row: {
          id: string
          user_id: string | null
          filename: string
          extracted_events: Json
          ics_url: string | null
          config: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          filename: string
          extracted_events?: Json
          ics_url?: string | null
          config?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          filename?: string
          extracted_events?: Json
          ics_url?: string | null
          config?: Json
          created_at?: string
        }
      }
      usage_stats: {
        Row: {
          user_id: string
          conversions_count: number
          last_conversion: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          conversions_count?: number
          last_conversion?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          conversions_count?: number
          last_conversion?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}