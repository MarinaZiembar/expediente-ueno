'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import type { EmployeeNote, NoteStatus, Region } from '@/content/types';
import type { RelatedByRegion } from '@/lib/related';
import { DTitle, Reveal } from './ui';
import { fmtDate } from '@/lib/format';

const REGIONS: { id: Region; flag: string }[] = [
  { id: 'Paraguay', flag: 'PY' },
  { id: 'Argentina', flag: 'AR' },
  { id: 'Otros países', flag: '+' },
];

const STATUS_LABEL: Record<NoteStatus, string> = {
  oficial: 'Comunicado oficial',
  prensa: 'Según la prensa',
  testimonio: 'Testimonio',
  'en curso': 'En curso',
  'sin confirmar': 'Sin confirmar',
};

function NoteCard({ n }: { n: EmployeeNote }) {
  const [open, setOpen] = useState(false);
  const id = `note-${n.id}`;
  return (
    <li className={`note ${open ? 'is-open' : ''}`}>
      <h4 className="note__title">{n.title}</h4>
      <div className="note__more" id={id} hidden={!open}>
        <div className="note__top">
          <span className="note__date">{n.dateLabel ?? fmtDate(n.date)}</span>
          <span className={`status status--${n.status.replace(' ', '-')}`}>{STATUS_LABEL[n.status]}</span>
        </div>
        <p>{n.body}</p>
        {n.source && (
          <a className="note__src" href={n.source.url} target="_blank" rel="noopener noreferrer">
            Ir a la fuente: {n.source.name} ↗
          </a>
        )}
      </div>
      <button className="note__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id}>
        {open ? 'Ver menos' : 'Ver más'} <span aria-hidden>{open ? '−' : '+'}</span>
      </button>
    </li>
  );
}

export default function Employees({ notes, related: relatedAll }: { notes: EmployeeNote[]; related: RelatedByRegion }) {
  const [region, setRegion] = useState<Region>('Paraguay');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const list = notes.filter((n) => n.region === region);
  const related = relatedAll[region];

  const onKey = (e: KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + REGIONS.length) % REGIONS.length;
    setRegion(REGIONS[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="empleados" className="sec">
      <header className="sec__head">
        <DTitle lines={['¿Cuál es nuestra', 'situación?']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p>Qué les pasó a los trabajadores del grupo. Elegí un país y tocá “Ver más” en cada tarjeta para leer el detalle y la fuente.</p>
        </Reveal>
      </header>

      <div className="tabs" role="tablist" aria-label="País">
        {REGIONS.map((r, i) => {
          const count = notes.filter((n) => n.region === r.id).length;
          const on = r.id === region;
          return (
            <button
              key={r.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${i}`}
              aria-selected={on}
              aria-controls="region-panel"
              tabIndex={on ? 0 : -1}
              className={`tab ${on ? 'is-on' : ''}`}
              onClick={() => setRegion(r.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="tab__flag" aria-hidden>
                {r.flag}
              </span>
              <span className="tab__name">{r.id}</span>
              <span className="tab__count">{count}</span>
            </button>
          );
        })}
      </div>

      <div
        id="region-panel"
        role="tabpanel"
        aria-labelledby={`tab-${REGIONS.findIndex((r) => r.id === region)}`}
        className="region"
        key={region}
      >
        {list.length === 0 ? (
          <p className="empty">Todavía no hay datos cargados para {region}.</p>
        ) : (
          <ol className="notes">
            {list.map((n) => (
              <NoteCard key={n.id} n={n} />
            ))}
          </ol>
        )}

        {related.length > 0 && (
          <div className="related">
            <h4 className="related__title">Noticias relacionadas</h4>
            <ul className="related__list">
              {related.map((n) => (
                <li key={n.id}>
                  <a href={n.url} target="_blank" rel="noopener noreferrer">
                    <span>{n.title}</span>
                    <small>
                      {n.source} · {fmtDate(n.publishedAt)} ↗
                    </small>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
