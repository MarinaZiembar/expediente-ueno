import { NextResponse } from 'next/server';
import { TESTIMONIOS_REPO, TESTIMONIOS_TOKEN, ghHeaders } from '@/lib/testimonios';
import { NEWS_TITLE_MAX, newsIssueBody, safeUrl } from '@/lib/aportes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FLAG = /(pelotud|boludo|hijo de puta|\bhdp\b|\bputo\b|\bputa\b|mierda|\bforro|conchud|imb[eé]cil|idiota|tarad|cagad|carajo)/i;

/** Límite simple de envíos por IP (por instancia del servidor). */
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX_HITS = 5;

const clean = (s: string) =>
  s
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/@(\w)/g, '@​$1')
    .replace(/<!--|-->|\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export async function POST(req: Request) {
  if (!TESTIMONIOS_TOKEN) {
    return NextResponse.json({ error: 'Los aportes todavía no están habilitados. Probá de nuevo más tarde.' }, { status: 503 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= MAX_HITS) {
    return NextResponse.json({ error: 'Recibimos varios aportes seguidos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'No pudimos leer el formulario.' }, { status: 400 });
  }

  if (typeof data.website === 'string' && data.website.trim()) return NextResponse.json({ ok: true });
  if (typeof data.elapsed !== 'number' || data.elapsed < 3000) {
    return NextResponse.json({ error: 'Tomate un momento para completar el formulario.' }, { status: 400 });
  }

  const title = typeof data.title === 'string' ? clean(data.title) : '';
  const url = safeUrl(data.url);
  if (title.length < 10 || title.length > NEWS_TITLE_MAX) {
    return NextResponse.json({ error: `El título debe tener entre 10 y ${NEWS_TITLE_MAX} caracteres.` }, { status: 400 });
  }
  if (!url) {
    return NextResponse.json({ error: 'Pegá un link válido (que empiece con https://).' }, { status: 400 });
  }
  if (data.accepted !== true) {
    return NextResponse.json({ error: 'Necesitamos que aceptes las condiciones.' }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);
  const labels = ['pendiente', 'noticia', ...(FLAG.test(title) ? ['revisar-lenguaje'] : [])];

  try {
    const res = await fetch(`https://api.github.com/repos/${TESTIMONIOS_REPO}/issues`, {
      method: 'POST',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Noticia · ${title}`.slice(0, 120),
        body: newsIssueBody(title, url.toString(), date),
        labels,
      }),
    });
    if (!res.ok) {
      console.error('GitHub', res.status, await res.text());
      return NextResponse.json({ error: 'No pudimos guardar tu aporte. Probá de nuevo más tarde.' }, { status: 502 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'No pudimos guardar tu aporte. Probá de nuevo más tarde.' }, { status: 502 });
  }

  recent.push(now);
  hits.set(ip, recent);
  return NextResponse.json({ ok: true }, { status: 201 });
}
