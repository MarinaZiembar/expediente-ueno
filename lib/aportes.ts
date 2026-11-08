import { TESTIMONIOS_REPO, TESTIMONIOS_TOKEN, ghHeaders, type Issue } from './testimonios';

/**
 * NOTICIAS APORTADAS POR LA GENTE
 *
 * Usan el mismo repositorio privado que los testimonios, con la etiqueta `noticia`.
 * Se publican solo las que tienen también la etiqueta `aprobado`.
 */

import { NEWS_TITLE_MAX } from './limits';
export { NEWS_TITLE_MAX } from './limits';

export type UserNews = {
  id: string;
  title: string;
  url: string;
  host: string;
  date: string;
};

export function newsIssueBody(title: string, url: string, date: string) {
  return [
    '<!-- noticia:v1 -->',
    `**Título:** ${title}`,
    `**Link:** ${url}`,
    '',
    '---',
    '',
    `_Aportada desde el sitio el ${date}. Para publicarla, agregá la etiqueta \`aprobado\`. Podés editar el título antes de aprobarla. Para descartarla, cerrá el issue sin aprobarla._`,
  ].join('\n');
}

/** Solo links http(s) válidos. */
export function safeUrl(raw: unknown): URL | null {
  if (typeof raw !== 'string') return null;
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (!u.hostname.includes('.')) return null;
    return u;
  } catch {
    return null;
  }
}

function parse(i: Issue): UserNews | null {
  const body = i.body ?? '';
  if (!body.includes('noticia:v1')) return null;
  const title = body.match(/\*\*Título:\*\*\s*(.+)/)?.[1]?.trim();
  const url = safeUrl(body.match(/\*\*Link:\*\*\s*(\S+)/)?.[1]);
  if (!title || !url) return null;
  return {
    id: `gh-${i.number}`,
    title: title.slice(0, NEWS_TITLE_MAX + 20),
    url: url.toString(),
    host: url.hostname.replace(/^www\./, ''),
    date: i.created_at.slice(0, 10),
  };
}

export async function getUserNews(): Promise<UserNews[]> {
  if (!TESTIMONIOS_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${TESTIMONIOS_REPO}/issues?labels=aprobado,noticia&state=all&per_page=100&sort=created&direction=desc`,
      { headers: ghHeaders(), next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const issues = (await res.json()) as Issue[];
    return issues.filter((i) => !i.pull_request).map(parse).filter((n): n is UserNews => n !== null);
  } catch {
    return [];
  }
}
