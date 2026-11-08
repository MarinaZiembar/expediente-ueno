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
import Videos from '@/components/Videos';
import Testimonials from '@/components/Testimonials';
import { getTestimonials } from '@/lib/testimonios';
import { videos } from '@/content/videos';
import Employees from '@/components/Employees';
import { relatedByRegion } from '@/lib/related';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';

/** Los testimonios aprobados se vuelven a leer cada 5 minutos. */
export const revalidate = 300;

export default async function Page() {
  const testimonials = await getTestimonials();
  const news = newsJson as unknown as NewsFile;
  return (
    <>
      <Nav />
      <main>
        <Deck slides={slides} updatedAt={news.updatedAt} />
        <Timeline items={timeline} />
        <Infographic stats={infoStats} nodes={nodes} edges={edges} />
        <Employees notes={notes} related={relatedByRegion(news.items)} />
        <Testimonials items={testimonials} />
        <Videos videos={videos} />
        <News news={news} posts={posts} />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
