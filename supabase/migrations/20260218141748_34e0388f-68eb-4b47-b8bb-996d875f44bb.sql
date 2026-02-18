
-- Create table to store AI tools
CREATE TABLE public.ai_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  how_to_use TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New Launch',
  url TEXT NOT NULL DEFAULT '',
  generated_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth needed to view tools)
CREATE POLICY "Anyone can view AI tools"
  ON public.ai_tools
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete (via edge function)
-- No additional policies needed since service_role bypasses RLS

-- Enable pg_cron and pg_net extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Index for faster queries by date
CREATE INDEX idx_ai_tools_generated_at ON public.ai_tools (generated_at DESC);
