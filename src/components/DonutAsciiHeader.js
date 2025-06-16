'use client';

import { useState, useEffect } from 'react';

const DonutAsciiHeader = () => {
  const [frame, setFrame] = useState('');

  useEffect(() => {
    let A = 0;
    let B = 0;
    
    const intervalId = setInterval(() => {
        const b = [];
        const z = [];
        
        const canvasWidth = 60;
        const canvasHeight = 30;

        A += 0.05;
        B += 0.03;

        const cA = Math.cos(A), sA = Math.sin(A);
        const cB = Math.cos(B), sB = Math.sin(B);
        
        for (let k = 0; k < canvasWidth * canvasHeight; k++) {
            b[k] = k % canvasWidth === canvasWidth - 1 ? "\n" : " ";
            z[k] = 0;
        }
        
        const luminanceChars = ".,-~:;=!*#$@";

        for (let j = 0; j < 6.28; j += 0.07) {
            const ct = Math.cos(j), st = Math.sin(j);
            for (let i = 0; i < 6.28; i += 0.02) {
                const sp = Math.sin(i), cp = Math.cos(i);
                
                const R2 = 2.5;
                const K2 = 5;

                const h = ct + R2;
                const D = 1 / (sp * h * sA + st * cA + K2);
                const t = sp * h * cA - st * sA;

                const x = Math.floor(canvasWidth / 2 + (canvasWidth / 3) * D * (cp * h * cB - t * sB));
                const y = Math.floor(canvasHeight / 2 + (canvasHeight / 6) * D * (cp * h * sB + t * cB));
                
                const o = x + canvasWidth * y;
                const N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));

                if (y < canvasHeight && y >= 0 && x >= 0 && x < canvasWidth && D > z[o]) {
                    z[o] = D;
                    b[o] = luminanceChars[N > 0 ? N : 0];
                }
            }
        }
        
        setFrame(b.join(""));

    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  return <pre className="text-center my-2 text-lg leading-tight text-yellow-400">{frame}</pre>;
};

export default DonutAsciiHeader;