import { supabase } from '@/lib/supabaseClient'

export default async function sitemap() {
  const baseUrl = 'https://reviews.andreaalbrigoni.com'
  
  // URL principale sempre presente
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  try {
    // Fetch delle recensioni per includere nella sitemap (opzionale)
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, created_at, restaurant_name')
      .order('created_at', { ascending: false })
      .limit(100) // Limita a 100 per evitare sitemap troppo grandi

    if (!error && reviews) {
      // Se in futuro aggiungessi pagine per singole recensioni, potresti includerle qui
      // Per ora aggiungiamo solo la homepage con l'ultima data di modifica delle recensioni
      const latestReview = reviews[0]
      if (latestReview) {
        routes[0].lastModified = new Date(latestReview.created_at)
      }
    }
  } catch (error) {
    console.error('Errore nella generazione sitemap:', error)
    // Continua con la sitemap di base anche in caso di errore
  }

  return routes
} 