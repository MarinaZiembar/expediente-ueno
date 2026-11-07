#!/usr/bin/env node
/**
 * Junta titulares sobre el caso desde feeds RSS gratuitos (Google News y Bing News)
 * y los suma a data/news.json. Lo corre GitHub Actions cada hora.
 * Sin dependencias: solo Node 18+.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const FILE = new URL('../data/news.json', import.meta.url);
const MAX_ITEMS = 600;
/** Solo se guardan notas cuyo título o bajada mencionen "ueno". */
const MUST_MATCH = /\bueno\b/i;

const GOOGLE_QUERIES = [
  ['ueno bank', 'es'],
  ['ueno Peña', 'es'],
  ['ueno Banco Central del Paraguay', 'es'],
  ['ueno ahorristas', 'es'],
  ['ueno Fiscalía', 'es'],
  ['ueno bank Paraguay', 'en'],
];
const BING_QUERIES = ['ueno bank Paraguay', 'ueno Santiago Peña'];

/** Feeds RSS directos opcionales: { name: 'Medio', url: 'https://.../rss' } */
const EXTRA_FEEDS = [];

function googleUrl(q, lang) {
  const params = lang === 'en' ? 'hl=en-US&gl=US&ceid=US:en' : 'hl=es-419&gl=PY&ceid=PY:es-419';
  return `https://news.google.com/rss/search?q=${encodeURIComponent(`${q} when:7d`)}&${params}`;
}

const FEEDS = [
  ...GOOGLE_QUERIES.map(([q, lang]) => ({ via: 'google', url: googleUrl(q, lang) })),
  ...BING_QUERIES.map((q) => ({ via: 'bing', url: `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss` })),
  ...EXTRA_FEEDS.map((f) => ({ via: 'rss', url: f.url, name: f.name })),
];

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decode(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
      if (e[0] === '#') {
        const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
}

export function normTitle(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}

export function idOf(title) {
  return createHash('sha1').update(normTitle(title)).digest('hex').slice(0, 12);
}

export function parseFeed(xml, via, fallbackSource = '') {
  const out = [];
  for (const m of xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)) {
    const b = m[0];
    let title = decode(tag(b, 'title'));
    let link = decode(tag(b, 'link'));
    let source = decode(tag(b, 'source')) || decode(tag(b, 'News:Source')) || fallbackSource;

    if (via === 'bing') {
      try {
        const real = new URL(link).searchParams.get('url');
        if (real) link = real;
      } catch {}
    }
    if (!source) {
      try {
        source = new URL(link).hostname.replace(/^www\./, '');
      } catch {}
    }
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3)).trim();

    const desc = decode(tag(b, 'description'));
    if (!title || !link) continue;
    if (!MUST_MATCH.test(`${title} ${desc}`)) continue;

    const date = new Date(decode(tag(b, 'pubDate')));
    out.push({
      title,
      url: link,
      source: source || 'Fuente sin nombre',
      publishedAt: (Number.isNaN(date.getTime()) ? new Date() : date).toISOString(),
      via,
    });
  }
  return out;
}

async function get(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; expediente-ueno/1.0)',
      accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const current = JSON.parse(await readFile(FILE, 'utf8'));
  const byId = new Map(current.items.map((i) => [idOf(i.title), i]));
  let added = 0;

  const results = await Promise.allSettled(FEEDS.map(async (f) => parseFeed(await get(f.url), f.via, f.name)));
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.warn(`✗ ${FEEDS[i].url} → ${r.reason?.message ?? r.reason}`);
      return;
    }
    console.log(`✓ ${FEEDS[i].via}: ${r.value.length} notas relevantes`);
    for (const item of r.value) {
      const id = idOf(item.title);
      if (!byId.has(id)) {
        byId.set(id, { id, ...item });
        added++;
      }
    }
  });

  if (added === 0) {
    console.log('Sin novedades; no se modifica el archivo.');
    return;
  }

  const items = [...byId.values()]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, MAX_ITEMS);
  await writeFile(FILE, `${JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2)}\n`);
  console.log(`+${added} notas nuevas (${items.length} en total).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
