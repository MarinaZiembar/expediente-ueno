'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { ExplainSlide } from '@/content/types';
import { Counter, DTitle, Rich, Sources, pad, useInView } from './ui';
import { fmtDate } from '@/lib/format';

const d = (ms: number) => ({ '--d': ms }) as CSSProperties;

/**
 * Presentación vertical: cada diapositiva ocupa la pantalla y, al bajar,
 * la siguiente sube y se apoya sobre la anterior.
 */
export default function Deck({ slides, updatedAt }: { slides: ExplainSlide[]; updatedAt: string | null }) {
  const total = slides.length + 1;
  return (
    <section id="presentacion" className="deck" aria-label="Qué pasó">
      <Slide n={1} total={total} kind="cover">
        {(active) => <Cover active={active} updatedAt={updatedAt} />}
      </Slide>
      {slides.map((s, i) => (
        <Slide key={i} n={i + 2} total={total} kind="explain">
          {(active) => <Explain data={s} active={active} />}
        </Slide>
      ))}
    </section>
  );
}

function Slide({
  n,
  total,
  kind,
  children,
}: {
  n: number;
  total: number;
  kind: 'cover' | 'explain';
  children: (active: boolean) => ReactNode;
}) {
  const [ref, active] = useInView<HTMLDivElement>(0.25);
  return (
    <div ref={ref} id={`slide-${n}`} className={`slide slide--${kind} ${active ? 'is-active' : ''}`}>
      <div className="slide__inner">{children(active)}</div>
      <span className="slide__count" aria-hidden>
        {pad(n)} / {pad(total)}
      </span>
    </div>
  );
}

function Cover({ active, updatedAt }: { active: boolean; updatedAt: string | null }) {
  return (
    <div className="cover">
      <div className="cover__head">
        <p className="eyebrow rv" style={d(100)}>
          <span className="lbar">Investigación abierta</span>
          {updatedAt && <span> Actualizado {fmtDate(updatedAt, true)} (hora PY)</span>}
        </p>
        <DTitle lines={['El caso', 'ueno']} size="xl" active={active} as="h1" swash />
      </div>
      <div className="cover__side">
        <p className="lead rv" style={d(500)}>
          <Rich text="**Qué pasó** con el banco que dejó a 2,9 millones de clientes sin acceso a sus ahorros, y por qué la crisis llegó hasta el presidente de Paraguay." />
        </p>
        <p className="lead lead--small rv" style={d(650)}>
          Explicado simple, paso a paso y con la fuente de cada dato.
        </p>
        <a className="bigbtn rv" style={d(800)} href="#slide-2">
          Empezar <span aria-hidden>↓</span>
        </a>
        <p className="hint rv" style={d(950)}>
          O bajá con el scroll
        </p>
      </div>
    </div>
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
