import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validazione delle variabili d'ambiente
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL non è configurata. Controlla il file .env.local');
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY non è configurata. Controlla il file .env.local');
}

// Crea il client Supabase con configurazioni ottimizzate
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disabilita la persistenza della sessione se non necessaria
  },
  realtime: {
    params: {
      eventsPerSecond: 5 // Limita gli eventi real-time per evitare spam
    }
  }
})