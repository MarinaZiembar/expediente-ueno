'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Video } from '@/content/videos';
import { DTitle, Reveal } from './ui';

type Platform = 'youtube' | 'tiktok' | 'instagram';

type Parsed = Video & {
  platform: Platform;
  id: string;
  embed: string;
  thumb?: string;
  vertical: boolean;
};

const PLATFORM_LABEL: Record<Platform, string> = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Reel' };

function parse(v: Video): Parsed | null {
  try {
    const u = new URL(v.url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
      const id = host === 'youtu.be' ? u.pathname.slice(1) : (u.searchParams.get('v') ?? u.pathname.split('/').pop() ?? '');
      if (!id) return null;
      const shorts = u.pathname.startsWith('/shorts/');
      return {
        ...v,
        platform: 'youtube',
        id,
        embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        vertical: shorts,
      };
    }
    if (host.endsWith('tiktok.com')) {
      const id = u.pathname.match(/video\/(\d+)/)?.[1];
      if (!id) return null;
      return { ...v, platform: 'tiktok', id, embed: `https://www.tiktok.com/embed/v2/${id}`, vertical: true };
    }
    if (host.endsWith('instagram.com')) {
      const id = u.pathname.match(/\/(?:reel|reels|p)\/([^/]+)/)?.[1];
      if (!id) return null;
      return { ...v, platform: 'instagram', id, embed: `https://www.instagram.com/reel/${id}/embed`, vertical: true };
    }
  } catch {}
  return null;
}

/** Duración de una vuelta completa: lenta y constante. */
const SECONDS_PER_CARD = 7;

export default function Videos({ videos }: { videos: Video[] }) {
  const items = videos.map(parse).filter((v): v is Parsed => v !== null);
  const [playing, setPlaying] = useState<Parsed | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!playing) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPlaying(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocus.current?.focus();
    };
  }, [playing]);

  if (items.length === 0) return null;

  // se repite la lista para que la cinta sea continua
  const loop = [...items, ...items];

  return (
    <section id="videos" className="sec sec--videos">
      <header className="sec__head">
        <DTitle lines={['En video']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p>Coberturas, declaraciones y testimonios. Pasá el mouse para frenar la cinta y tocá un video para verlo.</p>
        </Reveal>
      </header>

      <div
        className={`reel ${playing ? 'is-paused' : ''}`}
        style={{ '--reel-duration': `${items.length * SECONDS_PER_CARD}s` } as CSSProperties}
      >
        <ul className="reel__track">
          {loop.map((v, i) => {
            const clone = i >= items.length;
            return (
              <li key={i} className={`vcard vcard--${v.platform}`} aria-hidden={clone || undefined}>
                <button
                  className="vcard__btn"
                  tabIndex={clone ? -1 : 0}
                  onClick={(e) => {
                    lastFocus.current = e.currentTarget;
                    setPlaying(v);
                  }}
                  data-cursor="ver"
                  aria-label={`Ver video: ${v.title} (${PLATFORM_LABEL[v.platform]}, ${v.author})`}
                >
                  <span className="vcard__media">
                    {v.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.thumb} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="vcard__placeholder" aria-hidden>
                        {PLATFORM_LABEL[v.platform]}
                      </span>
                    )}
                    <span className="vcard__play" aria-hidden>
                      ▶
                    </span>
                    <span className="vcard__badge">{PLATFORM_LABEL[v.platform]}</span>
                  </span>
                  <span className="vcard__title">{v.title}</span>
                  <span className="vcard__author">{v.author}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {playing && (
        <div className="vmodal" role="dialog" aria-modal="true" aria-label={playing.title} onClick={() => setPlaying(null)}>
          <div className={`vmodal__box ${playing.vertical ? 'is-vertical' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="vmodal__head">
              <span>
                {PLATFORM_LABEL[playing.platform]} · {playing.author}
              </span>
              <button ref={closeRef} className="sqbtn" onClick={() => setPlaying(null)} aria-label="Cerrar video">
                ✕
              </button>
            </div>
            <div className="vmodal__frame">
              <iframe
                src={playing.embed}
                title={playing.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="vmodal__foot">
              <p>{playing.title}</p>
              <a href={playing.url} target="_blank" rel="noopener noreferrer">
                Ver en {PLATFORM_LABEL[playing.platform]} ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
