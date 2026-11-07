import newsJson from '@/data/news.json';
import { timeline } from '@/content/timeline';
import { edges, nodes } from '@/content/graph';
import { posts } from '@/content/posts';
import { notes } from '@/content/empleados';
import { infoStats, slides } from '@/content/slides';
import type { NewsFile } from '@/content/types';
import Nav from '@/components/Nav';
import Deck from '@/components/Deck';
import Marquee from '@/components/Marquee';
import Infographic from '@/components/Infographic';
import News from '@/components/News';
import Employees from '@/components/Employees';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';

export default function Page() {
  const news = newsJson as unknown as NewsFile;
  const headlines = news.items.slice(0, 10).map((n) => ({ text: n.title, href: n.url }));
  const terms = ['Banco Central', 'Fiscalía', 'Ahorristas', 'Juicio político', 'IPS', 'Imputados', 'Ley de emergencia'].map(
    (text) => ({ text }),
  );

  return (
    <>
      <Nav />
      <main>
        <Deck slides={slides} timeline={timeline} updatedAt={news.updatedAt} />
        <Marquee items={terms} tone="lime" label="Temas del caso" />
        <Infographic stats={infoStats} nodes={nodes} edges={edges} />
        <Marquee items={headlines} tone="ink" baseSpeed={0.45} label="Últimos titulares" />
        <News news={news} posts={posts} />
        <Employees notes={notes} />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
