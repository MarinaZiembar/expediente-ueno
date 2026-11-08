'use client';

import type { EmployeeNote, NoteStatus, Region } from '@/content/types';
import { DTitle, Reveal } from './ui';
import { fmtDate } from '@/lib/format';

const REGIONS: Region[] = ['Paraguay', 'Argentina', 'Otros países'];

const STATUS_LABEL: Record<NoteStatus, string> = {
  oficial: 'Comunicado oficial',
  prensa: 'Según la prensa',
  testimonio: 'Testimonio',
  'en curso': 'En curso',
  'sin confirmar': 'Sin confirmar',
};

export default function Employees({ notes }: { notes: EmployeeNote[] }) {
  return (
    <section id="empleados" className="sec">
      <header className="sec__head">
        <DTitle lines={['¿Cuál es nuestra', 'situación?']} size="lg" swash />
        <Reveal className="sec__lead" delay={200}>
          <p>
            Qué les pasó a los trabajadores del grupo, país por país. Cada dato indica si viene de un comunicado oficial,
            de la prensa o del testimonio de un trabajador, y enlaza a su fuente.
          </p>
        </Reveal>
      </header>

      {notes.length === 0 ? (
        <Reveal>
          <p className="empty">Sin actualizaciones publicadas todavía.</p>
        </Reveal>
      ) : (
        REGIONS.map((region) => {
          const list = notes.filter((n) => n.region === region);
          if (list.length === 0) return null;
          return (
            <div className="region" key={region}>
              <Reveal variant="mask">
                <h3 className="region__title">
                  <span className="lbar lbar--lg">{region}</span>
                  <small>{list.length} {list.length === 1 ? 'dato' : 'datos'}</small>
                </h3>
              </Reveal>
              <ol className="notes">
                {list.map((n, i) => (
                  <Reveal as="li" key={n.id} className="note" delay={(i % 3) * 100}>
                    <div className="note__top">
                      <span className="note__date">{n.dateLabel ?? fmtDate(n.date)}</span>
                      <span className={`status status--${n.status.replace(' ', '-')}`}>{STATUS_LABEL[n.status]}</span>
                    </div>
                    <h4 className="note__title">{n.title}</h4>
                    <p>{n.body}</p>
                    {n.source && (
                      <a className="note__src" href={n.source.url} target="_blank" rel="noopener noreferrer">
                        Fuente: {n.source.name}
                      </a>
                    )}
                  </Reveal>
                ))}
              </ol>
            </div>
          );
        })
      )}
    </section>
  );
}
