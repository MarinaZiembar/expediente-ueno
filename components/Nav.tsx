'use client';

import { useEffect, useState } from 'react';
import { RollText } from './ui';

const LINKS = [
  { href: '#presentacion', label: 'Qué pasó' },
  { href: '#cronologia', label: 'Cronología' },
  { href: '#infografia', label: 'Infografía' },
  { href: '#noticias', label: 'Noticias' },
  { href: '#empleados', label: 'Empleados' },
];

export default function Nav() {
  const [active, setActive] = useState('#presentacion');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = LINKS.map((l) => document.querySelector(l.href)).filter((el): el is Element => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav ${open ? 'is-open' : ''}`}>
      <a className="nav__logo" href="#presentacion" onClick={() => setOpen(false)}>
        <span className="nav__mark" aria-hidden />
        El caso <b>ueno</b>
      </a>
      <button className="nav__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="nav-links">
        {open ? 'Cerrar' : 'Menú'}
      </button>
      <nav id="nav-links" className="nav__links" aria-label="Secciones">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={active === l.href ? 'is-active' : undefined}
            aria-current={active === l.href ? 'location' : undefined}
            onClick={() => setOpen(false)}
          >
            <RollText>{l.label}</RollText>
          </a>
        ))}
      </nav>
      <a className="nav__live" href="#noticias" onClick={() => setOpen(false)}>
        <span className="live__dot" aria-hidden /> En vivo
      </a>
    </header>
  );
}
