'use client';

import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { GraphEdge, GraphNode, NodeKind } from '@/content/types';
import { Shape, useInView } from './ui';

const W = 1000;
const H = 540;
const NW = 168;
const NH = 58;
const X = (x: number) => ((x + 4.6) / 9.2) * W;
const Y = (y: number) => ((3.45 - y) / 3.1) * H;

const KIND_LABEL: Record<NodeKind, string> = {
  persona: 'Persona',
  empresa: 'Empresa',
  institucion: 'Institución',
  colectivo: 'Colectivo',
};
const KIND_SHAPE = { persona: 'circle', empresa: 'square', institucion: 'triangle', colectivo: 'plus' } as const;

/** Parte un nombre largo en dos líneas. */
function twoLines(name: string): [string, string?] {
  if (name.length <= 15) return [name];
  const mid = name.lastIndexOf(' ', Math.ceil(name.length / 2) + 2);
  return mid > 0 ? [name.slice(0, mid), name.slice(mid + 1)] : [name];
}

export default function Network({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const [sel, setSel] = useState<string>('ueno');
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const panel = useRef<HTMLElement>(null);

  /** Elegir una ficha y, si la descripción no se ve completa, bajar hasta ella. */
  const choose = (id: string) => {
    setSel(id);
    requestAnimationFrame(() => {
      const el = panel.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nav = 72;
      if (r.top < nav || r.top > window.innerHeight * 0.45) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: r.top + window.scrollY - nav - 12, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  };
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const selected = byId.get(sel);
  const rels = edges.filter((e) => e.from === sel || e.to === sel);
  const linked = new Set(rels.flatMap((e) => [e.from, e.to]));

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(id);
    }
  };

  return (
    <div ref={ref} className={`net ${inView ? 'is-in' : ''}`}>
      <div className="net__board">
        <svg viewBox={`0 0 ${W} ${H}`} className="net__svg" role="img" aria-label="Red de vínculos entre personas, empresas e instituciones">
          <g className="net__edges">
            {edges.map((e, i) => {
              const a = byId.get(e.from);
              const b = byId.get(e.to);
              if (!a || !b) return null;
              const on = e.from === sel || e.to === sel;
              const x1 = X(a.pos[0]);
              const y1 = Y(a.pos[1]);
              const x2 = X(b.pos[0]);
              const y2 = Y(b.pos[1]);
              return (
                <g key={i} className={`edge ${on ? 'is-on' : ''}`} style={{ transitionDelay: `${i * 40}ms` }}>
                  <line className="edge__hl" x1={x1} y1={y1} x2={x2} y2={y2} />
                  <line className="edge__ink" x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} />
                </g>
              );
            })}
          </g>
          {nodes.map((n, i) => {
            const cx = X(n.pos[0]);
            const cy = Y(n.pos[1]);
            const [l1, l2] = twoLines(n.name);
            const isSel = n.id === sel;
            const faded = !linked.has(n.id) && !isSel;
            return (
              <g
                key={n.id}
                className={`node ${isSel ? 'is-sel' : ''} ${faded ? 'is-faded' : ''}`}
                transform={`translate(${cx - NW / 2} ${cy - NH / 2})`}
                style={{ transitionDelay: `${200 + i * 45}ms` }}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${n.name}, ${KIND_LABEL[n.kind]}`}
                onClick={() => choose(n.id)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setSel(n.id)}
                onKeyDown={(e) => onKey(e, n.id)}
              >
                <rect className="node__box" width={NW} height={NH} />
                <svg x={9} y={9} width={12} height={12} viewBox="0 0 24 24" className="node__icon">
                  {n.kind === 'persona' && <circle cx="12" cy="12" r="11" />}
                  {n.kind === 'empresa' && <rect x="2" y="2" width="20" height="20" />}
                  {n.kind === 'institucion' && <path d="M12 1.5 23 21.5H1z" />}
                  {n.kind === 'colectivo' && <path d="M9 1h6v8h8v6h-8v8H9v-8H1V9h8z" />}
                </svg>
                <text className="node__kind" x={27} y={19}>
                  {KIND_LABEL[n.kind]}
                </text>
                <text className="node__name" x={10} y={l2 ? 36 : 42}>
                  {l1}
                </text>
                {l2 && (
                  <text className="node__name" x={10} y={51}>
                    {l2}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <ul className="net__legend" aria-label="Referencias">
          {(Object.keys(KIND_LABEL) as NodeKind[]).map((k) => (
            <li key={k}>
              <Shape kind={KIND_SHAPE[k]} />
              {KIND_LABEL[k]}
            </li>
          ))}
        </ul>
      </div>

      <aside className="net__panel" aria-live="polite" ref={panel} tabIndex={-1}>
        {selected && (
          <>
            <span className="lbar">{KIND_LABEL[selected.kind]}</span>
            <h3 className="net__name">{selected.name}</h3>
            {selected.status && <p className="stamp">{selected.status}</p>}
            <ul className="net__rels">
              {rels.map((e, i) => {
                const other = byId.get(e.from === sel ? e.to : e.from);
                return (
                  <li key={i}>
                    <button className="net__other" onClick={() => setSel(other?.id ?? sel)}>
                      {other?.name}
                    </button>
                    <span>{e.label}.</span>
                    <a href={e.source.url} target="_blank" rel="noopener noreferrer">
                      Fuente: {e.source.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}
