import newsJson from '@/data/news.json';
import { timeline } from '@/content/timeline';
import { edges, nodes } from '@/content/graph';
import { posts } from '@/content/posts';
import { notes } from '@/content/empleados';
import { infoStats, slides } from '@/content/slides';
import type { NewsFile } from '@/content/types';
import Nav from '@/components/Nav';
import Deck from '@/components/Deck';
import Timeline from '@/components/Timeline';
import Infographic from '@/components/Infographic';
import News from '@/components/News';
import Employees from '@/components/Employees';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';

export default function Page() {
  const news = newsJson as unknown as NewsFile;
  return (
    <>
      <Nav />
      <main>
        <Deck slides={slides} updatedAt={news.updatedAt} />
        <Timeline items={timeline} />
        <Infographic stats={infoStats} nodes={nodes} edges={edges} />
        <News news={news} posts={posts} />
        <Employees notes={notes} />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
