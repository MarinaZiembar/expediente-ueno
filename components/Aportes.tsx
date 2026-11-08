'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { UserNews } from '@/lib/aportes';
import { NEWS_TITLE_MAX, NEWS_TITLE_MIN } from '@/lib/limits';
import { DTitle, Reveal } from './ui';

/** Noticias aportadas por la gente: carrusel + formulario abierto a todos, con moderación. */
export default function Aportes({ items }: { items: UserNews[] }) {
  const rail = useRef<HTMLOListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, progress: 0 });
  const [open, setOpen] = useState(false);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4, progress: max > 0 ? el.scrollLeft / max : 1 });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    sync();
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
    <section id="aportes" className="sec sec--aportes">
      <header className="sec__head">
        <div>
          <Reveal variant="mask">
            <p className="eyebrow">
              <span className="lbar lbar--lg">La investigación la hacemos</span>
            </p>
          </Reveal>
          <DTitle lines={['Entre todos']} size="lg" swash />
        </div>
        <Reveal className="sec__lead" delay={200}>
          <p>
            ¿Encontraste una nota que no está acá? Sumala. Cada aporte se revisa antes de publicarse y siempre lleva a la fuente
            original.
          </p>
        </Reveal>
      </header>

      {items.length === 0 ? (
        <p className="empty">Todavía no hay aportes publicados. Sé la primera persona en sumar una noticia.</p>
      ) : (
        <div className="carousel">
          <ol ref={rail} className="carousel__rail" onScroll={sync} tabIndex={0} aria-label="Noticias aportadas por la gente">
            {items.map((n, i) => (
              <li key={n.id} className={`ncard ncard--${i % 4 === 1 ? 'lime' : i % 6 === 4 ? 'ink' : 'plain'}`}>
                <a href={n.url} target="_blank" rel="noopener noreferrer nofollow ugc" data-cursor="leer">
                  <span className="ncard__title">{n.title}</span>
                  <span className="ncard__foot">
                    Ver más <span aria-hidden>↗</span>
                    <small>{n.host}</small>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div className="carousel__bar">
            <div className="carousel__progress" aria-hidden>
              <span style={{ transform: `scaleX(${Math.max(0.04, edge.progress)})` }} />
            </div>
            <span className="carousel__count">{items.length} aportes</span>
            <div className="deck__btns">
              <button className="sqbtn" onClick={() => move(-1)} disabled={edge.start} aria-label="Aportes anteriores">
                ←
              </button>
              <button className="sqbtn sqbtn--lime" onClick={() => move(1)} disabled={edge.end} aria-label="Más aportes">
                →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tst__cta">
        <button className="bigbtn" onClick={() => setOpen(true)}>
          Sumá una noticia <span aria-hidden>+</span>
        </button>
        <p>Abierto a todos. Se revisa antes de publicarse.</p>
      </div>

      {open && <NewsForm onClose={() => setOpen(false)} />}
    </section>
  );
}

function NewsForm({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const opened = useRef(Date.now());
  const first = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    lastFocus.current = document.activeElement;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/aportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: f.get('title'),
          url: f.get('url'),
          accepted: f.get('accepted') === 'on',
          website: f.get('website'),
          elapsed: Date.now() - opened.current,
        }),
      });
      if (res.ok) {
        setState('sent');
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? 'No pudimos enviar tu aporte. Probá de nuevo más tarde.');
      setState('error');
    } catch {
      setError('No pudimos conectarnos. Revisá tu conexión y probá de nuevo.');
      setState('error');
    }
  };

  return (
    <div className="fmodal" role="dialog" aria-modal="true" aria-labelledby="nmodal-title" onClick={onClose}>
      <div className="fmodal__box" onClick={(e) => e.stopPropagation()}>
        <div className="fmodal__head">
          <h3 id="nmodal-title">Sumá una noticia</h3>
          <button className="sqbtn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {state === 'sent' ? (
          <div className="fmodal__done">
            <p className="fmodal__big">¡Gracias!</p>
            <p>Recibimos tu aporte. Lo vamos a revisar y, si corresponde, se publica en esta sección.</p>
            <button className="bigbtn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form className="fmodal__form" onSubmit={submit}>
            <p className="fmodal__note">
              Compartí una nota de un medio o una fuente que se pueda verificar. <b>Sin insultos</b> y sin datos personales.
              Escribí un título claro y corto.
            </p>

            <label className="field">
              <span>Título</span>
              <input
                ref={first}
                name="title"
                required
                minLength={NEWS_TITLE_MIN}
                maxLength={NEWS_TITLE_MAX}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej.: El BCP anuncia cuándo se pagan los depósitos"
                autoComplete="off"
                aria-describedby="nmodal-count"
              />
              <small id="nmodal-count" className={title.length > 0 && title.length < NEWS_TITLE_MIN ? 'is-warn' : undefined}>
                {title.length} / {NEWS_TITLE_MAX}
              </small>
            </label>

            <label className="field">
              <span>Link de la noticia</span>
              <input name="url" type="url" required inputMode="url" placeholder="https://…" autoComplete="off" />
            </label>

            {/* campo trampa para bots, invisible para personas */}
            <label className="field--hp" aria-hidden>
              Sitio web
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            <label className="check">
              <input type="checkbox" name="accepted" required />
              <span>Entiendo que el aporte se revisa antes de publicarse y que el título puede editarse.</span>
            </label>

            {state === 'error' && (
              <p className="fmodal__error" role="alert">
                {error}
              </p>
            )}

            <div className="fmodal__actions">
              <button className="bigbtn" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Enviando…' : 'Enviar noticia'}
              </button>
              <button className="textbtn" type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
