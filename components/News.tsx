'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NewsFile, SocialPost } from '@/content/types';
import { DTitle, Reveal } from './ui';
import { fmtDate } from '@/lib/format';

/** Máximo de cards en el carrusel (las más recientes). */
const MAX_CARDS = 60;

export default function News({ news, posts }: { news: NewsFile; posts: SocialPost[] }) {
  const [q, setQ] = useState('');
  const [src, setSrc] = useState<string | null>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, progress: 0 });

  const topSources = useMemo(() => {
    const count = new Map<string, number>();
    for (const n of news.items) count.set(n.source, (count.get(n.source) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [news.items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return news.items.filter(
      (n) => (!src || n.source === src) && (!needle || `${n.title} ${n.source}`.toLowerCase().includes(needle)),
    );
  }, [news.items, q, src]);
  const cards = filtered.slice(0, MAX_CARDS);

  const sortedPosts = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= max - 4,
      progress: max > 0 ? el.scrollLeft / max : 1,
    });
  }, []);

  // al filtrar, volver al principio
  useEffect(() => {
    rail.current?.scrollTo({ left: 0 });
    sync();
  }, [q, src, sync]);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const move = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section id="noticias" className="sec sec--news">
      <header className="sec__head">
        <DTitle lines={['Noticias', 'en vivo']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p className="live">
            <span className="live__dot" aria-hidden />
            {news.items.length} titulares · actualizado {news.updatedAt ? `${fmtDate(news.updatedAt, true)} (hora PY)` : '—'}
          </p>
          <p>Se revisan Google News y Bing News cada hora y se suman los titulares que mencionan a ueno.</p>
        </Reveal>
      </header>

      <div className="news__filters">
        <input
          className="news__search"
          type="search"
          placeholder="Buscar en los titulares…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar en los titulares"
        />
        <div className="chips" role="group" aria-label="Filtrar por medio">
          <button className={`chip ${src === null ? 'is-on' : ''}`} onClick={() => setSrc(null)} aria-pressed={src === null}>
            Todos
          </button>
          {topSources.map(([name, c]) => (
            <button
              key={name}
              className={`chip ${src === name ? 'is-on' : ''}`}
              onClick={() => setSrc(src === name ? null : name)}
              aria-pressed={src === name}
            >
              {name} <small>{c}</small>
            </button>
          ))}
        </div>
      </div>

      {cards.length === 0 ? (
        <p className="empty">No hay titulares que coincidan.</p>
      ) : (
        <div className="carousel">
          <ol
            ref={rail}
            className="carousel__rail"
            onScroll={sync}
            tabIndex={0}
            aria-label="Titulares, de más reciente a más antiguo. Usá las flechas para desplazarte."
          >
            {cards.map((n, i) => (
              <li key={n.id} className={`ncard ncard--${i % 7 === 0 ? 'lime' : i % 5 === 3 ? 'ink' : 'plain'}`}>
                <a href={n.url} target="_blank" rel="noopener noreferrer" data-cursor="leer">
                  <span className="ncard__title">{n.title}</span>
                  <span className="ncard__foot">
                    Ver más <span aria-hidden>↗</span>
                    <small>{n.source}</small>
                  </span>
                </a>
              </li>
            ))}
          </ol>

          <div className="carousel__bar">
            <div className="carousel__progress" aria-hidden>
              <span style={{ transform: `scaleX(${Math.max(0.04, edge.progress)})` }} />
            </div>
            <span className="carousel__count">
              {cards.length}
              {filtered.length > cards.length ? ` de ${filtered.length}` : ''} titulares
            </span>
            <div className="deck__btns">
              <button className="sqbtn" onClick={() => move(-1)} disabled={edge.start} aria-label="Titulares anteriores">
                ←
              </button>
              <button className="sqbtn sqbtn--lime" onClick={() => move(1)} disabled={edge.end} aria-label="Más titulares">
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedPosts.length > 0 && (
        <div className="social">
          <Reveal variant="mask">
            <h3 className="lbar lbar--lg">En redes</h3>
          </Reveal>
          <ul className="social__grid">
            {sortedPosts.map((p) => (
              <li key={p.id} className="social__card">
                {p.image && <div className="social__img" style={{ backgroundImage: `url(${p.image})` }} />}
                <span className="news__meta">
                  {p.platform} · {p.author} · {fmtDate(p.date)}
                </span>
                <p>{p.text}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  Ver posteo ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
