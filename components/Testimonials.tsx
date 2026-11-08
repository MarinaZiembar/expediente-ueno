'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { Testimonial } from '@/lib/testimonios';
import { COUNTRIES } from '@/lib/countries';
import { DTitle, Reveal } from './ui';
import { fmtDate } from '@/lib/format';

const INTERVAL = 6500;
const STORE_KEY = 'expediente-invitacion';

/**
 * Lee el código del link de invitación (?invitacion=…), lo valida con el servidor,
 * lo recuerda en este navegador y lo saca de la barra de direcciones.
 */
function useInvite() {
  const [invite, setInvite] = useState<string | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    let code = url.searchParams.get('invitacion');
    if (!code) {
      try {
        code = window.localStorage.getItem(STORE_KEY);
      } catch {}
    }
    if (!code) return;
    let cancelled = false;
    fetch(`/api/testimonios/invitacion?c=${encodeURIComponent(code)}`)
      .then((r) => r.json() as Promise<{ valid?: boolean }>)
      .then(({ valid }) => {
        if (cancelled) return;
        try {
          if (valid) window.localStorage.setItem(STORE_KEY, code as string);
          else window.localStorage.removeItem(STORE_KEY);
        } catch {}
        if (valid) setInvite(code);
        if (url.searchParams.has('invitacion')) {
          url.searchParams.delete('invitacion');
          window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return invite;
}
const MAX_TEXT = 500;
const MIN_TEXT = 40;

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const invite = useInvite();
  const count = items.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || userPaused || formOpen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, INTERVAL);
    return () => window.clearInterval(t);
  }, [count, paused, userPaused, formOpen]);

  return (
    <section id="testimonios" className="sec sec--testimonios">
      <header className="sec__head">
        <DTitle lines={['Testimonios']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p>
            Lo que cuentan los trabajadores. Las frases de prensa enlazan a su fuente; los testimonios enviados a este sitio se
            publican sin nombre y después de ser revisados.
          </p>
        </Reveal>
      </header>

      {count > 0 && (
        <div
          className="tst"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Testimonios"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="tst__stage" aria-live={userPaused ? 'polite' : 'off'}>
            {items.map((t, i) => (
              <figure
                key={t.id}
                className={`tst__item ${i === index ? 'is-on' : ''}`}
                aria-hidden={i !== index}
                role="group"
                aria-roledescription="testimonio"
                aria-label={`${i + 1} de ${count}`}
              >
                <span className="tst__mark" aria-hidden>
                  “
                </span>
                <blockquote className="tst__text">
                  <p>{t.text}</p>
                </blockquote>
                <figcaption className="tst__meta">
                  <span className="tst__country">{t.country}</span>
                  <span className="tst__role">{t.role}</span>
                  {t.origin === 'prensa' && t.source ? (
                    <a href={t.source.url} target="_blank" rel="noopener noreferrer" tabIndex={i === index ? 0 : -1}>
                      Publicado en {t.source.name} ↗
                    </a>
                  ) : (
                    <span className="tst__src">Enviado a este sitio · {fmtDate(t.date)}</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>

          {count > 1 && (
            <div className="tst__controls">
              <div className="tst__dots" role="group" aria-label="Elegir testimonio">
                {items.map((t, i) => (
                  <button
                    key={t.id}
                    className={i === index ? 'is-on' : undefined}
                    onClick={() => go(i)}
                    aria-label={`Testimonio ${i + 1}`}
                    aria-current={i === index}
                  >
                    <span style={i === index && !paused && !userPaused ? { animationDuration: `${INTERVAL}ms` } : undefined} />
                  </button>
                ))}
              </div>
              <button className="textbtn" onClick={() => setUserPaused((p) => !p)} aria-pressed={userPaused}>
                {userPaused ? 'Reanudar' : 'Pausar'}
              </button>
            </div>
          )}
        </div>
      )}

      {invite ? (
        <div className="tst__cta">
          <button className="bigbtn" onClick={() => setFormOpen(true)}>
            Dejá tu testimonio <span aria-hidden>+</span>
          </button>
          <p>Es anónimo y se revisa antes de publicarse.</p>
        </div>
      ) : (
        <p className="tst__only">Los testimonios los envían trabajadores del grupo con un link de invitación y se revisan antes de publicarse.</p>
      )}

      {formOpen && invite && <TestimonialForm invite={invite} onClose={() => setFormOpen(false)} />}
    </section>
  );
}

function TestimonialForm({ invite, onClose }: { invite: string; onClose: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const opened = useRef(Date.now());
  const first = useRef<HTMLSelectElement>(null);
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
      const res = await fetch('/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: f.get('country'),
          role: f.get('role'),
          text: f.get('text'),
          accepted: f.get('accepted') === 'on',
          invite,
          website: f.get('website'),
          elapsed: Date.now() - opened.current,
        }),
      });
      if (res.ok) {
        setState('sent');
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? 'No pudimos enviar tu testimonio. Probá de nuevo más tarde.');
      setState('error');
    } catch {
      setError('No pudimos conectarnos. Revisá tu conexión y probá de nuevo.');
      setState('error');
    }
  };

  return (
    <div className="fmodal" role="dialog" aria-modal="true" aria-labelledby="fmodal-title" onClick={onClose}>
      <div className="fmodal__box" onClick={(e) => e.stopPropagation()}>
        <div className="fmodal__head">
          <h3 id="fmodal-title">Dejá tu testimonio</h3>
          <button className="sqbtn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {state === 'sent' ? (
          <div className="fmodal__done">
            <p className="fmodal__big">¡Gracias!</p>
            <p>Recibimos tu testimonio. Lo vamos a revisar y, si cumple las pautas, se publica sin tu nombre.</p>
            <button className="bigbtn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form className="fmodal__form" onSubmit={submit}>
            <p className="fmodal__note">
              Contá lo que estás viviendo estos días. <b>Pedimos respeto:</b> sin insultos, sin acusaciones a personas y sin
              datos personales (tuyos ni de otros). No pongas tu nombre.
            </p>

            <label className="field">
              <span>País</span>
              <select ref={first} name="country" required defaultValue="">
                <option value="" disabled>
                  Elegí un país
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Cargo que ocupabas</span>
              <input name="role" required minLength={2} maxLength={80} placeholder="Ej.: Analista de soporte" autoComplete="off" />
            </label>

            <label className="field">
              <span>Tu testimonio</span>
              <textarea
                name="text"
                required
                minLength={MIN_TEXT}
                maxLength={MAX_TEXT}
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="¿Cómo te enteraste? ¿Qué pasó con tu sueldo? ¿Cómo estás llevando estos días?"
                aria-describedby="fmodal-count"
              />
              <small id="fmodal-count" className={text.length > 0 && text.length < MIN_TEXT ? 'is-warn' : undefined}>
                {text.length} / {MAX_TEXT} {text.length < MIN_TEXT ? `· mínimo ${MIN_TEXT}` : ''}
              </small>
            </label>

            {/* campo trampa para bots, invisible para personas */}
            <label className="field--hp" aria-hidden>
              Sitio web
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            <label className="check">
              <input type="checkbox" name="accepted" required />
              <span>
                Entiendo que mi testimonio se revisa antes de publicarse, que puede editarse para quitar datos personales y que no
                se publican insultos.
              </span>
            </label>

            {state === 'error' && (
              <p className="fmodal__error" role="alert">
                {error}
              </p>
            )}

            <div className="fmodal__actions">
              <button className="bigbtn" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Enviando…' : 'Enviar testimonio'}
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
