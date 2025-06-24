'use client';
import { useState, useEffect } from 'react';

const CRTToggle = () => {
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Applica lo stato di default immediatamente (sempre spento all'avvio)
  useEffect(() => {
    // Aggiungi classe di inizializzazione per prevenire FOUC
    document.body.classList.add('crt-initializing');
    
    // Forza sempre lo stato di default: spento senza animazione
    document.body.classList.add('crt-off');
    document.body.classList.remove('crt-active', 'crt-disabled');
    
    // Forza lo stato a false indipendentemente dal localStorage
    setCrtEnabled(false);
    
    // Rimuovi la classe di inizializzazione dopo che il layout è stabile
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('crt-initializing');
        setMounted(true);
      });
    });
    
    // Opzionale: se vuoi comunque ricordare le preferenze, 
    // decommenta le righe seguenti:
    /*
    try {
      const saved = localStorage.getItem('crt-enabled');
      if (saved !== null) {
        const savedState = JSON.parse(saved);
        setCrtEnabled(savedState);
        // Applica immediatamente lo stato salvato
        if (savedState) {
          document.body.classList.add('crt-active');
          document.body.classList.remove('crt-disabled', 'crt-off');
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento delle preferenze CRT:', error);
    }
    */
  }, []);

  // Applica i CSS al cambio di stato (senza salvare nel localStorage)
  useEffect(() => {
    if (!mounted) return; // Non agire fino a quando il componente non è montato
    
    // Opzionale: se vuoi salvare le preferenze, decommenta le righe seguenti:
    /*
    try {
      localStorage.setItem('crt-enabled', JSON.stringify(crtEnabled));
    } catch (error) {
      console.error('Errore nel salvataggio delle preferenze CRT:', error);
    }
    */
    
    // Toggle CRT classes on body con gestione delle animazioni
    if (crtEnabled) {
      document.body.classList.remove('crt-disabled', 'crt-off');
      document.body.classList.add('crt-active');
    } else {
      document.body.classList.remove('crt-active');
      document.body.classList.add('crt-disabled');
      
      // Dopo l'animazione di spegnimento, nascondi completamente il contenuto
      setTimeout(() => {
        if (!document.body.classList.contains('crt-active')) {
          document.body.classList.add('crt-off');
        }
      }, 550); // 550ms = durata animazione crt-power-off
    }
  }, [crtEnabled, mounted]);

  // Pulizia al dismount del componente
  useEffect(() => {
    return () => {
      document.body.classList.remove('crt-active', 'crt-disabled');
    };
  }, []);

  return (
    <div className="crt-power-switch-container">
      <input 
        type="checkbox" 
        id="crt-switch" 
        checked={crtEnabled}
        onChange={() => setCrtEnabled(!crtEnabled)}
        style={{ display: 'none' }}
      />
      <label 
        htmlFor="crt-switch" 
        className="crt-switch-label"
        title={crtEnabled ? "Disabilita effetto CRT" : "Abilita effetto CRT"}
        aria-label={crtEnabled ? "Disabilita effetto CRT" : "Abilita effetto CRT"}
      >
        <span className="power-symbol">⏻</span>
      </label>
    </div>
  );
};

export default CRTToggle; 