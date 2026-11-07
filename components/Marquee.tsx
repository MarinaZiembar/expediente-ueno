'use client';

import { useEffect, useRef } from 'react';
import { Shape } from './ui';

const SHAPES = ['circle', 'square', 'triangle', 'plus', 'half', 'ring'] as const;

/** Cinta infinita que se acelera con el scroll y cambia de dirección (igual que en el portfolio). */
export default function Marquee({
  items,
  tone = 'lime',
  baseSpeed = 0.6,
  label,
}: {
  items: { text: string; href?: string }[];
  tone?: 'lime' | 'ink';
  baseSpeed?: number;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let hover = false;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      boost = Math.min(boost + Math.abs(dy) * 0.08, 14);
    };
    const enter = () => (hover = true);
    const leave = () => (hover = false);

    const loop = () => {
      const half = el.scrollWidth / 2;
      boost *= 0.92;
      x += dir * (hover ? 0.15 : baseSpeed + boost);
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      el.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, [baseSpeed]);

  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className={`marquee marquee--${tone}`} role="region" aria-label={label}>
      <div className="marquee__track" ref={track}>
        {doubled.map((it, i) => (
          <span className="marquee__item" key={i} aria-hidden={i >= items.length}>
            {it.href ? (
              <a href={it.href} target="_blank" rel="noopener noreferrer" tabIndex={i >= items.length ? -1 : undefined}>
                {it.text}
              </a>
            ) : (
              it.text
            )}
            <Shape kind={SHAPES[i % SHAPES.length]} className="marquee__shape" />
          </span>
        ))}
      </div>
    </div>
  );
}
