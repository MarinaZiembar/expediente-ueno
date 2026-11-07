'use client';

import dynamic from 'next/dynamic';
import type { Dataset } from '@/content/types';

const Museum = dynamic(() => import('./Museum'), {
  ssr: false,
  loading: () => <div className="loading">Abriendo expediente…</div>,
});

export default function MuseumLoader({ data }: { data: Dataset }) {
  return <Museum data={data} />;
}
