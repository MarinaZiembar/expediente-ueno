import { NextResponse } from 'next/server';
import { COUNTRIES, TESTIMONIOS_REPO, TESTIMONIOS_TOKEN, ghHeaders, issueBody, validInvite } from '@/lib/testimonios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIN_TEXT = 40;
const MAX_TEXT = 2000;
const MAX_ROLE = 80;

/** Palabras que marcan el testimonio para revisar con más atención (no lo bloquean). */
const FLAG = /(pelotud|boludo|hijo de puta|\bhdp\b|\bputo\b|\bputa\b|mierda|\bforro|conchud|concha de|imb[eé]cil|idiota|tarad|mog[oó]lic|cagad|carajo|chorr[oa]|ladr[oó]n|garca|estafador|delincuente|corrupto)/i;

/** Límite simple de envíos por IP (por instancia del servidor). */
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX_HITS = 3;

const clean = (s: string) =>
  s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/https?:\/\/\S+/gi, '[enlace]')
    .replace(/@(\w)/g, '@​$1') // evita menciones en GitHub
    .replace(/<!--|-->/g, '')
    .replace(/^---$/gm, '—')
    .trim();

export async function POST(req: Request) {
  if (!TESTIMONIOS_TOKEN) {
    return NextResponse.json({ error: 'Los testimonios todavía no están habilitados. Probá de nuevo más tarde.' }, { status: 503 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= MAX_HITS) {
    return NextResponse.json({ error: 'Recibimos varios envíos seguidos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'No pudimos leer el formulario.' }, { status: 400 });
  }

  // solo con el link de invitación para empleados
  if (!validInvite(data.invite)) {
    return NextResponse.json({ error: 'Este formulario es solo para trabajadores con el link de invitación.' }, { status: 403 });
  }

  // campo trampa para bots: si viene completo, se descarta sin avisar
  if (typeof data.website === 'string' && data.website.trim()) return NextResponse.json({ ok: true });
  if (typeof data.elapsed !== 'number' || data.elapsed < 4000) {
    return NextResponse.json({ error: 'Tomate un momento para completar el formulario.' }, { status: 400 });
  }

  const country = typeof data.country === 'string' ? data.country : '';
  const role = typeof data.role === 'string' ? clean(data.role).replace(/\s+/g, ' ') : '';
  const text = typeof data.text === 'string' ? clean(data.text) : '';

  if (!(COUNTRIES as readonly string[]).includes(country)) {
    return NextResponse.json({ error: 'Elegí un país.' }, { status: 400 });
  }
  if (role.length < 2 || role.length > MAX_ROLE) {
    return NextResponse.json({ error: `Contanos tu cargo (hasta ${MAX_ROLE} caracteres).` }, { status: 400 });
  }
  if (text.length < MIN_TEXT || text.length > MAX_TEXT) {
    return NextResponse.json({ error: `El testimonio debe tener entre ${MIN_TEXT} y ${MAX_TEXT} caracteres.` }, { status: 400 });
  }
  if (data.accepted !== true) {
    return NextResponse.json({ error: 'Necesitamos que aceptes las condiciones.' }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);
  const labels = ['pendiente', 'via-invitacion', ...(FLAG.test(`${role} ${text}`) ? ['revisar-lenguaje'] : [])];

  try {
    const res = await fetch(`https://api.github.com/repos/${TESTIMONIOS_REPO}/issues`, {
      method: 'POST',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Testimonio · ${country} · ${role}`.slice(0, 120),
        body: issueBody(country, role, text, date),
        labels,
      }),
    });
    if (!res.ok) {
      console.error('GitHub', res.status, await res.text());
      return NextResponse.json({ error: 'No pudimos guardar tu testimonio. Probá de nuevo más tarde.' }, { status: 502 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'No pudimos guardar tu testimonio. Probá de nuevo más tarde.' }, { status: 502 });
  }

  recent.push(now);
  hits.set(ip, recent);
  return NextResponse.json({ ok: true }, { status: 201 });
}
