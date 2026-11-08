'use client';

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import type { Source, Stat } from '@/content/types';

/** true cuando el elemento entra en pantalla (una sola vez). */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Aparece con animación cuando entra en el viewport (igual que en el portfolio). */
export function Reveal({
  children,
  as = 'div',
  delay = 0,
  className = '',
  variant = 'up',
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  variant?: 'up' | 'fade' | 'mask';
}) {
  const [ref, inView] = useInView<HTMLElement>(0.15);
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Texto que "rueda" hacia arriba en el hover. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll" aria-label={children}>
      <span className="roll__inner" aria-hidden="true">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  );
}

/** Letras que suben una por una, cada palabra con su propia máscara. */
function Split({ text, offset = 0 }: { text: string; offset?: number }) {
  let i = offset;
  const words = text.split(' ');
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          {wi > 0 && ' '}
          <span className="w">
            {Array.from(w).map((ch, ci) => (
              <span className="ch" key={ci} style={{ '--i': i++ } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Título tipo póster: mayúsculas grandes, una línea por string.
 * Si `active` es undefined, se anima solo al entrar en pantalla.
 */
export function DTitle({
  lines,
  size = 'md',
  active,
  as = 'h2',
  swash = false,
}: {
  lines: string[];
  size?: 'xl' | 'lg' | 'md' | 'ev';
  active?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  swash?: boolean;
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.3);
  const on = active ?? inView;
  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={`dtitle dtitle--${size} ${on ? 'is-on' : ''}`} aria-label={lines.join(' ')}>
      {swash && <span className="swash swash--a" aria-hidden />}
      {swash && <span className="swash swash--b" aria-hidden />}
      {lines.map((l, li) => (
        <span className="dline" key={li} aria-hidden>
          <Split text={l} offset={li * 5} />
        </span>
      ))}
    </Tag>
  );
}

/** Convierte **texto** en resaltado de marcador. */
export function Rich({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark className="hl" key={i}>
            {p}
          </mark>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

const nf = (d: number) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Número que cuenta desde 0 cuando `run` pasa a true. */
export function Counter({ stat, run }: { stat: Stat; run: boolean }) {
  const target = stat.value;
  const [v, setV] = useState<number>(target ?? 0);

  useEffect(() => {
    if (target === undefined || !run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1300);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  const text = stat.text ?? `${stat.prefix ?? ''}${nf(stat.decimals ?? 0).format(v)}${stat.suffix ?? ''}`;
  return <span className="num">{text}</span>;
}

export function Sources({ list }: { list: Source[] }) {
  return (
    <p className="sources">
      <span>Fuente:</span>{' '}
      {list.map((s, i) => (
        <Fragment key={`${s.url}-${i}`}>
          {i > 0 && <span className="sources__sep"> • </span>}
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.name}
          </a>
        </Fragment>
      ))}
    </p>
  );
}

/** Pequeñas formas geométricas en SVG. */
export function Shape({
  kind,
  className = '',
}: {
  kind: 'circle' | 'square' | 'triangle' | 'plus' | 'half' | 'ring';
  className?: string;
}) {
  const common = { className: `shape ${className}`, viewBox: '0 0 24 24', 'aria-hidden': true } as const;
  switch (kind) {
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
        </svg>
      );
    case 'ring':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    case 'square':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="20" height="20" fill="currentColor" />
        </svg>
      );
    case 'triangle':
      return (
        <svg {...common}>
          <path d="M12 1.5 23 21.5H1z" fill="currentColor" />
        </svg>
      );
    case 'half':
      return (
        <svg {...common}>
          <path d="M1 17a11 11 0 0 1 22 0z" fill="currentColor" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M9 1h6v8h8v6h-8v8H9v-8H1V9h8z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export const pad = (n: number) => String(n).padStart(2, '0');
