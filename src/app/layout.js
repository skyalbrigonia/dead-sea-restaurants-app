import { VT323 } from 'next/font/google';
import './globals.css';

const vt323 = VT323({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'P.R.A.S. - Piattaforma Recensioni ASCII System',
  description: 'Le nostre recensioni dei pranzi... in stile terminale.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={vt323.className}>
        {children}
      </body>
    </html>
  );
}