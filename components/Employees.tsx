'use client';

import type { EmployeeNote } from '@/content/types';
import { DTitle, Reveal, Sources } from './ui';
import { fmtDate } from '@/lib/format';

export default function Employees({ notes }: { notes: EmployeeNote[] }) {
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section id="empleados" className="sec">
      <header className="sec__head">
        <DTitle lines={['Lo que sa-be-mos', 'los em-plea-dos']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p>Estado de situación desde adentro, actualizado a mano. Cada entrada indica si está confirmada.</p>
        </Reveal>
      </header>

      {sorted.length === 0 ? (
        <Reveal>
          <p className="empty">Sin actualizaciones publicadas todavía.</p>
        </Reveal>
      ) : (
        <ol className="notes">
          {sorted.map((n, i) => (
            <Reveal as="li" key={n.id} className="note" delay={(i % 3) * 100}>
              <div className="note__top">
                <span className="note__date">{fmtDate(n.date)}</span>
                <span className={`status status--${n.status.replace(' ', '-')}`}>{n.status}</span>
              </div>
              <h3 className="note__title">{n.title}</h3>
              <p>{n.body}</p>
              {n.source && <Sources list={[n.source]} />}
            </Reveal>
          ))}
        </ol>
      )}
    </section>
  );
}
