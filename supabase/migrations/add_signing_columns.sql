-- Add signing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS signing_token text,
ADD COLUMN IF NOT EXISTS signed_at timestamptz,
ADD COLUMN IF NOT EXISTS client_signature text;

-- Create index on signing_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_signing_token 
ON public.projects (signing_token) 
WHERE signing_token IS NOT NULL;

-- Allow anonymous users to read projects by signing_token (for public proposal page)
-- and update status/signature when signing
CREATE POLICY "Allow public read by signing_token" ON public.projects
    FOR SELECT
    USING (signing_token IS NOT NULL);

CREATE POLICY "Allow public signing by token" ON public.projects
    FOR UPDATE
    USING (signing_token IS NOT NULL)
    WITH CHECK (signing_token IS NOT NULL);
