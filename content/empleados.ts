import type { EmployeeNote } from './types';

/**
 * LO QUE SABEMOS LOS EMPLEADOS — carga manual.
 *
 * Una entrada por actualización. Lo más nuevo puede ir arriba o abajo:
 * el sitio las ordena por fecha.
 *
 * status: 'confirmado' | 'sin confirmar' | 'en curso'
 *
 * Ejemplo:
 * {
 *   id: '2026-11-07-a',
 *   date: '2026-11-07',
 *   title: 'Título corto',
 *   status: 'en curso',
 *   body: 'Qué se sabe hasta ahora, en lenguaje simple.',
 *   source: { name: 'Comunicado oficial', url: 'https://...' }, // opcional
 * },
 */
export const notes: EmployeeNote[] = [];
