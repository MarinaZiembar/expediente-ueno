export type Source = { name: string; url: string };

export type TimelineEntry = {
  /** Etiqueta corta visible en la ficha, p. ej. "3 nov 2026" */
  label: string;
  title: string;
  detail: string;
  sources: Source[];
};

export type NodeKind = 'persona' | 'empresa' | 'institucion' | 'colectivo';

export type GraphNode = {
  id: string;
  name: string;
  kind: NodeKind;
  /** Rol o estado según las fuentes (sin calificativos propios) */
  status?: string;
  /** Posición en el tablero (unidades 3D). x: -4.5..4.5, y: 0.6..3.3 */
  pos: [number, number];
};

export type GraphEdge = {
  from: string;
  to: string;
  label: string;
  source: Source;
};

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  via: string;
};

export type NewsFile = {
  updatedAt: string | null;
  items: NewsItem[];
};

export type Platform = 'instagram' | 'x' | 'tiktok' | 'facebook' | 'youtube' | 'otro';

export type SocialPost = {
  id: string;
  platform: Platform;
  author: string;
  /** ISO, p. ej. "2026-11-05" */
  date: string;
  url: string;
  /** Resumen o texto del posteo, con tus palabras o citado */
  text: string;
  /** URL de imagen opcional (que tengas derecho a usar) */
  image?: string;
};

export type NoteStatus = 'confirmado' | 'sin confirmar' | 'en curso';

export type EmployeeNote = {
  id: string;
  /** ISO, p. ej. "2026-11-07" */
  date: string;
  title: string;
  status: NoteStatus;
  body: string;
  source?: Source;
};

export type Dataset = {
  timeline: TimelineEntry[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  news: NewsFile;
  posts: SocialPost[];
  notes: EmployeeNote[];
};
