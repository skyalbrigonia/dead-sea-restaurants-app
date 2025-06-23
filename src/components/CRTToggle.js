'use client';
import { useState, useEffect } from 'react';

const CRTToggle = () => {
  const [crtEnabled, setCrtEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('crt-enabled');
    if (saved !== null) {
      setCrtEnabled(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crt-enabled', JSON.stringify(crtEnabled));
    
    // Toggle CRT classes on body
    if (crtEnabled) {
      document.body.classList.add('crt-active');
      document.body.classList.remove('crt-disabled');
    } else {
      document.body.classList.add('crt-disabled');
      document.body.classList.remove('crt-active');
    }
  }, [crtEnabled]);

  return (
    <button
      onClick={() => setCrtEnabled(!crtEnabled)}
      className="fixed top-4 right-4 z-50 px-3 py-1 text-xs border border-green-500 hover:bg-green-500 hover:text-black transition-colors duration-150"
      title={crtEnabled ? "Disabilita effetto CRT" : "Abilita effetto CRT"}
    >
      [ CRT: {crtEnabled ? 'ON' : 'OFF'} ]
    </button>
  );
};

export default CRTToggle; 