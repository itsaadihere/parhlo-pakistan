import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://diklwgumtzgnwiihxhzk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-5KDvS8qwdzHokDH3XyB4g_MDfvOOZu'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
