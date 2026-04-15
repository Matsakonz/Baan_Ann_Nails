-- Allow public uploads to nail-images bucket
-- Run this in Supabase SQL Editor

-- Drop existing storage policies that require authentication
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

-- Create new policy allowing public uploads
CREATE POLICY "Public uploads allowed" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'nail-images'
  );

-- Also allow public deletions for admin functionality
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

CREATE POLICY "Public deletions allowed" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'nail-images'
  );
