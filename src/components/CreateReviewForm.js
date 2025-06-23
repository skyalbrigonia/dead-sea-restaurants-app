'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreateReviewForm({ onNewReview }) {
  const [restaurantName, setRestaurantName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3);
  const [mapsLink, setMapsLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const data = {
        "restaurant_name": restaurantName, 
        "review_text": reviewText,
        "rating": Number(rating), 
        "maps_link": mapsLink,
      };
      
      const { data: insertedData, error } = await supabase
        .from('reviews')
        .insert([data])
        .select();
      
      if (error) throw error;
      
      // Call the callback immediately to update the UI
      if (onNewReview && insertedData && insertedData[0]) {
        onNewReview(insertedData[0]);
      }
      
      setRestaurantName(''); 
      setReviewText(''); 
      setRating(3); 
      setMapsLink('');
      setSuccess('LOG INSERITO CORRETTAMENTE');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('TRASMISSIONE DATI FALLITA'); 
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (e) => {
    let value = e.target.value;
    if (value === '') { setRating(''); return; }
    let numValue = parseInt(value, 10);
    if (numValue > 5) numValue = 5; if (numValue < 1) numValue = 1;
    setRating(numValue);
  };

  // FIX: Sostituito il pulsante <pre> con un bottone standard più robusto e responsive
  const SubmitButton = ({ disabled }) => (
    <button type="submit" disabled={disabled} className="w-full mt-4 p-3 text-lg border-2 border-green-500 hover:bg-green-500 hover:text-black disabled:border-gray-500 disabled:text-gray-500">
        [ CLICK HERE TO SUBMIT ]
    </button>
  );

  return (
    <div className="border-2 border-green-500 p-4 mb-8 shadow-[0_0_15px_rgba(51,255,51,0.5)]">
      <p className="text-2xl mb-4">[ NUOVO INSERIMENTO LOG ]</p>
      <form onSubmit={handleSubmit} className="space-y-4 text-lg">
        <div className="border border-green-500 p-2">
            <label htmlFor="restaurant" className="block text-yellow-400">NOME_RISTORANTE:</label>
            {/* FIX: L'input ora riempie lo spazio disponibile */}
            <div className="flex items-center">
                <span className="mr-2">{'>'}</span>
                <input id="restaurant" type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required className="flex-grow"/>
            </div>
        </div>
        <div className="border border-green-500 p-2">
            <label htmlFor="review" className="block text-yellow-400">RECENSIONE_TXT:</label>
            <div className="flex items-start">
                <span className="mr-2">{'>'}</span>
                <textarea id="review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} required className="flex-grow"/>
            </div>
        </div>
        <div className="border border-green-500 p-2">
            <label htmlFor="maps" className="block text-yellow-400">LINK_MAPS (Opzionale):</label>
            <div className="flex items-center">
                <span className="mr-2">{'>'}</span>
                <input id="maps" type="url" value={mapsLink} onChange={(e) => setMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." className="flex-grow"/>
            </div>
        </div>
        <div className="border border-green-500 p-2">
          <label htmlFor="rating" className="block text-yellow-400">VOTO [1-5]:</label>
          <div className="flex items-center">
              <span className="mr-2">{'>'}</span>
              <input id="rating" type="number" value={rating} onChange={handleRatingChange} required className="w-auto" />
          </div>
        </div>
        {error && <p className="text-red-500 text-shadow-none">[ ERRORE: {error} ]</p>}
        {success && <p className="text-yellow-400 animate-pulse text-shadow-none">[ SUCCESSO: {success} ]</p>}
        <SubmitButton disabled={isSubmitting} />
      </form>
    </div>
  );
}
