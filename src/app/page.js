'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CreateReviewForm from '@/components/CreateReviewForm';
import DonutAsciiHeader from '@/components/DonutAsciiHeader';
import NervLogo from '@/components/NervLogo';
import SeeleLogo from '@/components/SeeleLogo';
// FIX: Importato il nuovo componente per i filtri
import FilterControls from '@/components/FilterControls';

export default function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // FIX: Aggiunto un nuovo stato per tenere traccia del filtro attivo
  const [activeFilter, setActiveFilter] = useState(null); // null = mostra tutte

  // FIX: La funzione ora accetta un filtro per la query a Supabase
  async function fetchReviews(filter) {
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      // Se un filtro è attivo, lo aggiunge alla query
      if (filter !== null) {
        query = query.eq('rating', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setReviews(data);

    } catch (error) {
      console.error("Errore nel caricamento delle recensioni:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // FIX: Questo 'effect' viene eseguito ogni volta che l'utente cambia il filtro
  useEffect(() => {
    fetchReviews(activeFilter);
  }, [activeFilter]);

  // FIX: Questo 'effect' gestisce gli aggiornamenti in tempo reale
  useEffect(() => {
    const channel = supabase
      .channel('realtime reviews')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reviews' },
        (payload) => {
          // Aggiunge la nuova recensione solo se corrisponde al filtro attivo
          // o se non c'è nessun filtro attivo
          if (activeFilter === null || payload.new.rating === activeFilter) {
            setReviews((currentReviews) => [payload.new, ...currentReviews]);
          }
        }
      )
      .subscribe();

    // Funzione di cleanup
    return () => {
      supabase.removeChannel(channel);
    };
    // Esegui di nuovo se il filtro cambia, per aggiornare la sottoscrizione
  }, [activeFilter]);

  return (
    <div className="container mx-auto p-4 max-w-7xl font-mono min-h-screen flex flex-col">
      
      <header className="w-full flex justify-center items-center min-h-32">
        <DonutAsciiHeader />
      </header>

      <main className="flex-grow">
          <p className="text-center -mt-6 mb-8">[ Piattaforma Recensioni ASCII System ]</p>
          
          <div className="max-w-4xl mx-auto">
            {/* FIX: Aggiunto il componente per i controlli del filtro */}
            <FilterControls activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            
            <CreateReviewForm />

            <div className="mt-12">
              <p className="mb-4 text-xl">[ LOG RECENSIONI PRECEDENTI ]</p>
              {loading ? (
                <p className="text-center animate-pulse">[ CARICAMENTO DATI DAL SERVER... ]</p>
              ) : (
                <div className="space-y-10">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="border-2 border-green-500 p-4 shadow-[0_0_15px_rgba(51,255,51,0.5)]">
                            <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-green-500 border-dashed pb-2 mb-2">
                                <p className="text-2xl break-words">{`> ${review.restaurant_name}`}</p>
                                <p className="text-sm mt-2 md:mt-0">{new Date(review.created_at).toLocaleDateString('it-IT')}</p>
                            </div>
                            <p className="my-3 text-lg break-words before:content-['MSG:__']">{review.review_text}</p>
                            
                            {review.maps_link && (
                                <div className="my-3">
                                    <a 
                                        href={review.maps_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-yellow-400 hover:bg-yellow-400 hover:text-black p-1 border border-yellow-400 bg-transparent"
                                    >
                                        [ POSIZIONE SU MAPPA ]
                                    </a>
                                </div>
                            )}

                            <div className="text-right mt-4 border-t-2 border-green-500 border-dashed pt-2 flex justify-between items-center">
                                <span></span>
                                <p className="text-xl">{`VOTO: [${review.rating}/5] [${'█'.repeat(review.rating)}${'░'.repeat(5 - review.rating)}] (${(review.rating / 5 * 100).toFixed(0)}%)`}</p>
                            </div>
                        </div>
                    ))
                  ) : (
                    <p className="text-center">[ NESSUN RISULTATO TROVATO PER IL FILTRO SELEZIONATO. ]</p>
                  )}
                </div>
              )}
            </div>
          </div>
      </main>
      
      <footer className="w-full flex flex-col md:flex-row justify-between items-center py-8 mt-12 border-t-2 border-green-700 border-dashed space-y-8 md:space-y-0">
         <div>
            <NervLogo />
         </div>
         <div>
            <SeeleLogo />
         </div>
      </footer>
    </div>
  );
}
