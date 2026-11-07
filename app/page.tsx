import MuseumLoader from '@/components/MuseumLoader';
import newsJson from '@/data/news.json';
import { timeline } from '@/content/timeline';
import { edges, nodes } from '@/content/graph';
import { posts } from '@/content/posts';
import { notes } from '@/content/empleados';
import { DISCLAIMER } from '@/content/meta';
import type { Dataset, NewsFile } from '@/content/types';

export default function Page() {
  const data: Dataset = {
    timeline,
    nodes,
    edges,
    news: newsJson as unknown as NewsFile,
    posts,
    notes,
  };

  return (
    <>
      <MuseumLoader data={data} />
      {/* Versión en texto para buscadores y lectores de pantalla */}
      <section className="sr-only" aria-label="Cronología del caso">
        <h1>Expediente ueno</h1>
        <ol>
          {timeline.map((t, i) => (
            <li key={i}>
              {t.label}: {t.title}. {t.detail}
            </li>
          ))}
        </ol>
        <p>{DISCLAIMER}</p>
      </section>
    </>
  );
}
