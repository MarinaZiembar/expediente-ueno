import type { Source, TimelineEntry } from './types';

// Fuentes reutilizadas. Cada hecho de la cronología enlaza a, al menos, una.
export const SRC = {
  diarioHoySV: { name: 'El Diario de Hoy', url: 'https://www.eldiariodehoy.com/?p=99463' },
  apLaNacion: {
    name: 'AP / La Nación',
    url: 'https://www.lanacion.com.ar/usa/how-one-banks-collapse-is-upending-paraguay-trapping-savings-and-threatening-its-president-nid05112026/',
  },
  abcIps2024: {
    name: 'ABC Color',
    url: 'https://www.abc.com.py/nacionales/2024/10/23/ips-desmintio-a-santiago-pena-no-se-hacen-licitaciones-para-inversiones-de-bonos/',
  },
  abcFondeador: {
    name: 'ABC Color',
    url: 'https://www.abc.com.py/politica/2025/08/17/el-banco-de-exsocios-de-santi-pasa-a-liderar-manejo-de-fondos-publicos-en-usd/',
  },
  abcFilizzola: {
    name: 'ABC Color',
    url: 'https://www.abc.com.py/politica/2025/12/17/falta-de-solvencia-de-ueno-bank-genera-temor-de-perdida-de-inversiones-de-ips-dice-filizzola/',
  },
  iproup: {
    name: 'iProUP',
    url: 'https://www.iproup.com/finanzas/72922-que-paso-con-ueno-que-genero-renuncia-del-presidente-de-guay',
  },
  ultimaHora: { name: 'Última Hora', url: 'https://www.ultimahora.com/ueno' },
  hoyPy: { name: 'Diario HOY', url: 'https://www.hoy.com.py/nacionales/2026/11/03/te-explicamos-que-paso-con-ueno-bank' },
  malaEspina: {
    name: 'Mala Espina Check',
    url: 'https://www.malaespinacheck.cl/mundo/2026/11/06/como-la-caida-del-banco-ueno-en-paraguay-acabo-con-el-gobierno-del-presidente-santiago-pena/',
  },
  infobae: {
    name: 'Infobae',
    url: 'https://www.infobae.com/america/america-latina/2026/11/04/santiago-pena-anuncio-cambios-en-el-banco-central-y-una-ley-de-emergencia-para-devolver-los-ahorros-del-ueno-bank/',
  },
  france24: {
    name: 'France 24',
    url: 'https://www.france24.com/es/am%C3%A9rica-latina/20261105-esto-sabemos-del-esc%C3%A1ndalo-del-ueno-bank-la-crisis-que-tumb%C3%B3-al-presidente-paraguayo-santiago-pe%C3%B1a',
  },
  forbes: {
    name: 'Forbes Argentina',
    url: 'https://www.forbesargentina.com/today/santiago-pena-renuncio-presidencia-paraguay-medio-escandalo-ueno-bank-n101856',
  },
  cnn: {
    name: 'CNN en Español',
    url: 'https://cnnespanol.cnn.com/2026/11/06/latinoamerica/live-news/ultima-hora-juicio-politico-santiago-pena-paraguay-banco-ueno-orix',
  },
  elEconomista: {
    name: 'El Economista',
    url: 'https://eleconomista.com.ar/internacional/escandalo-ueno-bank-drastica-decision-gobierno-paraguay-tras-colapso-bancario-n99459',
  },
  elFinanciero: {
    name: 'El Financiero',
    url: 'https://www.elfinanciero.com.mx/mundo/2026/11/05/colapso-de-ueno-bank-crisis-bancaria-tumbo-a-santiago-pena-presidente-de-paraguay-y-aliado-de-trump/',
  },
} satisfies Record<string, Source>;

export const timeline: TimelineEntry[] = [
  {
    label: '2021',
    title: 'Origen de ueno bank',
    detail: 'El Grupo Vázquez adquiere Financiera El Comercio, entidad que da origen a ueno bank.',
    sources: [SRC.diarioHoySV],
  },
  {
    label: '2023',
    title: 'Carvallo al frente del BCP',
    detail:
      'Tras asumir la presidencia, Santiago Peña designa al frente del Banco Central a Carlos Carvallo, quien había presidido Financiera Ueno, antecesora del banco.',
    sources: [SRC.apLaNacion],
  },
  {
    label: 'Oct 2024',
    title: 'Preguntas por fondos del IPS',
    detail:
      'La prensa consulta a Peña por un posible conflicto de intereses en la inversión de fondos jubilatorios del IPS en bonos de ueno bank, vinculado a ueno Holding, de la que entonces era accionista.',
    sources: [SRC.abcIps2024],
  },
  {
    label: 'Mar 2025',
    title: 'Peña deja ueno Holding',
    detail: 'Santiago Peña se desvincula de ueno Holding, sociedad de la que era accionista.',
    sources: [SRC.iproup],
  },
  {
    label: '2025',
    title: 'Fondos públicos en ueno',
    detail:
      'Según ABC Color, desde 2023 ueno bank acumuló unos US$ 734 millones en fondos públicos, con el IPS como principal fondeador.',
    sources: [SRC.abcFilizzola, SRC.abcFondeador],
  },
  {
    label: 'Sep 2026',
    title: 'El Senado pide informes',
    detail:
      'El Senado solicita al Banco Central un informe sobre las operaciones de ueno bank. Legisladores oficialistas y opositores se pronuncian sobre posibles irregularidades.',
    sources: [SRC.ultimaHora],
  },
  {
    label: 'Oct 2026',
    title: 'Filtración de un informe',
    detail:
      'Según Diario HOY, se filtran documentos de la Superintendencia de Bancos que señalaban presuntos excesos en préstamos a empresas vinculadas al grupo.',
    sources: [SRC.hoyPy],
  },
  {
    label: '3 nov 2026',
    title: 'El BCP cierra ueno bank',
    detail:
      'A las 3:24 de la madrugada, el Banco Central anuncia el cierre de ueno bank por falta de solvencia. Unos 2,9 millones de clientes quedan sin acceso a sus depósitos.',
    sources: [SRC.malaEspina, SRC.elEconomista],
  },
  {
    label: '3–4 nov',
    title: 'Ocho directivos detenidos',
    detail:
      'La Policía detiene a ocho directivos con orden de captura, entre ellos Miguel Vázquez y Juan Manuel Gustale.',
    sources: [SRC.infobae],
  },
  {
    label: '4 nov',
    title: 'Imputación a 27 personas',
    detail:
      'La Fiscalía imputa a 27 directivos del grupo por conducta indebida en situaciones de crisis y lesión de confianza. iProUP informa operaciones crediticias por US$ 146 millones con tres empresas vinculadas.',
    sources: [SRC.malaEspina, SRC.iproup],
  },
  {
    label: '4 nov',
    title: 'Cambios en el BCP y ley de emergencia',
    detail:
      'Peña pide la renuncia de Carvallo y promulga una ley de emergencia para agilizar la devolución de depósitos a los clientes.',
    sources: [SRC.infobae, SRC.france24],
  },
  {
    label: '5 nov',
    title: 'Denuncia y anuncio de renuncia',
    detail:
      'Senadores opositores denuncian a Peña ante la Fiscalía de Delitos Económicos. Horacio Cartes le retira su respaldo y Peña anuncia su renuncia.',
    sources: [SRC.malaEspina, SRC.forbes],
  },
  {
    label: '6 nov',
    title: 'Destitución en el Senado',
    detail: 'Según CNN, el Senado aprueba la destitución de Peña por juicio político con 44 de 45 votos.',
    sources: [SRC.cnn],
  },
  {
    label: '6 nov',
    title: 'Arresto domiciliario',
    detail:
      'Por Resolución Fiscal N.º 7, Peña queda bajo arresto domiciliario y es citado a declarar el sábado 7 de noviembre a las 11:00.',
    sources: [SRC.hoyPy],
  },
];
