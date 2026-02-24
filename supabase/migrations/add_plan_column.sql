-- Add plan column to profiles table (free by default)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

-- Optional: add a check constraint so only valid plans are stored
ALTER TABLE public.profiles
ADD CONSTRAINT valid_plan CHECK (plan IN ('free', 'pro'));
