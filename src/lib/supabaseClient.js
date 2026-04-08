import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eurvxmhbhjhryqavygla.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MkjmMvVN8MbhX0V7vzQAcg_bmzBdgre'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
