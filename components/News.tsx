'use client';

import { useMemo, useState } from 'react';
import type { NewsFile, NewsItem, SocialPost } from '@/content/types';
import { DTitle, Reveal } from './ui';
import { dayKey, fmtDate } from '@/lib/format';

const PAGE = 25;

export default function News({ news, posts }: { news: NewsFile; posts: SocialPost[] }) {
  const [q, setQ] = useState('');
  const [src, setSrc] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);

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

  const groups = useMemo(() => {
    const map = new Map<string, NewsItem[]>();
    for (const n of filtered.slice(0, shown)) {
      const k = dayKey(n.publishedAt);
      const arr = map.get(k);
      if (arr) arr.push(n);
      else map.set(k, [n]);
    }
    return [...map.entries()];
  }, [filtered, shown]);

  const sortedPosts = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);

  return (
    <section id="noticias" className="sec sec--news">
      <header className="sec__head">
        <DTitle lines={['No-ti-cias', 'en vi-vo']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p className="live">
            <span className="live__dot" aria-hidden />
            {news.items.length} titulares · actualizado {news.updatedAt ? `${fmtDate(news.updatedAt, true)} (hora PY)` : '—'}
          </p>
          <p>Se revisan Google News y Bing News cada hora y se suman los titulares que mencionan a ueno.</p>
        </Reveal>
      </header>

      <div className="news">
        <div className="news__filters">
          <input
            className="news__search"
            type="search"
            placeholder="Buscar en los titulares…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(PAGE);
            }}
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
                onClick={() => {
                  setSrc(src === name ? null : name);
                  setShown(PAGE);
                }}
                aria-pressed={src === name}
              >
                {name} <small>{c}</small>
              </button>
            ))}
          </div>
        </div>

        {groups.length === 0 && <p className="empty">No hay titulares que coincidan.</p>}
        {groups.map(([day, items]) => (
          <div key={day} className="news__day">
            <h3 className="news__dayname">{day}</h3>
            <ol className="news__list">
              {items.map((n) => (
                <li key={n.id}>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" data-cursor="leer">
                    <span className="news__meta">
                      {n.source} · {fmtDate(n.publishedAt, true)}
                    </span>
                    <span className="news__title">{n.title}</span>
                    <span className="news__arrow" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        ))}
        {filtered.length > shown && (
          <button className="bigbtn bigbtn--outline news__more" onClick={() => setShown((s) => s + PAGE)}>
            Ver más titulares ({filtered.length - shown})
          </button>
        )}
      </div>

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
