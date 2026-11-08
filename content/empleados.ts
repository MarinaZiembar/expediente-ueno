import type { EmployeeNote, Source } from './types';

/**
 * ¿CUÁL ES NUESTRA SITUACIÓN? — carga manual.
 *
 * Se muestran agrupadas por país (Paraguay, Argentina, Otros países),
 * en el orden en que aparecen en este archivo.
 *
 * status:
 *   'oficial'       comunicado de la empresa o de un organismo
 *   'prensa'        informado por medios
 *   'testimonio'    relato de un trabajador publicado en un medio
 *   'en curso'      situación que sigue abierta
 *   'sin confirmar' dato propio todavía no confirmado
 *
 * Ejemplo:
 * {
 *   id: 'ar-2026-11-10-a',
 *   region: 'Argentina',
 *   date: '2026-11-10',
 *   title: 'Título corto y contundente (es lo único que se ve en la tarjeta)',
 *   status: 'en curso',
 *   body: 'Qué se sabe hasta ahora.',
 *   source: { name: 'Medio', url: 'https://...' }, // opcional
 * },
 */

const S = {
  lnpyTrabas: {
    name: 'La Nación (PY)',
    url: 'https://www.lanacion.com.py/pais/2026/11/05/trabajadores-de-ueno-bank-acuden-al-ministerio-de-trabajo-y-denuncian-trabas-para-presentar-reclamos-individuales/',
  },
  lnpyLiquidaciones: {
    name: 'La Nación (PY)',
    url: 'https://www.lanacion.com.py/negocios/2026/11/05/caso-ueno-bank-pago-de-liquidaciones-a-funcionarios-se-realizara-en-los-proximos-dias-segun-bcp/',
  },
  lnpyMtess: {
    name: 'La Nación (PY)',
    url: 'https://www.lanacion.com.py/negocios/2026/11/05/ministerio-de-trabajo-pide-a-empleados-de-ueno-bank-no-renunciar-y-garantiza-acompanamiento-laboral/',
  },
  infobaeAr: {
    name: 'Infobae',
    url: 'https://www.infobae.com/economia/2026/11/05/el-colapso-de-ueno-bank-de-paraguay-golpea-en-argentina-tiene-900-empleados-en-buenos-aires-no-pago-sueldos-y-hay-suspensiones/',
  },
  lnarMail: {
    name: 'La Nación (AR)',
    url: 'https://www.lanacion.com.ar/economia/que-dice-el-mail-que-le-enviaron-a-los-empleados-de-la-filial-argentina-de-ueno-bank-nid05112026/',
  },
  bloomberg: {
    name: 'Bloomberg Línea',
    url: 'https://www.bloomberglinea.com/latinoamerica/argentina/la-crisis-de-ueno-bank-golpea-en-argentina-suspenden-a-mas-900-trabajadores-sin-goce-de-sueldo/',
  },
  observadorUy: {
    name: 'El Observador (UY)',
    url: 'https://www.elobservador.com.uy/economia-y-empresas/la-quiebra-ueno-bank-y-la-crisis-del-grupo-vazquez-paraguay-tambien-alcanza-trabajadores-uruguayos-n6062868',
  },
  colombiano: {
    name: 'El Colombiano',
    url: 'https://www.elcolombiano.com/negocios/crisis-ueno-bank-colombianos-trabajadores-limbo-laboral-medellin-AD43263065',
  },
} satisfies Record<string, Source>;

export const notes: EmployeeNote[] = [
  /* ---------------- Paraguay ---------------- */
  {
    id: 'py-sucursales',
    region: 'Paraguay',
    date: '2026-11-03',
    title: 'Llegaron a trabajar y encontraron a la Policía en la puerta',
    status: 'prensa',
    body: 'El martes 3 de noviembre, trabajadores de ueno bank llegaron a sus puestos y encontraron las sucursales cerradas y custodiadas por la Policía, sin un aviso formal previo.',
    source: S.lnpyTrabas,
  },
  {
    id: 'py-cantidad',
    region: 'Paraguay',
    date: '2026-11-05',
    title: 'Hasta 4.600 trabajadores en la cuerda floja',
    status: 'oficial',
    body: 'Unas 490 personas estaban en la planilla de ueno bank al iniciarse la resolución. La ministra de Trabajo, Mónica Recalde, dijo que también se evalúa al personal de empresas vinculadas y tercerizadas: la cifra preliminar de trabajadores directos e indirectos posiblemente afectados es de unos 4.621.',
    source: S.lnpyTrabas,
  },
  {
    id: 'py-sueldos',
    region: 'Paraguay',
    date: '2026-11-04',
    title: 'El sueldo duró tres horas: después bloquearon las cuentas',
    status: 'testimonio',
    body: 'Según trabajadores citados por Infobae, el personal en Paraguay recibió su sueldo, pero el dinero estuvo disponible solo unas tres horas antes de que se bloquearan las cuentas.',
    source: S.infobaeAr,
  },
  {
    id: 'py-mtess-reclamos',
    region: 'Paraguay',
    date: '2026-11-05',
    title: 'Cientos fueron a reclamar y denuncian trabas',
    status: 'prensa',
    body: 'Cientos de empleados de ueno bank fueron al Ministerio de Trabajo a presentar reclamos. Denunciaron que no se les aceptaban reclamos individuales. Otros trabajadores se manifestaron frente al Banco Central.',
    source: S.lnpyTrabas,
  },
  {
    id: 'py-mtess-recomendaciones',
    region: 'Paraguay',
    date: '2026-11-05',
    title: 'El Gobierno pide a los trabajadores que no renuncien',
    status: 'oficial',
    body: 'El Ministerio de Trabajo pidió no renunciar ni aceptar presiones para hacerlo. Anunció resoluciones para que los créditos laborales tengan privilegio en una eventual disolución o quiebra, e inspecciones a las empresas. Quienes tengan el contrato suspendido mantienen la cobertura del IPS; Paraguay no tiene seguro de desempleo.',
    source: S.lnpyMtess,
  },
  {
    id: 'py-liquidaciones',
    region: 'Paraguay',
    date: '2026-11-05',
    title: 'Liquidaciones: sin fecha y sin monto',
    status: 'oficial',
    body: 'El equipo interventor del Banco Central dijo que gestiona los recursos para pagar las liquidaciones laborales de los empleados del banco "en los próximos días". No informó fecha ni montos.',
    source: S.lnpyLiquidaciones,
  },
  {
    id: 'py-vmedia',
    region: 'Paraguay',
    date: '2026-11-05',
    title: 'Otra empresa del grupo pide suspender a 199 sin sueldo',
    status: 'prensa',
    body: 'Según El Observador, VMedia, del mismo grupo, pidió suspender a unos 199 trabajadores por 90 días sin goce de sueldo.',
    source: S.observadorUy,
  },

  /* ---------------- Argentina ---------------- */
  {
    id: 'ar-kaitel',
    region: 'Argentina',
    date: '2026-11-05',
    title: '940 argentinos atrapados por la caída de un banco paraguayo',
    status: 'prensa',
    body: 'En Argentina, itti opera a través de Kaitel SRL, con unos 940 trabajadores según La Nación. Presta servicios de tecnología a las empresas del grupo vinculado a ueno bank.',
    source: S.lnarMail,
  },
  {
    id: 'ar-suspension',
    region: 'Argentina',
    date: '2026-11-04',
    title: 'Suspendidos por mail: 30 días sin cobrar',
    status: 'oficial',
    body: 'Por mail, la empresa suspendió a parte del personal del 5 de noviembre al 4 de diciembre, sin goce de sueldo, invocando fuerza mayor (arts. 218, 219 y 221 de la Ley de Contrato de Trabajo). La relación laboral sigue vigente y el regreso está previsto para el 5 de diciembre, salvo nuevo aviso.',
    source: S.lnarMail,
  },
  {
    id: 'ar-octubre',
    region: 'Argentina',
    date: '2026-11-04',
    title: 'Octubre impago y sin fecha de cobro',
    status: 'oficial',
    body: 'La empresa dijo que trabaja para conseguir los fondos para pagar los sueldos de octubre, sin dar una fecha, y que seguirá buscándolos para garantizar los de noviembre. Según los trabajadores, los depósitos no llegaron ni a las cuentas locales ni por Deel.',
    source: S.infobaeAr,
  },
  {
    id: 'ar-prepaga',
    region: 'Argentina',
    date: '2026-11-04',
    title: 'Sin sueldo, pero con prepaga',
    status: 'oficial',
    body: 'La empresa se comprometió a seguir pagando la medicina prepaga de los empleados y sus grupos familiares durante los 30 días de suspensión.',
    source: S.lnarMail,
  },
  {
    id: 'ar-remoto',
    region: 'Argentina',
    date: '2026-11-04',
    title: 'Los “esenciales” siguen trabajando desde casa',
    status: 'oficial',
    body: 'Otros trabajadores recibieron un mensaje distinto: seguir trabajando desde sus casas como personal esencial, en lo que la empresa llamó una reorganización transitoria.',
    source: S.infobaeAr,
  },
  {
    id: 'ar-agosto',
    region: 'Argentina',
    date: '2025-08-01',
    dateLabel: 'Ago 2025',
    title: 'Antes del colapso ya habían recortado 200 puestos',
    status: 'prensa',
    body: 'Según La Nación, en agosto de 2025 la empresa ya había reducido su personal en 200 personas.',
    source: S.lnarMail,
  },

  /* ---------------- Otros países ---------------- */
  {
    id: 'uy',
    region: 'Otros países',
    date: '2026-11-05',
    title: 'Uruguay: se enteraron por Slack',
    status: 'testimonio',
    body: 'Un líder de equipo en Montevideo estimó que unos diez uruguayos estaban vinculados a itti. Contó que se enteraron de la intervención por Slack, sin comunicación formal; que supo por colegas que la empresa no pagaría octubre (él cobraba por Deel), y que se estaba bloqueando el acceso a las herramientas de trabajo.',
    source: S.observadorUy,
  },
  {
    id: 'co',
    region: 'Otros países',
    date: '2026-11-06',
    title: 'Colombia: computadoras bloqueadas y “suspendidos hasta nuevo aviso”',
    status: 'testimonio',
    body: 'Trabajadores estiman que unos 200 colombianos trabajan en empresas del grupo. Contaron que les bloquearon las computadoras y les dijeron que estaban suspendidos hasta nuevo aviso. Algunos tienen contrato directo y otros por Deel, y no recibieron respuestas claras sobre su situación.',
    source: S.colombiano,
  },
];
