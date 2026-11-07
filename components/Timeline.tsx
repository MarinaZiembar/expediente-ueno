'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { TimelineEntry } from '@/content/types';
import { DTitle, Sources, pad, useInView } from './ui';

const d = (ms: number) => ({ '--d': ms }) as CSSProperties;

function Item({
  t,
  n,
  total,
  onFocus,
}: {
  t: TimelineEntry;
  n: number;
  total: number;
  onFocus: () => void;
}) {
  const [ref, inView] = useInView<HTMLElement>(0.35);
  return (
    <article ref={ref} className={`hs__item ${inView ? 'is-in' : ''}`} onFocusCapture={onFocus} aria-label={`${t.label}: ${t.title}`}>
      <div className="hs__date">
        <span className="ev__n rv" style={d(0)}>
          {pad(n)}
          <small>/{pad(total)}</small>
        </span>
        <span className="ev__label rv" style={d(150)}>
          {t.label}
        </span>
      </div>
      <div className="hs__text">
        <DTitle lines={[t.title.toUpperCase()]} size="ev" as="h3" active={inView} />
        <p className="ev__detail rv" style={d(350)}>
          {t.detail}
        </p>
        <div className="rv" style={d(500)}>
          <Sources list={t.sources} />
        </div>
      </div>
    </article>
  );
}

/**
 * Cronología con scroll horizontal: la sección queda fija mientras el scroll
 * vertical desplaza los hechos de derecha a izquierda; al terminar, la página sigue.
 */
export default function Timeline({ items }: { items: TimelineEntry[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const geo = useRef({ dist: 0, stops: [] as number[] });
  const [stops, setStops] = useState<number[]>([]);
  const [cur, setCur] = useState(0);
  const curRef = useRef(0);
  const [introRef, introIn] = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const { dist, stops: st } = geo.current;
      const top = sec.getBoundingClientRect().top;
      const p = dist > 0 ? Math.min(1, Math.max(0, -top / dist)) : 0;
      tr.style.transform = `translate3d(${-p * dist}px,0,0)`;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      let c = 0;
      // un hecho cuenta como "actual" cuando su centro está cerca del centro de la pantalla
      for (let i = 0; i < st.length; i++) if (p >= st[i] - 0.025) c = i + 1;
      if (c !== curRef.current) {
        curRef.current = c;
        setCur(c);
      }
    };

    const measure = () => {
      const vw = window.innerWidth;
      const dist = Math.max(0, tr.scrollWidth - vw);
      sec.style.height = `${dist + window.innerHeight}px`;
      const its = Array.from(tr.querySelectorAll<HTMLElement>('.hs__item'));
      const st = its.map((el) => {
        const center = el.offsetLeft + el.offsetWidth / 2 - vw / 2;
        return dist > 0 ? Math.min(1, Math.max(0, center / dist)) : 0;
      });
      geo.current = { dist, stops: st };
      setStops(st);
      update();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, [items.length]);

  /** Si se navega con Tab, lleva la página hasta el hecho enfocado. */
  const focusItem = (i: number) => {
    const sec = section.current;
    const st = geo.current.stops[i];
    if (!sec || st === undefined) return;
    const y = sec.getBoundingClientRect().top + window.scrollY + st * geo.current.dist;
    window.scrollTo({ top: y });
  };

  return (
    <section id="cronologia" ref={section} className="hs" aria-label="Cronología del caso">
      <div className="hs__sticky">
        <div className="hs__track" ref={track}>
          <div ref={introRef} className={`hs__intro ${introIn ? 'is-in' : ''}`}>
            <p className="eyebrow rv" style={d(50)}>
              <span className="lbar">Paso a paso</span>
            </p>
            <DTitle lines={['La cro-', 'no-lo-', 'gía']} size="lg" active={introIn} swash />
            <p className="lead rv" style={d(500)}>
              {items.length} hechos, en orden, con la fuente de cada uno.
            </p>
            <p className="hs__hint rv" style={d(650)}>
              Seguí bajando <span aria-hidden>↓</span>
            </p>
          </div>
          {items.map((t, i) => (
            <Item key={i} t={t} n={i + 1} total={items.length} onFocus={() => focusItem(i)} />
          ))}
          <div className="hs__spacer" aria-hidden />
        </div>

        <div className="hs__bar" aria-hidden>
          <span className="hs__label">Cronología</span>
          <div className="hs__progress">
            <span className="hs__fill" ref={fill} />
            {stops.map((s, i) => (
              <i key={i} className={i < cur ? 'is-past' : ''} style={{ left: `${s * 100}%` }} />
            ))}
          </div>
          <span className="hs__count">
            {pad(cur)} / {pad(items.length)}
          </span>
        </div>
      </div>
    </section>
  );
}
