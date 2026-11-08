'use client';

import { useEffect, useRef, useState } from 'react';
import { LEGAL, LEGAL_UPDATED } from '@/content/legal';
import { CREDITS } from '@/content/meta';
import { fmtDate } from '@/lib/format';

/** Link del footer que abre los términos y el aviso legal en una modal. */
export default function Legal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="footer__legal" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Términos y aviso legal
      </button>
      {open && <LegalModal onClose={() => setOpen(false)} />}
    </>
  );
}

function LegalModal({ onClose }: { onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    lastFocus.current = document.activeElement;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fmodal" role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={onClose}>
      <div className="fmodal__box fmodal__box--wide" onClick={(e) => e.stopPropagation()}>
        <div className="fmodal__head">
          <h3 id="legal-title">Términos y aviso legal</h3>
          <button ref={closeBtn} className="sqbtn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="legal">
          <p className="fmodal__note">
            <b>En resumen:</b> este sitio solo reúne y enlaza información de fuentes citadas. No opina, no acusa y no se
            responsabiliza por lo que publican terceros. Ante cualquier duda, vale lo que dice la fuente original.
          </p>
          {LEGAL.map((s, i) => (
            <section key={s.title} className="legal__sec">
              <h4>
                <span>{String(i + 1).padStart(2, '0')}</span> {s.title}
              </h4>
              {s.body.map((p, j) => (
                <p key={j}>
                  {p}
                  {s.title.startsWith('Correcciones') && j === s.body.length - 1 && (
                    <>
                      {' '}
                      <a href={CREDITS.url} target="_blank" rel="noopener noreferrer">
                        Contacto por LinkedIn ↗
                      </a>
                    </>
                  )}
                </p>
              ))}
            </section>
          ))}
          <p className="legal__date">Última actualización: {fmtDate(LEGAL_UPDATED)}</p>
          <button className="bigbtn" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
