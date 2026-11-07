import type { SocialPost } from './types';

/**
 * POSTEOS DE REDES — carga manual.
 *
 * Agregá un objeto por posteo y hacé commit; Vercel redeploya solo.
 * Usá posteos públicos y, si ponés imagen, que sea una que puedas usar.
 *
 * Ejemplo:
 * {
 *   id: 'ig-2026-11-05-1',
 *   platform: 'instagram',
 *   author: '@cuenta',
 *   date: '2026-11-05',
 *   url: 'https://www.instagram.com/p/XXXXXXXX/',
 *   text: 'Resumen breve del posteo.',
 * },
 */
export const posts: SocialPost[] = [];
