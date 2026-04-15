-- Create nail_images table
CREATE TABLE IF NOT EXISTS nail_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  shape TEXT NOT NULL CHECK (shape IN ('almond', 'square', 'squoval', 'oval', 'short', 'sharp', 'coffin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_nail_images_shape ON nail_images(shape);
CREATE INDEX IF NOT EXISTS idx_nail_images_created_at ON nail_images(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE nail_images ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see all images (public gallery)
CREATE POLICY "Public images are viewable by everyone" ON nail_images
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert images
CREATE POLICY "Authenticated users can insert images" ON nail_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for users to update their own images
CREATE POLICY "Users can update own images" ON nail_images
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own images
CREATE POLICY "Users can delete own images" ON nail_images
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nail-images', 'nail-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public access to images
CREATE POLICY "Public images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'nail-images');

-- Create storage policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'nail-images' AND 
    auth.role() = 'authenticated'
  );

-- Create storage policy for users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'nail-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'nail-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
