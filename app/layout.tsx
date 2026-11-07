import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, Libre_Caslon_Text, Special_Elite } from 'next/font/google';
import './globals.css';

const typewriter = Special_Elite({ weight: '400', subsets: ['latin'], variable: '--font-type', display: 'swap' });
const mono = IBM_Plex_Mono({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const serif = Libre_Caslon_Text({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Expediente ueno — investigación abierta',
  description:
    'Recorrido interactivo en 3D por la información pública sobre el cierre de ueno bank y sus consecuencias en Paraguay. Archivo de prensa actualizado cada hora.',
};

export const viewport: Viewport = { themeColor: '#0d0c0b' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${typewriter.variable} ${mono.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
