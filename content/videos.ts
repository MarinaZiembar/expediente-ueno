/**
 * EN VIDEO — carga manual.
 *
 * Pegá el link del video tal cual (YouTube, Instagram Reel o TikTok).
 * El sitio arma solo la miniatura (en YouTube) y el reproductor.
 *
 * Ejemplos de links válidos:
 *   https://www.youtube.com/watch?v=XXXXXXXXXXX
 *   https://youtu.be/XXXXXXXXXXX
 *   https://www.instagram.com/reel/XXXXXXXXXXX/
 *   https://www.tiktok.com/@cuenta/video/1234567890123456789
 */

export type Video = {
  url: string;
  /** Título corto que se ve en la tarjeta */
  title: string;
  /** Medio o cuenta que publicó el video */
  author: string;
};

export const videos: Video[] = [
  {
    url: 'https://www.youtube.com/watch?v=Q9RXgCUvKZs',
    title: '¿Cómo ayudó Santiago Peña a crecer a ueno bank?',
    author: 'France 24 Español',
  },
  {
    url: 'https://www.youtube.com/watch?v=07ugzMOgKps',
    title: 'ueno cerró: qué pasó, por qué y qué pasa con tu plata',
    author: 'YouTube',
  },
  {
    url: 'https://www.tiktok.com/@abc_py/video/7489647413603405061',
    title: 'Peña anuncia la venta de sus acciones en ueno Holding',
    author: 'ABC Color',
  },
  {
    url: 'https://www.youtube.com/watch?v=VlxxPMS61js',
    title: '“Todo mi dinero tenía en el banco”: el testimonio de una afectada',
    author: 'YouTube',
  },
  {
    url: 'https://www.tiktok.com/@americatvpy/video/7489561623229697286',
    title: 'Peña dice que no tiene vínculos con ueno bank ni con itti',
    author: 'América TV',
  },
  {
    url: 'https://www.youtube.com/watch?v=E2k9KqacrrI',
    title: 'Paraguay’s Ueno Bank collapse: what really happened?',
    author: 'YouTube',
  },
  {
    url: 'https://www.tiktok.com/@abc_py/video/7428590511193115910',
    title: 'La pregunta sobre IPS y ueno que incomodó a Peña',
    author: 'ABC Color',
  },
  {
    url: 'https://www.youtube.com/watch?v=w5WUo9uMjeI',
    title: 'Protestas en Paraguay tras el cierre de ueno',
    author: 'YouTube',
  },
  {
    url: 'https://www.youtube.com/watch?v=G4G14CYYzSU',
    title: 'ueno bank y el dinero público (en portugués)',
    author: 'YouTube',
  },
];
