-- Complete Supabase setup for nail gallery
-- Run this in your Supabase SQL Editor

-- 1. Create nail_images table first
CREATE TABLE IF NOT EXISTS nail_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  shape TEXT NOT NULL CHECK (shape IN ('almond', 'square', 'squoval', 'oval', 'short', 'sharp', 'coffin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nail_images_shape ON nail_images(shape);
CREATE INDEX IF NOT EXISTS idx_nail_images_created_at ON nail_images(created_at DESC);

-- Enable Row Level Security
ALTER TABLE nail_images ENABLE ROW LEVEL SECURITY;

-- 2. Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nail-images', 'nail-images', true) 
ON CONFLICT (id) DO NOTHING;

-- 3. Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Public images are viewable by everyone" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can insert images" ON nail_images;
DROP POLICY IF EXISTS "Users can update own images" ON nail_images;
DROP POLICY IF EXISTS "Users can delete own images" ON nail_images;
DROP POLICY IF EXISTS "Public images are viewable by everyone" ON nail_images;

-- 4. Create new storage policies (public access)
CREATE POLICY "Public images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'nail-images');

CREATE POLICY "Public uploads allowed" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'nail-images');

CREATE POLICY "Public updates allowed" ON storage.objects
  FOR UPDATE USING (bucket_id = 'nail-images');

CREATE POLICY "Public deletions allowed" ON storage.objects
  FOR DELETE USING (bucket_id = 'nail-images');

-- 5. Create new database policies (public access)
CREATE POLICY "Public images are viewable by everyone" ON nail_images
  FOR SELECT USING (true);

CREATE POLICY "Public insert allowed" ON nail_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update allowed" ON nail_images
  FOR UPDATE USING (true);

CREATE POLICY "Public delete allowed" ON nail_images
  FOR DELETE USING (true);
