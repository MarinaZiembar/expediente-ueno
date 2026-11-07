'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Dataset, NewsItem, Source } from '@/content/types';
import { STATIONS, type StationId } from '@/content/stations';
import { CREDITS, DISCLAIMER } from '@/content/meta';
import { dayKey, fmtDate } from '@/lib/format';

type PanelProps = { stationId: StationId; data: Dataset; onClose: () => void };

export default function Panel({ stationId, data, onClose }: PanelProps) {
  const ref = useRef<HTMLElement>(null);
  const station = STATIONS.find((s) => s.id === stationId) ?? STATIONS[0];

  useEffect(() => {
    ref.current?.focus();
  }, [stationId]);

  return (
    <div className="panel-backdrop" onClick={onClose}>
      <article
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="panel-head">
          <span>
            Folio {station.code} · {station.hint}
          </span>
          <button className="btn" onClick={onClose}>
            Cerrar (Esc)
          </button>
        </header>
        <h2 id="panel-title">{station.title}</h2>
        <div className="panel-body">
          <Body stationId={stationId} data={data} />
        </div>
        <footer className="panel-foot">
          <p>{DISCLAIMER}</p>
          <p>{CREDITS}</p>
        </footer>
      </article>
    </div>
  );
}

function Sources({ list }: { list: Source[] }) {
  return (
    <span className="src">
      Fuente:{' '}
      {list.map((s, i) => (
        <span key={`${s.url}-${i}`}>
          {i > 0 ? ' · ' : ''}
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.name}
          </a>
        </span>
      ))}
    </span>
  );
}

function Body({ stationId, data }: { stationId: StationId; data: Dataset }) {
  switch (stationId) {
    case 'entrada':
      return <Intro />;
    case 'cronologia':
      return <Timeline data={data} />;
    case 'vinculos':
      return <Links data={data} />;
    case 'prensa':
      return <Press data={data} />;
    case 'redes':
      return <Social data={data} />;
    case 'empleados':
      return <Employees data={data} />;
    default:
      return null;
  }
}

function Intro() {
  return (
    <>
      <p className="lede">
        Expediente interactivo con información pública sobre el cierre de ueno bank y sus consecuencias judiciales y
        políticas en Paraguay.
      </p>
      <h3>Cómo se arma</h3>
      <ul>
        <li>
          <b>Cronología y red de vínculos:</b> hechos curados a mano. Cada uno enlaza a su fuente.
        </li>
        <li>
          <b>Archivo de prensa:</b> se actualiza solo cada hora con Google News y Bing News, guardando los titulares
          que mencionan “ueno”.
        </li>
        <li>
          <b>Redes sociales y notas de empleados:</b> cargadas a mano.
        </li>
      </ul>
      <h3>Criterios</h3>
      <ul>
        <li>Sin opiniones propias: solo hechos publicados, con fuente y fecha.</li>
        <li>Los estados procesales (imputado, detenido, denunciado) se consignan tal como los informan las fuentes.</li>
        <li>Cuando un dato viene de un solo medio, se lo atribuye a ese medio.</li>
      </ul>
      <h3>Cómo recorrerlo</h3>
      <p>
        <kbd>←</kbd> <kbd>→</kbd> o <kbd>A</kbd> <kbd>D</kbd> para moverte · <kbd>1</kbd>–<kbd>6</kbd> para saltar ·{' '}
        <kbd>Enter</kbd> abre la sección · <kbd>Esc</kbd> cierra · <kbd>P</kbd> modo pixel. En el celular, deslizá o
        usá los botones.
      </p>
    </>
  );
}

function Timeline({ data }: { data: Dataset }) {
  return (
    <ol className="tl">
      {data.timeline.map((t, i) => (
        <li key={i}>
          <span className="when">{t.label}</span>
          <h3>{t.title}</h3>
          <p>{t.detail}</p>
          <Sources list={t.sources} />
        </li>
      ))}
    </ol>
  );
}

function Links({ data }: { data: Dataset }) {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const kindLabel = { persona: 'Persona', empresa: 'Empresa', institucion: 'Institución', colectivo: 'Colectivo' };
  return (
    <>
      <p className="lede">Relaciones documentadas por la prensa. Cada vínculo indica su fuente.</p>
      <div className="entity-grid">
        {data.nodes.map((n) => {
          const rels = data.edges.filter((e) => e.from === n.id || e.to === n.id);
          return (
            <section key={n.id} className={`entity k-${n.kind}`}>
              <span className="kind">{kindLabel[n.kind]}</span>
              <h3>{n.name}</h3>
              {n.status && <span className="status">{n.status}</span>}
              <ul className="rel">
                {rels.map((e, i) => {
                  const other = byId.get(e.from === n.id ? e.to : e.from);
                  return (
                    <li key={i}>
                      <b>{other?.name}</b>: {e.label}.{' '}
                      <a href={e.source.url} target="_blank" rel="noopener noreferrer">
                        {e.source.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

function Press({ data }: { data: Dataset }) {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle
      ? data.news.items.filter((n) => `${n.title} ${n.source}`.toLowerCase().includes(needle))
      : data.news.items;
    const map = new Map<string, NewsItem[]>();
    for (const n of list) {
      const k = dayKey(n.publishedAt);
      const arr = map.get(k);
      if (arr) arr.push(n);
      else map.set(k, [n]);
    }
    return [...map.entries()];
  }, [q, data.news.items]);

  return (
    <>
      <p className="lede">
        {data.news.items.length} titulares recopilados automáticamente. Última actualización:{' '}
        {data.news.updatedAt ? `${fmtDate(data.news.updatedAt, true)} (hora de Paraguay)` : '—'}.
      </p>
      <input
        className="search"
        type="search"
        placeholder="Filtrar por palabra o medio…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Filtrar titulares"
      />
      {groups.length === 0 && <p className="empty">No hay titulares que coincidan.</p>}
      {groups.map(([day, items]) => (
        <section key={day} className="news-day">
          <h3>{day}</h3>
          <ul className="news-list">
            {items.map((n) => (
              <li key={n.id}>
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  {n.title}
                </a>
                <span className="meta">
                  {n.source} · {fmtDate(n.publishedAt, true)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function Social({ data }: { data: Dataset }) {
  if (data.posts.length === 0) return <p className="empty">Todavía no hay posteos cargados.</p>;
  const sorted = [...data.posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <ul className="news-list">
      {sorted.map((p) => (
        <li key={p.id}>
          <span className="meta">
            {p.platform} · {p.author} · {fmtDate(p.date)}
          </span>
          <p>{p.text}</p>
          <a href={p.url} target="_blank" rel="noopener noreferrer">
            Ver posteo original
          </a>
        </li>
      ))}
    </ul>
  );
}

function Employees({ data }: { data: Dataset }) {
  if (data.notes.length === 0) return <p className="empty">Sin actualizaciones publicadas todavía.</p>;
  const sorted = [...data.notes].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <p className="lede">Estado de situación desde adentro, actualizado a mano. Cada entrada indica si está confirmada.</p>
      <ol className="tl">
        {sorted.map((n) => (
          <li key={n.id}>
            <span className="when">{fmtDate(n.date)}</span>{' '}
            <span className={`badge st-${n.status.replace(' ', '-')}`}>{n.status}</span>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
            {n.source && <Sources list={[n.source]} />}
          </li>
        ))}
      </ol>
    </>
  );
}
