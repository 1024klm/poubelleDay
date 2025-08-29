-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'individual', 'pro')) DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversions table
CREATE TABLE conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  extracted_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  ics_url TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage stats table
CREATE TABLE usage_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  conversions_count INTEGER DEFAULT 0,
  last_conversion TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_created_at ON conversions(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for conversions
CREATE POLICY "Users can view their own conversions"
  ON conversions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create conversions"
  ON conversions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversions"
  ON conversions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversions"
  ON conversions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for usage_stats
CREATE POLICY "Users can view their own stats"
  ON usage_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON usage_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_stats_updated_at BEFORE UPDATE ON usage_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage stats
CREATE OR REPLACE FUNCTION increment_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usage_stats (user_id, conversions_count, last_conversion)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET conversions_count = usage_stats.conversions_count + 1,
      last_conversion = NOW(),
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment usage stats on conversion
CREATE TRIGGER increment_usage_on_conversion
  AFTER INSERT ON conversions
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION increment_usage_stats();