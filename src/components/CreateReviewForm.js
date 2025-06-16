'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreateReviewForm() {
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
      await supabase.from('reviews').insert([data]);
      setRestaurantName('');
      setReviewText('');
      setRating(3);
      setMapsLink('');
      setSuccess('LOG ADDED');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('TRANSMISSION FAILED');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (e) => {
    let value = e.target.value;
    if (value === '') {
        setRating('');
        return;
    }
    let numValue = parseInt(value, 10);
    if (numValue > 5) numValue = 5;
    if (numValue < 1) numValue = 1;
    setRating(numValue);
  };


  const AsciiSubmitButton = ({ disabled }) => (
    <button type="submit" disabled={disabled} className="w-full mt-4 text-lg group bg-transparent border-none">
        <pre className={'text-center p-2 border-2 border-green-500 group-hover:bg-green-500 group-hover:text-black group-disabled:border-gray-500 group-disabled:text-gray-500'}>
{`+================================+
|    CLICK HERE TO SUBMIT      |
+================================+`}
        </pre>
    </button>
  );

  return (
    <div className="border-2 border-green-500 p-4 mb-8 shadow-[0_0_15px_rgba(51,255,51,0.5)]">
      <p className="text-2xl mb-4">[ NEW LOG ENTRY ]</p>
      <form onSubmit={handleSubmit} className="space-y-4 text-lg">
        <div className="border border-green-500 p-2">
            <label htmlFor="restaurant" className="block text-yellow-400">RESTAURANT_NAME:</label>
            <div className="flex items-center">
                <span className="mr-2">{'>'}</span>
                <input id="restaurant" type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required />
            </div>
        </div>
        <div className="border border-green-500 p-2">
            <label htmlFor="review" className="block text-yellow-400">REVIEW_TXT:</label>
            <div className="flex items-start">
                <span className="mr-2">{'>'}</span>
                <textarea id="review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} required />
            </div>
        </div>
        <div className="border border-green-500 p-2">
            <label htmlFor="maps" className="block text-yellow-400">LINK_MAPS (Opzionale):</label>
            <div className="flex items-center">
                <span className="mr-2">{'>'}</span>
                <input id="maps" type="url" value={mapsLink} onChange={(e) => setMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
            </div>
        </div>
        <div className="border border-green-500 p-2">
          <label htmlFor="rating" className="block text-yellow-400">VOTE [1-5]:</label>
          <div className="flex items-center">
              <span className="mr-2">{'>'}</span>
              <input id="rating" type="number" value={rating} onChange={handleRatingChange} required className="w-auto" />
          </div>
        </div>
        {error && <p className="text-red-500 text-shadow-none">[ ERROR: {error} ]</p>}
        {success && <p className="text-yellow-400 animate-pulse text-shadow-none">[ SUCCESS: {success} ]</p>}
        <AsciiSubmitButton disabled={isSubmitting} />
      </form>
    </div>
  );
}
