# Vercel + Supabase Deployment Guide

## Prerequisites
- Vercel account (free)
- Supabase account (free)
- Git repository

## Step 1: Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and project name
   - Set database password
   - Wait for project to be ready

2. **Create Database Table**
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the SQL from `database.sql`
   - This creates the `nail_images` table and storage bucket

3. **Get Environment Variables**
   - Go to Project Settings > API
   - Copy the Project URL and anon key
   - These will be your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Step 2: Set Up Local Environment

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Update .env.local**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Test Locally**
   ```bash
   npm run dev
   ```

## Step 3: Deploy to Vercel

1. **Install Vercel CLI** (already done)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   vercel
   ```
   - Follow prompts
   - Choose Vercel account
   - Set project name
   - Deploy to production

4. **Set Environment Variables in Vercel**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`: your_supabase_project_url
     - `VITE_SUPABASE_ANON_KEY`: your_supabase_anon_key

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## Features Now Available

### Cross-Device Sync
- Upload on phone, see on desktop
- Real-time updates across all devices
- No more localStorage limitations

### Cloud Storage
- Images stored in Supabase Storage
- Automatic optimization
- CDN delivery for fast loading

### Database Features
- Persistent data storage
- Shape filtering and search
- User management ready (if needed later)

## What's Changed

### Admin Panel
- Uploads to Supabase Storage instead of localStorage
- Database operations for CRUD operations
- Real-time sync across devices

### Gallery
- Loads images from Supabase database
- Shows both mock and uploaded images
- Shape filtering works with uploaded images

### Environment Variables
- Local: `.env.local`
- Production: Vercel Environment Variables

## Troubleshooting

### Images Not Loading
- Check environment variables are set correctly
- Verify Supabase project is active
- Check database table exists

### Upload Issues
- Check storage bucket permissions
- Verify file size limits (Supabase: 50MB per file)
- Check network connectivity

### Deployment Issues
- Ensure all environment variables are set in Vercel
- Check build logs for errors
- Verify Supabase connection

## Next Steps (Optional)

1. **Add Authentication**
   - User login/signup
   - Private image galleries
   - User-specific uploads

2. **Add More Features**
   - Image editing
   - Batch operations
   - Export functionality

3. **Scale Up**
   - Paid Supabase plan for more storage
   - Custom domain
   - Analytics

Your nail gallery is now ready for cross-device use with Vercel + Supabase!
