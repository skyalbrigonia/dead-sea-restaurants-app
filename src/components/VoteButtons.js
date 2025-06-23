'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const VoteButtons = ({ reviewId }) => {
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ottieni l'IP dell'utente (semplificato - in produzione useresti un sistema di auth più robusto)
  const getUserIP = useCallback(async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Errore nel recupero IP:', error);
      return `anonymous_${Date.now()}`; // Fallback
    }
  }, []);

  // Carica i voti esistenti
  const fetchVotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('review_votes')
        .select('vote_type, user_ip')
        .eq('review_id', reviewId);

      if (error) throw error;

      const upvotes = data.filter(vote => vote.vote_type === 'upvote').length;
      const downvotes = data.filter(vote => vote.vote_type === 'downvote').length;
      
      setVotes({ upvotes, downvotes });

      // Controlla se l'utente ha già votato
      const userIP = await getUserIP();
      const userVoteData = data.find(vote => vote.user_ip === userIP);
      setUserVote(userVoteData?.vote_type || null);

    } catch (error) {
      console.error('Errore nel caricamento voti:', error);
    }
  }, [reviewId, getUserIP]);

  // Gestisce il voto
  const handleVote = useCallback(async (voteType) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const userIP = await getUserIP();

      // Se l'utente ha già votato la stessa cosa, rimuovi il voto
      if (userVote === voteType) {
        const { error } = await supabase
          .from('review_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_ip', userIP);

        if (error) throw error;
        setUserVote(null);
      } else {
        // Rimuovi il voto precedente se esiste
        await supabase
          .from('review_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_ip', userIP);

        // Aggiungi il nuovo voto
        const { error } = await supabase
          .from('review_votes')
          .insert([{
            review_id: reviewId,
            user_ip: userIP,
            vote_type: voteType
          }]);

        if (error) throw error;
        setUserVote(voteType);
      }

      // Ricarica i voti
      await fetchVotes();

    } catch (error) {
      console.error('Errore nel voto:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, userVote, reviewId, getUserIP, fetchVotes]);

  useEffect(() => {
    fetchVotes();

    let channel = null;
    
    try {
      // Real-time updates per i voti
      channel = supabase
        .channel(`votes-${reviewId}-${Date.now()}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'review_votes',
            filter: `review_id=eq.${reviewId}`
          },
          (payload) => {
            console.log('Vote change detected:', payload);
            fetchVotes(); // Ricarica i voti quando cambiano
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to votes for review ${reviewId}`);
          }
        });
    } catch (error) {
      console.error('Error setting up votes subscription:', error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel).then(() => {
          console.log(`Votes channel cleanup completed for review ${reviewId}`);
        }).catch((error) => {
          console.error('Error during votes channel cleanup:', error);
        });
      }
    };
  }, [reviewId, fetchVotes]);

  const VoteButton = ({ type, count, isActive, icon }) => (
    <button
      onClick={() => handleVote(type)}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-1 border transition-colors duration-150 ${
        isActive 
          ? 'border-yellow-400 bg-yellow-400 text-black' 
          : 'border-green-500 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black'
      } disabled:opacity-50`}
      aria-label={`${type === 'upvote' ? 'Vota positivo' : 'Vota negativo'}: ${count} voti`}
    >
      <span className="text-sm">{icon}</span>
      <span className="font-mono">{count}</span>
    </button>
  );

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-yellow-400">[ VOTI_UTENTI ]</span>
      <VoteButton 
        type="upvote" 
        count={votes.upvotes} 
        isActive={userVote === 'upvote'}
        icon="▲"
      />
      <VoteButton 
        type="downvote" 
        count={votes.downvotes} 
        isActive={userVote === 'downvote'}
        icon="▼"
      />
      {loading && <span className="animate-pulse">[ ... ]</span>}
    </div>
  );
};

export default VoteButtons; 