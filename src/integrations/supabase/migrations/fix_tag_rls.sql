
-- First, check if organization_id column exists in tags table, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'tags' AND column_name = 'organization_id'
    ) THEN
        ALTER TABLE public.tags ADD COLUMN organization_id UUID;
    END IF;
END $$;

-- Enable RLS on the tags table if not already enabled
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow authenticated users to create tags" ON public.tags;
DROP POLICY IF EXISTS "Allow authenticated users to read tags" ON public.tags;
DROP POLICY IF EXISTS "Allow authenticated users to read their own tags" ON public.tags;
DROP POLICY IF EXISTS "Allow users to update their own tags" ON public.tags;
DROP POLICY IF EXISTS "Allow users to delete their own tags" ON public.tags;

-- Create policies
CREATE POLICY "Allow authenticated users to create tags" 
ON public.tags 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Modified policy to only allow users to see their own tags
CREATE POLICY "Allow authenticated users to read their own tags" 
ON public.tags 
FOR SELECT 
TO authenticated 
USING (created_by = auth.uid());

CREATE POLICY "Allow users to update their own tags" 
ON public.tags 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own tags" 
ON public.tags 
FOR DELETE 
TO authenticated 
USING (auth.uid() = created_by);
