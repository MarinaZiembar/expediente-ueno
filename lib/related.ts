import type { NewsItem, Region } from '@/content/types';

/** Busca en el archivo de prensa titulares relacionados con los trabajadores de cada país. */
const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const WORK = /(trabajador|empleados|despid|liquidaci|ministerio de trabajo|mtess|(?<!ex)funcionarios|sueldo|salarios(?! minimos))/;

const MATCH: Record<Region, (t: string) => boolean> = {
  Paraguay: (t) => WORK.test(t) && !/(argentin|kaitel|buenos aires|urugua|colombi|ahorrista|jubilad)/.test(t),
  Argentina: (t) => /(argentin|kaitel|buenos aires)/.test(t) && /(trabajador|emplead|suspend|sueldo|salari|itti|kaitel|despid)/.test(t),
  'Otros países': (t) =>
    /(urugua|colombi|brasil|chile|peru|bolivia)/.test(t) && /(trabajador|emplead|suspend|sueldo|salari|itti|despid)/.test(t),
};

export type RelatedByRegion = Record<Region, NewsItem[]>;

export function relatedByRegion(items: NewsItem[], max = 6): RelatedByRegion {
  const pick = (r: Region) => items.filter((n) => MATCH[r](strip(n.title))).slice(0, max);
  return { Paraguay: pick('Paraguay'), Argentina: pick('Argentina'), 'Otros países': pick('Otros países') };
}
