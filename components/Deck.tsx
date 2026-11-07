'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { ExplainSlide } from '@/content/types';
import { Counter, DTitle, Rich, Sources, pad } from './ui';
import GeometryCanvas from './GeometryCanvas';
import { fmtDate } from '@/lib/format';

type DeckSlide =
  | { kind: 'cover' }
  | { kind: 'explain'; data: ExplainSlide }
  | { kind: 'end' };

type DeckProps = {
  slides: ExplainSlide[];
  updatedAt: string | null;
};

const d = (ms: number) => ({ '--d': ms }) as CSSProperties;

export default function Deck({ slides, updatedAt }: DeckProps) {
  const list = useMemo<DeckSlide[]>(
    () => [
      { kind: 'cover' },
      ...slides.map((s) => ({ kind: 'explain' as const, data: s })),
      { kind: 'end' },
    ],
    [slides],
  );

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const ref = useRef<HTMLElement>(null);
  const inView = useRef(true);
  const touchX = useRef<number | null>(null);
  const last = list.length - 1;

  const goTo = useCallback(
    (i: number) => {
      setIndex((cur) => {
        const next = Math.max(0, Math.min(last, i));
        if (next !== cur) setDir(next > cur ? 1 : -1);
        return next;
      });
    },
    [last],
  );
  const go = useCallback((delta: number) => setIndex((cur) => {
    const next = Math.max(0, Math.min(last, cur + delta));
    if (next !== cur) setDir(delta > 0 ? 1 : -1);
    return next;
  }), [last]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.intersectionRatio > 0.55), {
      threshold: [0, 0.55, 1],
    });
    io.observe(el);

    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || e.altKey || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(last);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      io.disconnect();
      window.removeEventListener('keydown', onKey);
    };
  }, [go, goTo, last]);

  const current = list[index];
  const chapter =
    current.kind === 'cover'
      ? 'Portada'
      : current.kind === 'explain'
        ? current.data.kicker
        : 'Final';

  return (
    <section
      id="presentacion"
      ref={ref}
      className="deck"
      aria-roledescription="presentación"
      aria-label="Presentación del caso"
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="deck__stage">
        {list.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              className={`slide slide--${s.kind} ${active ? 'is-active' : ''} ${i < index ? 'is-past' : ''}`}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${list.length}`}
              aria-hidden={!active}
            >
              {s.kind === 'cover' && <Cover active={active} updatedAt={updatedAt} next={() => go(1)} />}
              {s.kind === 'explain' && <Explain data={s.data} active={active} />}
              {s.kind === 'end' && <End active={active} restart={() => goTo(0)} />}
            </div>
          );
        })}
        <div key={index} className={`wipe ${dir < 0 ? 'wipe--back' : ''}`} aria-hidden />
      </div>

      <div className="deck__bar">
        <span className="deck__chapter">{chapter}</span>
        <div className="deck__progress" aria-hidden>
          <span style={{ transform: `scaleX(${(index + 1) / list.length})` }} />
        </div>
        <span className="deck__count" aria-live="polite">
          {pad(index + 1)} / {pad(list.length)}
        </span>
        <div className="deck__btns">
          <button className="sqbtn" onClick={() => go(-1)} disabled={index === 0} aria-label="Diapositiva anterior">
            ←
          </button>
          <button className="sqbtn sqbtn--lime" onClick={() => go(1)} disabled={index === last} aria-label="Diapositiva siguiente">
            →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Cover({ active, updatedAt, next }: { active: boolean; updatedAt: string | null; next: () => void }) {
  return (
    <>
      <GeometryCanvas className="cover__canvas" paused={!active} />
      <div className="cover">
        <div className="cover__head">
          <p className="eyebrow rv" style={d(100)}>
            <span className="lbar">Investigación abierta</span>
            {updatedAt && <span> Actualizado {fmtDate(updatedAt, true)} (hora PY)</span>}
          </p>
          <DTitle lines={['El', 'ca-so', 'ue-no']} size="xl" active={active} as="h1" swash />
        </div>
        <div className="cover__side">
          <p className="lead rv" style={d(500)}>
            <Rich text="**Qué pasó** con el banco que dejó a 2,9 millones de clientes sin acceso a sus ahorros, y por qué la crisis llegó hasta el presidente de Paraguay." />
          </p>
          <p className="lead lead--small rv" style={d(650)}>
            Explicado simple, paso a paso y con la fuente de cada dato.
          </p>
          <button className="bigbtn rv" style={d(800)} onClick={next}>
            Empezar <span aria-hidden>→</span>
          </button>
          <p className="hint rv" style={d(950)}>
            Usá <kbd>←</kbd> <kbd>→</kbd> o deslizá para pasar
          </p>
        </div>
      </div>
    </>
  );
}

function Explain({ data, active }: { data: ExplainSlide; active: boolean }) {
  return (
    <div className="ex">
      <div className="ex__main">
        <p className="eyebrow rv" style={d(50)}>
          <span className="lbar">{data.kicker}</span>
        </p>
        <DTitle lines={data.title} size="md" active={active} />
        <div className="ex__body">
          {data.body.map((p, i) => (
            <p key={i} className="rv" style={d(420 + i * 130)}>
              <Rich text={p} />
            </p>
          ))}
        </div>
        <div className="rv" style={d(800)}>
          <Sources list={data.sources} />
        </div>
      </div>
      <aside className="ex__aside">
        {data.stat && (
          <div className="statcard rv" style={d(350)}>
            <Counter stat={data.stat} run={active} />
            <span className="statcard__label">{data.stat.label}</span>
          </div>
        )}
        {data.terms?.map((t, i) => (
          <dl className="term rv" key={t.term} style={d(600 + i * 140)}>
            <dt>
              <span className="term__q">¿Qué es?</span>
              {t.term}
            </dt>
            <dd>{t.def}</dd>
          </dl>
        ))}
      </aside>
    </div>
  );
}

function End({ active, restart }: { active: boolean; restart: () => void }) {
  return (
    <div className="end">
      <DTitle lines={['Se-guí', 'ba-jan-do']} size="xl" active={active} swash />
      <p className="lead rv" style={d(500)}>
        Abajo: la cronología paso a paso, los números del caso, la red de vínculos y las noticias que se suman cada hora.
      </p>
      <div className="end__btns rv" style={d(700)}>
        <a className="bigbtn" href="#cronologia">
          Ver la cronología <span aria-hidden>↓</span>
        </a>
        <a className="bigbtn bigbtn--ink" href="#noticias">
          Noticias en vivo <span aria-hidden>↓</span>
        </a>
        <button className="textbtn" onClick={restart}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
