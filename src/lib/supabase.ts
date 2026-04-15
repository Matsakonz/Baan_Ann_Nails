import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseAvailable = !!supabase

// Database types
export interface NailImage {
  id: string
  image_url: string
  shape: string
  created_at: string
  user_id?: string
}

export interface Database {
  public: {
    Tables: {
      nail_images: {
        Row: NailImage
        Insert: Omit<NailImage, 'id' | 'created_at'>
        Update: Partial<NailImage>
      }
    }
  }
}
