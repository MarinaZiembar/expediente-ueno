import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Josefin_Sans, League_Spartan } from 'next/font/google';
import './globals.css';

const display = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});
const body = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El caso ueno — explicado simple',
  description:
    'Qué pasó con ueno bank y por qué la crisis llegó al presidente de Paraguay: presentación, infografía y noticias actualizadas cada hora.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = { themeColor: '#f1f0ec' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
