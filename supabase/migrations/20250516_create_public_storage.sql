
-- Create a logos storage bucket for the company logo and other public assets
CREATE BUCKET IF NOT EXISTS logos;

-- Allow public read access to the bucket
ALTER BUCKET logos ALLOW PUBLIC READ;

-- Add a policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to logos bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Add a policy to allow public access to read files
CREATE POLICY "Allow public access to logos bucket"
ON storage.objects
FOR SELECT
TO PUBLIC
USING (bucket_id = 'logos');

-- Add email column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END $$;
