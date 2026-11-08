import type { Source } from '@/content/types';
import { pressTestimonials } from '@/content/testimonios';

/**
 * TESTIMONIOS CON MODERACIÓN
 *
 * Cada testimonio enviado desde el sitio se guarda como un "issue" en un
 * repositorio PRIVADO de GitHub, con la etiqueta `pendiente`.
 * Solo se publican los que tienen la etiqueta `aprobado`.
 *
 * Variables de entorno (en Vercel → Settings → Environment Variables):
 *   TESTIMONIOS_GITHUB_TOKEN  token "fine-grained" con permiso Issues: Read and write
 *                             sobre el repositorio privado (obligatoria)
 *   TESTIMONIOS_INVITE        código del link de invitación para empleados (obligatoria).
 *                             Link: https://expediente-ueno.vercel.app/?invitacion=CÓDIGO
 *                             Para invalidar el link, cambiá este valor y redeployá.
 *   TESTIMONIOS_REPO          "usuario/repositorio" (opcional, ver valor por defecto)
 */

import { timingSafeEqual } from 'node:crypto';

export type Testimonial = {
  id: string;
  country: string;
  role: string;
  text: string;
  /** ISO, p. ej. "2026-11-07" */
  date: string;
  origin: 'prensa' | 'sitio';
  source?: Source;
};

export { COUNTRIES } from './countries';

export const TESTIMONIOS_REPO = process.env.TESTIMONIOS_REPO || 'MarinaZiembar/expediente-ueno-testimonios';
export const TESTIMONIOS_TOKEN = process.env.TESTIMONIOS_GITHUB_TOKEN || '';
const INVITE = process.env.TESTIMONIOS_INVITE || '';

/** Compara el código recibido con el de invitación sin filtrar información por tiempos. */
export function validInvite(code: unknown): boolean {
  if (!INVITE || typeof code !== 'string' || code.length !== INVITE.length) return false;
  return timingSafeEqual(Buffer.from(code), Buffer.from(INVITE));
}

export const ghHeaders = () => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TESTIMONIOS_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'expediente-ueno',
});

/** Formato del cuerpo del issue. Lo que esté entre las dos líneas --- es el texto publicado. */
export function issueBody(country: string, role: string, text: string, date: string) {
  return [
    '<!-- testimonio:v1 -->',
    `**País:** ${country}`,
    `**Cargo:** ${role}`,
    '',
    '---',
    '',
    text,
    '',
    '---',
    '',
    `_Enviado desde el sitio el ${date}. Para publicarlo, agregá la etiqueta \`aprobado\`. Podés editar el texto (entre las dos líneas) antes de aprobarlo. Para descartarlo, cerrá el issue sin aprobarlo._`,
  ].join('\n');
}

type Issue = { number: number; body: string | null; created_at: string; state: string; pull_request?: unknown };

function parseIssue(i: Issue): Testimonial | null {
  const body = i.body ?? '';
  if (!body.includes('testimonio:v1')) return null;
  const country = body.match(/\*\*País:\*\*\s*(.+)/)?.[1]?.trim();
  const role = body.match(/\*\*Cargo:\*\*\s*(.+)/)?.[1]?.trim();
  const parts = body.split(/\n---\n/);
  const text = parts[1]?.trim();
  if (!country || !role || !text) return null;
  return { id: `gh-${i.number}`, country, role, text, date: i.created_at.slice(0, 10), origin: 'sitio' };
}

async function fetchApproved(): Promise<Testimonial[]> {
  if (!TESTIMONIOS_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${TESTIMONIOS_REPO}/issues?labels=aprobado&state=all&per_page=50&sort=created&direction=desc`,
      { headers: ghHeaders(), next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const issues = (await res.json()) as Issue[];
    return issues.filter((i) => !i.pull_request).map(parseIssue).filter((t): t is Testimonial => t !== null);
  } catch {
    return [];
  }
}

/** Aprobados del sitio primero, después las citas de prensa. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const approved = await fetchApproved();
  return [...approved, ...pressTestimonials];
}
