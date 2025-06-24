'use client';
import { useState, useEffect } from 'react';

const CRTToggle = () => {
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Applica lo stato di default immediatamente
  useEffect(() => {
    // Applica immediatamente lo stato di default (spento senza animazione)
    document.body.classList.add('crt-off');
    document.body.classList.remove('crt-active', 'crt-disabled');
    
    setMounted(true);
    
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
        <span className="switch-text">Power</span>
      </label>
    </div>
  );
};

export default CRTToggle; 