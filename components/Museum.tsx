'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import Panel from './Panel';
import { STATIONS } from '@/content/stations';
import { fmtDate } from '@/lib/format';
import type { Dataset } from '@/content/types';

export default function Museum({ data }: { data: Dataset }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [pixel, setPixel] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((d: number) => {
    setIndex((i) => Math.max(0, Math.min(STATIONS.length - 1, i + d)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === 'Escape') setOpen(false);
        return;
      }
      const k = e.key.toLowerCase();
      if (k === 'arrowright' || k === 'd') go(1);
      else if (k === 'arrowleft' || k === 'a') go(-1);
      else if (k === 'enter' || k === 'e') setOpen(true);
      else if (k === 'p') setPixel((p) => !p);
      else if (/^[1-9]$/.test(k)) {
        const n = Number(k) - 1;
        if (n < STATIONS.length) setIndex(n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  const station = STATIONS[index];

  return (
    <main
      className="museum"
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start === null || open) return;
        const dx = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
    >
      <Canvas
        className={pixel ? 'is-pixel' : undefined}
        dpr={pixel ? 0.3 : [1, 2]}
        camera={{ position: [0, 1.95, 6], fov: 50, near: 0.1, far: 90 }}
      >
        <Scene
          data={data}
          index={index}
          onOpen={(i) => {
            setIndex(i);
            setOpen(true);
          }}
        />
      </Canvas>

      <div className="grain" aria-hidden />

      <header className="hud-top">
        <div className="brand">
          <span className="stamp-sm">Expediente</span>
          <span>Caso ueno bank</span>
        </div>
        <div className="updated">
          Prensa actualizada: {data.news.updatedAt ? `${fmtDate(data.news.updatedAt, true)} (hora PY)` : '—'}
        </div>
      </header>

      <p className="help" aria-hidden>
        ← → recorrer · Enter abrir · P pixel
      </p>

      <nav className="hud-bottom" aria-label="Secciones del expediente">
        <button className="btn" onClick={() => go(-1)} disabled={index === 0} aria-label="Sección anterior">
          ←
        </button>
        <ol className="dots">
          {STATIONS.map((s, i) => (
            <li key={s.id}>
              <button
                className={i === index ? 'on' : undefined}
                onClick={() => setIndex(i)}
                aria-current={i === index ? 'step' : undefined}
                aria-label={`${s.code} ${s.title}`}
              >
                {s.code}
                <span>{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          className="btn"
          onClick={() => go(1)}
          disabled={index === STATIONS.length - 1}
          aria-label="Sección siguiente"
        >
          →
        </button>
        <button className="btn primary" onClick={() => setOpen(true)}>
          Abrir ⏎
        </button>
        <button className="btn ghost" onClick={() => setPixel((p) => !p)} aria-pressed={pixel}>
          Pixel
        </button>
      </nav>

      {open && <Panel stationId={station.id} data={data} onClose={() => setOpen(false)} />}
    </main>
  );
}
