'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CreateReviewForm from '@/components/CreateReviewForm';
import FilterControls from '@/components/FilterControls';
import VoteButtons from '@/components/VoteButtons';
import CRTToggle from '@/components/CRTToggle';

export default function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  const fetchReviews = useCallback(async (filter) => {
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

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
  }, []);

  useEffect(() => {
    fetchReviews(activeFilter);
  }, [activeFilter, fetchReviews]);

  // Function to handle new review addition
  const handleNewReview = useCallback((newReview) => {
    if (activeFilter === null || newReview.rating === activeFilter) {
      setReviews((currentReviews) => [newReview, ...currentReviews]);
    }
  }, [activeFilter]);

  useEffect(() => {
    let channel = null;
    
    try {
      channel = supabase
        .channel(`realtime-reviews-${Date.now()}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'reviews' },
          (payload) => {
            console.log('New review received:', payload.new);
            handleNewReview(payload.new);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to realtime reviews');
          }
        });
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel).then(() => {
          console.log('Channel cleanup completed');
        }).catch((error) => {
          console.error('Error during channel cleanup:', error);
        });
      }
    };
  }, [handleNewReview]);

  return (
    <div className="crt-system">
      {/* SVG Clip Path for authentic CRT shape */}
      <svg height="0" width="0" viewBox="0 0 93.88 76.19" style={{position: 'absolute'}}>
        <clipPath id="crtPath" clipPathUnits="objectBoundingBox" transform="scale(0.01065 0.01312)">
          <path d="M47.78.5c11.65,0,38,.92,41.81,4,3.59,3,3.79,22.28,3.79,34.19,0,11.67-.08,27.79-3.53,31.24S60.3,75.69,47.78,75.69c-11.2,0-39.89-1.16-44-5.27S.57,52.42.57,38.73.31,8.56,4,4.88,34.77.5,47.78.5Z" />
        </clipPath>
      </svg>
      
      {/* Power button - nella cornice esterna del monitor */}
      <CRTToggle />
      
      <div className="crt-screen-container">
        <div className="crt scanlines">
          <div className="crt-content">
            <div className="container mx-auto p-4 max-w-7xl font-mono min-h-screen flex flex-col">
      
              <header className="w-full text-center py-8">
                <h1 className="text-4xl font-bold mb-4">P.R.A.S.<span className="cursor">&#9608;</span></h1>
                <p className="text-xl">[ Piattaforma Recensioni ASCII System ]</p>
              </header>

              <main className="flex-grow">
                <div className="max-w-4xl mx-auto">
                  <CreateReviewForm onNewReview={handleNewReview} />

                  <div className="mt-12">
                    <FilterControls activeFilter={activeFilter} onFilterChange={setActiveFilter} />

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

                                  <div className="mt-4 border-t-2 border-green-500 border-dashed pt-2">
                                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                          <VoteButtons reviewId={review.id} />
                                          <p className="text-xl">{`VOTO: [${review.rating}/5] [${'█'.repeat(review.rating)}${'░'.repeat(5 - review.rating)}] (${(review.rating / 5 * 100).toFixed(0)}%)`}</p>
                                      </div>
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
              
              <footer className="w-full text-center py-8 mt-12 border-t-2 border-green-700 border-dashed">
                 <p className="text-lg text-green-400">
                    [ POWERED BY NERV MAGI SYSTEM ]
                 </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
