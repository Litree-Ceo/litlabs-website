-- Migration: Add clerk_id column to profiles table
-- Date: 2025-06-10
-- Required for Clerk webhook integration

-- Add clerk_id column if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);

-- Migrate existing users to use clerk_id
-- This is a placeholder - run after schema is updated
UPDATE public.profiles SET clerk_id = id::TEXT WHERE clerk_id IS NULL;

-- Add comment
COMMENT ON COLUMN public.profiles.clerk_id IS 'Clerk external user ID for authentication';