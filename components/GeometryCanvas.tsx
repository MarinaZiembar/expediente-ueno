'use client';

import { useEffect, useRef } from 'react';

/**
 * Formas geométricas generativas (mismo motor que el portfolio), en lima y negro.
 * Flotan, tienen parallax, se apartan del cursor y se reacomodan con un click.
 */

type Kind = 'circle' | 'ring' | 'square' | 'triangle' | 'plus' | 'half' | 'dots' | 'bars';

type Shape = {
  kind: Kind;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  phase: number;
  depth: number;
  fill: string | null;
  stroke: string | null;
};

const LIME = '#a9f46c';
const INK = '#121212';
const KINDS: Kind[] = ['circle', 'ring', 'square', 'triangle', 'plus', 'half', 'dots', 'bars'];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

function homePosition(isWide: boolean, taken: { hx: number; hy: number }[] = []) {
  let best = { hx: 0.7, hy: 0.2 };
  let bestDist = -1;
  for (let i = 0; i < 14; i++) {
    const p = isWide
      ? Math.random() < 0.6
        ? { hx: rand(0.5, 0.96), hy: rand(0.12, 0.3) }
        : { hx: rand(0.88, 0.97), hy: rand(0.34, 0.8) }
      : { hx: rand(0.55, 0.94), hy: rand(0.1, 0.32) };
    const d = taken.length ? Math.min(...taken.map((t) => Math.hypot(t.hx - p.hx, (t.hy - p.hy) * 1.6))) : 1;
    if (d > bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

function makeShapes(count: number, isWide: boolean, w: number, h: number): Shape[] {
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const kind = i < KINDS.length ? KINDS[i] : pick(KINDS);
    const { hx, hy } = homePosition(isWide, shapes);
    const roll = Math.random();
    let fill: string | null = null;
    let stroke: string | null = null;
    if (kind === 'ring' || kind === 'bars') stroke = roll < 0.5 ? INK : LIME;
    else if (kind === 'dots') fill = INK;
    else if (roll < 0.45) fill = LIME;
    else if (roll < 0.7) fill = INK;
    else stroke = INK;
    shapes.push({
      kind,
      hx,
      hy,
      x: hx * w,
      y: hy * h,
      vx: 0,
      vy: 0,
      size: isWide ? rand(0.045, 0.1) : rand(0.07, 0.12),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.004, 0.004) || 0.002,
      phase: rand(0, Math.PI * 2),
      depth: rand(0.25, 1),
      fill,
      stroke,
    });
  }
  return shapes;
}

function drawShape(ctx: CanvasRenderingContext2D, s: Shape, px: number, lw: number) {
  const r = px / 2;
  ctx.beginPath();
  switch (s.kind) {
    case 'circle':
    case 'ring':
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      break;
    case 'square':
      ctx.rect(-r, -r, px, px);
      break;
    case 'triangle':
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.95, r * 0.75);
      ctx.lineTo(-r * 0.95, r * 0.75);
      ctx.closePath();
      break;
    case 'half':
      ctx.arc(0, 0, r, Math.PI, 0);
      ctx.closePath();
      break;
    case 'plus': {
      const t = px * 0.28;
      ctx.rect(-t / 2, -r, t, px);
      ctx.rect(-r, -t / 2, px, t);
      break;
    }
    case 'dots': {
      const n = 4;
      const gap = px / (n - 1);
      const d = Math.max(2, px * 0.06);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const cx = -r + i * gap;
          const cy = -r + j * gap;
          ctx.moveTo(cx + d, cy);
          ctx.arc(cx, cy, d, 0, Math.PI * 2);
        }
      break;
    }
    case 'bars': {
      const n = 5;
      const gap = px / (n - 1);
      for (let i = 0; i < n; i++) {
        ctx.moveTo(-r, -r + i * gap);
        ctx.lineTo(r, -r + i * gap);
      }
      break;
    }
  }
  if (s.fill) {
    ctx.fillStyle = s.fill;
    ctx.fill();
  }
  if (s.stroke) {
    ctx.strokeStyle = s.stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

export default function GeometryCanvas({ className, paused = false }: { className?: string; paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const resumeRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) resumeRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let shapes: Shape[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0, tx: 0, ty: 0, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isWide = w > 820;
      const count = isWide ? 13 : 8;
      if (shapes.length !== count) shapes = makeShapes(count, isWide, w, h);
      else
        shapes.forEach((s) => {
          s.x = s.hx * w;
          s.y = s.hy * h;
        });
      if (!running) draw();
    };

    const shuffle = () => {
      const isWide = w > 820;
      const taken: { hx: number; hy: number }[] = [];
      shapes.forEach((s) => {
        const p = homePosition(isWide, taken);
        taken.push(p);
        s.hx = p.hx;
        s.hy = p.hy;
        s.vrot += rand(-0.08, 0.08);
      });
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = mouse.y = -9999;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest('a, button')) return;
      shuffle();
    };

    let t = 0;
    const draw = () => {
      const unit = Math.min(w, h);
      const lw = Math.max(1.5, unit * 0.004);
      ctx.clearRect(0, 0, w, h);
      for (const s of shapes) {
        const px = s.size * unit * (0.85 + s.depth * 0.3);
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        drawShape(ctx, s, px, lw);
        ctx.restore();
      }
    };

    const step = () => {
      t += 1;
      mouse.nx += (mouse.tx - mouse.nx) * 0.05;
      mouse.ny += (mouse.ty - mouse.ny) * 0.05;
      const unit = Math.min(w, h);
      for (const s of shapes) {
        const targetX = s.hx * w + Math.sin(t * 0.008 + s.phase) * unit * 0.015 - mouse.nx * 30 * s.depth;
        const targetY = s.hy * h + Math.cos(t * 0.011 + s.phase) * unit * 0.02 - mouse.ny * 30 * s.depth;
        s.vx += (targetX - s.x) * 0.012;
        s.vy += (targetY - s.y) * 0.012;
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = unit * 0.22;
          if (dist < radius) {
            const force = (1 - dist / radius) * 2.4;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
            s.vrot += 0.0015 * Math.sign(dx);
          }
        }
        s.vx *= 0.86;
        s.vy *= 0.86;
        s.x += s.vx;
        s.y += s.vy;
        s.vrot += (Math.sign(s.vrot) * 0.003 - s.vrot) * 0.02;
        s.rot += s.vrot;
      }
      draw();
    };

    const loop = () => {
      if (!visible || pausedRef.current || reduced) {
        running = false;
        return;
      }
      step();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    resumeRef.current = start;

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    host.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
