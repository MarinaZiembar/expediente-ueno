'use client';

import type { GraphEdge, GraphNode, InfoStat } from '@/content/types';
import { Counter, DTitle, Reveal, useInView } from './ui';
import Network from './Network';

function StatBox({ s, i }: { s: InfoStat; i: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  return (
    <div
      ref={ref}
      className={`pbox pbox--${s.size} pbox--${s.tone ?? 'plain'} ${inView ? 'is-in' : ''}`}
      style={{ transitionDelay: `${(i % 4) * 90}ms` }}
    >
      <Counter stat={s} run={inView} />
      <p className="pbox__label">{s.label}</p>
      <a className="pbox__src" href={s.source.url} target="_blank" rel="noopener noreferrer">
        Fuente: {s.source.name}
      </a>
    </div>
  );
}

export default function Infographic({ stats, nodes, edges }: { stats: InfoStat[]; nodes: GraphNode[]; edges: GraphEdge[] }) {
  return (
    <section id="infografia" className="sec">
      <header className="sec__head">
        <DTitle lines={['Datos', 'clave']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p>Las cifras del caso y quién está conectado con quién. Cada dato enlaza a la nota de donde sale.</p>
        </Reveal>
      </header>

      <div className="poster">
        {stats.map((s, i) => (
          <StatBox s={s} i={i} key={i} />
        ))}
      </div>

      <div className="sec__sub">
        <Reveal variant="mask">
          <h3 className="lbar lbar--lg">Red de vínculos</h3>
        </Reveal>
        <Reveal delay={150}>
          <p className="sec__hint">Tocá o pasá el mouse por una ficha para ver sus conexiones.</p>
        </Reveal>
      </div>
      <Network nodes={nodes} edges={edges} />
    </section>
  );
}
