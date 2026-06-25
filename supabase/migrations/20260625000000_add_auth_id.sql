-- ============================================
-- Migration: Add auth_id column for Supabase Auth
-- Replaces clerk_id with auth_id
-- ============================================

-- Add auth_id column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_id uuid UNIQUE;

-- Copy existing clerk_id values to auth_id where clerk_id is a valid UUID
UPDATE public.users
SET auth_id = clerk_id::uuid
WHERE clerk_id IS NOT NULL
  AND clerk_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Create index on auth_id
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);

-- Add foreign key to auth.users (optional but recommended)
-- This requires the user to exist in auth.users first
-- ALTER TABLE public.users ADD CONSTRAINT users_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Note: The clerk_id column is kept for backward compatibility
-- New users created via Supabase Auth will use auth_id instead
