'use client';
import { useState, useEffect } from 'react';

const CRTToggle = () => {
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Carica le preferenze salvate al mount del componente
  useEffect(() => {
    setMounted(true);
    
    try {
      const saved = localStorage.getItem('crt-enabled');
      if (saved !== null) {
        setCrtEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Errore nel caricamento delle preferenze CRT:', error);
      // Mantieni il valore di default in caso di errore
    }
  }, []);

  // Salva le preferenze e applica i CSS al cambio di stato
  useEffect(() => {
    if (!mounted) return; // Non salvare fino a quando il componente non è montato
    
    try {
      localStorage.setItem('crt-enabled', JSON.stringify(crtEnabled));
    } catch (error) {
      console.error('Errore nel salvataggio delle preferenze CRT:', error);
    }
    
    // Toggle CRT classes on body
    if (crtEnabled) {
      document.body.classList.add('crt-active');
      document.body.classList.remove('crt-disabled');
    } else {
      document.body.classList.add('crt-disabled');
      document.body.classList.remove('crt-active');
    }
  }, [crtEnabled, mounted]);

  // Pulizia al dismount del componente
  useEffect(() => {
    return () => {
      document.body.classList.remove('crt-active', 'crt-disabled');
    };
  }, []);

  return (
    <button
      onClick={() => setCrtEnabled(!crtEnabled)}
      className="fixed top-4 right-4 z-50 px-3 py-1 text-xs border border-green-500 hover:bg-green-500 hover:text-black transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500"
      title={crtEnabled ? "Disabilita effetto CRT" : "Abilita effetto CRT"}
      aria-label={crtEnabled ? "Disabilita effetto CRT" : "Abilita effetto CRT"}
    >
      [ CRT: {crtEnabled ? 'ON' : 'OFF'} ]
    </button>
  );
};

export default CRTToggle; 