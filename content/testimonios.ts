import type { Testimonial } from '@/lib/testimonios';

/**
 * Testimonios de trabajadores publicados en medios (citas textuales y breves).
 * Se muestran junto con los testimonios enviados al sitio y aprobados.
 */
export const pressTestimonials: Testimonial[] = [
  {
    id: 'prensa-ar-reclamar',
    country: 'Argentina',
    role: 'Empleados de la filial argentina',
    text: 'No tenemos a quién reclamarle.',
    date: '2026-11-05',
    origin: 'prensa',
    source: {
      name: 'Infobae',
      url: 'https://www.infobae.com/sociedad/2026/11/05/no-tenemos-a-quien-reclamarle-casi-mil-empleados-argentinos-afectados-por-el-colapso-de-ueno-bank/',
    },
  },
  {
    id: 'prensa-uy-mensaje',
    country: 'Uruguay',
    role: 'Líder de equipo en itti, Montevideo',
    text: 'No hubo mensaje oficial, no hubo absolutamente nada.',
    date: '2026-11-05',
    origin: 'prensa',
    source: {
      name: 'El Observador',
      url: 'https://www.elobservador.com.uy/economia-y-empresas/la-quiebra-ueno-bank-y-la-crisis-del-grupo-vazquez-paraguay-tambien-alcanza-trabajadores-uruguayos-n6062868',
    },
  },
  {
    id: 'prensa-co-computadores',
    country: 'Colombia',
    role: 'Trabajadores colombianos del grupo',
    text: 'Nos bloquearon los computadores.',
    date: '2026-11-06',
    origin: 'prensa',
    source: {
      name: 'El Colombiano',
      url: 'https://www.elcolombiano.com/negocios/crisis-ueno-bank-colombianos-trabajadores-limbo-laboral-medellin-AD43263065',
    },
  },
];
