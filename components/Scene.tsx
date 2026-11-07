'use client';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Dataset, GraphNode } from '@/content/types';
import { GAP, STATIONS, type StationId } from '@/content/stations';
import { fmtDate } from '@/lib/format';

const WALL_Z = -4.5;
const BOARD_Z = WALL_Z + 0.1;
const CARD_Z = BOARD_Z + 0.1;
/** Con distanceFactor 4, 100px de CSS equivalen a 1 unidad 3D. */
const DF = 4;
const BOARD_Y = 1.95;
const BOARD_W = 10;
const BOARD_H = 3.6;

type SceneProps = { data: Dataset; index: number; onOpen: (i: number) => void };

export default function Scene({ data, index, onOpen }: SceneProps) {
  const look = useRef(new THREE.Vector3(0, BOARD_Y + 0.3, WALL_Z));

  useFrame((state, delta) => {
    const { camera, pointer, size, scene } = state;
    const d = Math.min(delta, 0.1);
    const aspect = size.width / Math.max(size.height, 1);
    // Distancia a la pared necesaria para que entre el tablero completo
    const dist = Math.max(10.5, 11.6 / aspect);
    const targetZ = WALL_Z + dist;
    const x = index * GAP;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x + pointer.x * 0.45, 2.4, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.95 + pointer.y * 0.2, 2.4, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.4, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, x, 3, d);
    camera.lookAt(look.current);

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = dist - 1;
      scene.fog.far = dist + 16;
    }
  });

  return (
    <>
      <color attach="background" args={['#0d0c0b']} />
      <fog attach="fog" args={['#0d0c0b', 9, 27]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#fff1d6', '#1a1510', 0.35]} />
      <Room count={STATIONS.length} />

      {STATIONS.map((s, i) => {
        const near = Math.abs(i - index) <= 1;
        const active = i === index;
        return (
          <group key={s.id} position={[i * GAP, 0, 0]}>
            <Lamp active={active} />
            <Marker n={i + 1} />
            {near && (
              <StationContent
                id={s.id}
                code={s.code}
                title={s.title}
                hint={s.hint}
                data={data}
                dim={!active}
                open={() => onOpen(i)}
              />
            )}
          </group>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Ambiente                                                            */
/* ------------------------------------------------------------------ */

function Room({ count }: { count: number }) {
  const len = (count - 1) * GAP + 40;
  const cx = ((count - 1) * GAP) / 2;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[cx, 0, 0]}>
        <planeGeometry args={[len, 24]} />
        <meshStandardMaterial color="#1b1916" roughness={0.95} />
      </mesh>
      <mesh position={[cx, 4, WALL_Z]}>
        <planeGeometry args={[len, 9]} />
        <meshStandardMaterial color="#24211c" roughness={1} />
      </mesh>
      {/* zócalo */}
      <mesh position={[cx, 0.12, WALL_Z + 0.03]}>
        <boxGeometry args={[len, 0.24, 0.06]} />
        <meshStandardMaterial color="#121110" />
      </mesh>
    </group>
  );
}

function Lamp({ active }: { active: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame((_, delta) => {
    if (!light.current) return;
    const flicker = active ? 1 + Math.sin(performance.now() * 0.013) * 0.015 : 1;
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, (active ? 34 : 7) * flicker, 4, delta);
  });
  return (
    <group position={[0, 4.6, -2.4]}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.4, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.38, 0.32, 24, 1, true]} />
        <meshStandardMaterial color="#2c2a26" side={THREE.DoubleSide} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={active ? '#ffe7b8' : '#6b5e48'} />
      </mesh>
      <pointLight ref={light} position={[0, -0.3, 0]} intensity={7} distance={11} decay={1.6} color="#ffdfa8" />
    </group>
  );
}

/** Marcador de evidencia numerado, como en una escena forense. */
function Marker({ n }: { n: number }) {
  return (
    <group position={[-4.3, 0, -2.2]}>
      <mesh position={[0, 0.17, 0]} rotation-y={Math.PI / 6}>
        <coneGeometry args={[0.22, 0.34, 3]} />
        <meshStandardMaterial color="#f2c230" roughness={0.6} />
      </mesh>
      <Html transform distanceFactor={DF} position={[0, 0.2, 0.12]} zIndexRange={[5, 0]} pointerEvents="none">
        <span className="marker">{n}</span>
      </Html>
    </group>
  );
}

function Board({ color = '#9a7a51' }: { color?: string }) {
  return (
    <group position={[0, BOARD_Y, BOARD_Z]}>
      <mesh>
        <boxGeometry args={[BOARD_W + 0.3, BOARD_H + 0.3, 0.08]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.8} />
      </mesh>
      <mesh position-z={0.05}>
        <boxGeometry args={[BOARD_W, BOARD_H, 0.02]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  );
}

type CardProps = {
  x: number;
  y: number;
  z?: number;
  rot?: number;
  dim?: boolean;
  className?: string;
  onClick?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
  children: ReactNode;
};

function Card({ x, y, z = CARD_Z, rot = 0, dim, className = '', onClick, onEnter, onLeave, children }: CardProps) {
  return (
    <Html transform distanceFactor={DF} position={[x, y, z]} rotation={[0, 0, rot]} zIndexRange={[30, 6]}>
      <div
        className={`card3d ${onClick ? 'clickable' : ''} ${dim ? 'is-dim' : ''} ${className}`}
        onClick={onClick}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        {children}
      </div>
    </Html>
  );
}

function Plate({ code, title, sub, dim, open }: { code: string; title: string; sub: string; dim: boolean; open: () => void }) {
  return (
    <Card x={0} y={BOARD_Y + BOARD_H / 2 + 0.55} dim={dim}>
      <div className="plate">
        <span className="code">{code}</span>
        <h3>{title}</h3>
        <small>{sub}</small>
        <button onClick={open} tabIndex={-1}>
          Abrir ⏎
        </button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Estaciones                                                          */
/* ------------------------------------------------------------------ */

type StationProps = {
  id: StationId;
  code: string;
  title: string;
  hint: string;
  data: Dataset;
  dim: boolean;
  open: () => void;
};

function StationContent(props: StationProps) {
  switch (props.id) {
    case 'entrada':
      return <Entrada {...props} />;
    case 'cronologia':
      return <Cronologia {...props} />;
    case 'vinculos':
      return <Vinculos {...props} />;
    case 'prensa':
      return <Prensa {...props} />;
    case 'redes':
      return <Redes {...props} />;
    case 'empleados':
      return <Empleados {...props} />;
    default:
      return null;
  }
}

function Entrada({ data, dim, open }: StationProps) {
  const tape = 'NO PASAR · EVIDENCIA · CASO UENO · NO PASAR · EVIDENCIA · CASO UENO · NO PASAR · EVIDENCIA · ';
  return (
    <>
      <Card x={0} y={BOARD_Y + 0.25} dim={dim} onClick={open}>
        <div className="title-card">
          <span className="stamp">Expediente abierto</span>
          <h1>Caso ueno bank</h1>
          <p className="kicker">Investigación abierta con información pública, fuente por fuente.</p>
          <dl className="meta">
            <dt>Hechos</dt>
            <dd>{data.timeline.length} en la cronología</dd>
            <dt>Prensa</dt>
            <dd>
              {data.news.items.length} notas · se actualiza cada hora
              {data.news.updatedAt ? ` · última: ${fmtDate(data.news.updatedAt, true)}` : ''}
            </dd>
            <dt>Recorrido</dt>
            <dd>
              <kbd>←</kbd> <kbd>→</kbd> moverse · <kbd>Enter</kbd> abrir · <kbd>P</kbd> pixel
            </dd>
          </dl>
        </div>
      </Card>
      <Card x={0} y={0.35} z={-1.3} rot={0.07} dim={dim}>
        <div className="tape">{tape}</div>
      </Card>
      <Card x={0.4} y={4.05} z={-1.6} rot={-0.05} dim={dim}>
        <div className="tape">{tape}</div>
      </Card>
    </>
  );
}

function Cronologia({ code, title, hint, data, dim, open }: StationProps) {
  const items = data.timeline;
  const n = items.length;
  const step = n > 1 ? 9 / (n - 1) : 0;
  const pos = items.map((_, i) => [-4.5 + i * step, i % 2 === 0 ? BOARD_Y + 0.8 : BOARD_Y - 0.75] as const);
  const string = pos.map(([x, y]) => new THREE.Vector3(x, y + 0.36, BOARD_Z + 0.07));

  return (
    <>
      <Board />
      <Plate code={code} title={title} sub={hint} dim={dim} open={open} />
      {n > 1 && <Line points={string} color="#b3121c" lineWidth={2} />}
      {items.map((t, i) => (
        <Card key={i} x={pos[i][0]} y={pos[i][1]} rot={((i % 3) - 1) * 0.035} dim={dim} onClick={open}>
          <div className="idx-card">
            <span className="pin" />
            <b>{t.label}</b>
            <p>{t.title}</p>
          </div>
        </Card>
      ))}
    </>
  );
}

function Vinculos({ code, title, hint, data, dim, open }: StationProps) {
  const [hover, setHover] = useState<string | null>(null);
  const byId = useMemo(() => new Map<string, GraphNode>(data.nodes.map((n) => [n.id, n])), [data.nodes]);

  const caption = useMemo(() => {
    if (!hover) return hint;
    const node = byId.get(hover);
    if (!node) return hint;
    const rels = data.edges
      .filter((e) => e.from === hover || e.to === hover)
      .map((e) => `${byId.get(e.from === hover ? e.to : e.from)?.name ?? '?'}: ${e.label}`);
    return `${node.name} → ${rels.join(' · ')}`;
  }, [hover, byId, data.edges, hint]);

  const connected = (id: string) =>
    !hover || id === hover || data.edges.some((e) => (e.from === hover && e.to === id) || (e.to === hover && e.from === id));

  return (
    <>
      <Board />
      <Plate code={code} title={title} sub={caption} dim={dim} open={open} />
      {data.edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const on = hover !== null && (e.from === hover || e.to === hover);
        return (
          <Line
            key={i}
            points={[
              [a.pos[0], a.pos[1], BOARD_Z + 0.07],
              [b.pos[0], b.pos[1], BOARD_Z + 0.07],
            ]}
            color={on ? '#ff2d2d' : '#8f1616'}
            lineWidth={on ? 3.2 : 1.5}
            transparent
            opacity={hover && !on ? 0.3 : 0.95}
          />
        );
      })}
      {data.nodes.map((n) => (
        <Card
          key={n.id}
          x={n.pos[0]}
          y={n.pos[1]}
          dim={dim}
          onClick={open}
          onEnter={() => setHover(n.id)}
          onLeave={() => setHover((h) => (h === n.id ? null : h))}
        >
          <div className={`node-card k-${n.kind} ${hover === n.id ? 'is-on' : ''} ${connected(n.id) ? '' : 'is-faded'}`}>
            <span className="pin" />
            <strong>{n.name}</strong>
            {n.status && <em>{n.status}</em>}
          </div>
        </Card>
      ))}
    </>
  );
}

function Prensa({ code, title, data, dim, open }: StationProps) {
  const items = data.news.items.slice(0, 12);
  const sub = data.news.updatedAt
    ? `${data.news.items.length} notas · última actualización ${fmtDate(data.news.updatedAt, true)}`
    : `${data.news.items.length} notas`;
  return (
    <>
      <Board color="#8b6d48" />
      <Plate code={code} title={title} sub={sub} dim={dim} open={open} />
      {items.map((it, i) => {
        const c = i % 4;
        const r = Math.floor(i / 4);
        return (
          <Card
            key={it.id}
            x={-3.75 + c * 2.5}
            y={BOARD_Y + 1.15 - r * 1.15}
            rot={((i * 7) % 5 - 2) * 0.012}
            dim={dim}
            onClick={open}
          >
            <a
              className="clip"
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <span className="clip-src">
                {it.source} · {fmtDate(it.publishedAt)}
              </span>
              <span className="clip-title">{it.title}</span>
            </a>
          </Card>
        );
      })}
    </>
  );
}

function Redes({ code, title, hint, data, dim, open }: StationProps) {
  const items = data.posts.slice(0, 6);
  return (
    <>
      <Board />
      <Plate code={code} title={title} sub={hint} dim={dim} open={open} />
      {items.length === 0 ? (
        <Card x={0} y={BOARD_Y} dim={dim}>
          <div className="note note-empty">Todavía no hay posteos cargados en el expediente.</div>
        </Card>
      ) : (
        items.map((p, i) => (
          <Card key={p.id} x={-3.75 + i * 1.5} y={BOARD_Y + (i % 2 ? -0.3 : 0.3)} rot={(i % 2 ? 1 : -1) * 0.06} dim={dim} onClick={open}>
            <figure className="polaroid">
              <div className="ph" style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}>
                {!p.image && p.platform}
              </div>
              <figcaption>
                <b>{p.author}</b> · {fmtDate(p.date)}
                <br />
                {p.text}
              </figcaption>
            </figure>
          </Card>
        ))
      )}
    </>
  );
}

function Empleados({ code, title, hint, data, dim, open }: StationProps) {
  const items = [...data.notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return (
    <>
      <Board color="#a5865c" />
      <Plate code={code} title={title} sub={hint} dim={dim} open={open} />
      {items.length === 0 ? (
        <Card x={0} y={BOARD_Y} dim={dim}>
          <div className="note note-empty">Sin actualizaciones publicadas todavía.</div>
        </Card>
      ) : (
        items.map((n, i) => {
          const c = i % 3;
          const r = Math.floor(i / 3);
          return (
            <Card key={n.id} x={-3.3 + c * 3.3} y={BOARD_Y + 0.8 - r * 1.6} rot={((i % 3) - 1) * 0.03} dim={dim} onClick={open}>
              <div className="note">
                <span className={`st st-${n.status.replace(' ', '-')}`}>{n.status}</span>
                <small>{fmtDate(n.date)}</small>
                <strong>{n.title}</strong>
              </div>
            </Card>
          );
        })
      )}
    </>
  );
}
