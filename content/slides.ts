import type { ExplainSlide, InfoStat } from './types';
import { SRC } from './timeline';

/**
 * Diapositivas explicativas, en lenguaje simple.
 * Después de estas, la presentación sigue con la cronología (content/timeline.ts).
 */
export const slides: ExplainSlide[] = [
  {
    kicker: '01 · El banco',
    title: ['¿Qué es', 'ue-no?'],
    body: [
      'ueno es un **banco digital** paraguayo. Nació en 2021, cuando el Grupo Vázquez compró Financiera El Comercio.',
      'Creció muy rápido: llegó a tener unos **2,9 millones de clientes**.',
    ],
    stat: { value: 2.9, decimals: 1, suffix: ' M', label: 'clientes' },
    sources: [SRC.diarioHoySV, SRC.elEconomista],
  },
  {
    kicker: '02 · El cierre',
    title: ['¿Qué', 'pa-só?'],
    body: [
      'El martes 3 de noviembre de 2026, a las 3:24 de la madrugada, el **Banco Central del Paraguay** anunció el cierre de ueno.',
      'El motivo que dio: **falta de solvencia**.',
    ],
    stat: { text: '03:24', label: 'hora del anuncio' },
    terms: [{ term: 'Insolvencia', def: 'Cuando una empresa no tiene con qué responder por todo lo que debe.' }],
    sources: [SRC.malaEspina],
  },
  {
    kicker: '03 · Los ahorros',
    title: ['¿Y la', 'pla-ta?'],
    body: [
      'Desde el cierre, los clientes **no pueden usar el dinero** que tenían depositado.',
      'El Congreso aprobó una **ley de emergencia**, promulgada el 4 de noviembre, para acelerar la devolución de los depósitos.',
      'Según la prensa, los depósitos hasta cierto monto están garantizados. Por encima de ese monto, la recuperación depende de los procedimientos que fija la ley.',
    ],
    stat: { value: 24, suffix: ' h', label: 'plazo mínimo de entrega que fija la ley de emergencia' },
    sources: [SRC.france24, SRC.forbes],
  },
  {
    kicker: '04 · El vínculo político',
    title: ['¿Por qué', 'Pe-ña?'],
    body: [
      'Santiago Peña, entonces presidente, fue **accionista de ueno Holding**, la sociedad matriz del banco, hasta marzo de 2025.',
      'En 2023 designó al frente del Banco Central, el organismo que controla a los bancos, a **Carlos Carvallo**, que había presidido Financiera Ueno.',
      'Según ABC Color, desde 2023 ueno recibió unos **US$ 734 millones en fondos públicos**, con el IPS (el seguro social) como principal fondeador.',
    ],
    stat: { prefix: 'US$ ', value: 734, suffix: ' M', label: 'en fondos públicos, según ABC Color' },
    sources: [SRC.iproup, SRC.apLaNacion, SRC.abcFilizzola],
  },
  {
    kicker: '05 · La Justicia',
    title: ['¿Qué hi-zo la', 'Jus-ti-cia?'],
    body: [
      'La Policía detuvo a **ocho directivos**, entre ellos Miguel Vázquez, presidente del Grupo Vázquez.',
      'La Fiscalía **imputó a 27 personas** del grupo. Investiga créditos por US$ 146 millones otorgados a tres empresas vinculadas.',
      'También se dispusieron **embargos por US$ 70 millones**.',
    ],
    stat: { value: 27, label: 'personas imputadas' },
    terms: [{ term: 'Imputado', def: 'La Fiscalía lo acusa formalmente y lo investiga. No es una condena.' }],
    sources: [SRC.infobae, SRC.malaEspina, SRC.iproup, SRC.elEconomista],
  },
  {
    kicker: '06 · El Gobierno',
    title: ['¿Qué pa-só', 'con Pe-ña?'],
    body: [
      'El 5 de noviembre, después de que Horacio Cartes le retirara su apoyo, Peña **anunció su renuncia**.',
      'Según CNN, el Senado aprobó su **destitución por juicio político** con 44 de 45 votos.',
      'El 6 de noviembre, la Fiscalía dispuso su **arresto domiciliario** y lo citó a declarar.',
    ],
    stat: { value: 44, suffix: '/45', label: 'votos en el Senado, según CNN' },
    terms: [
      { term: 'Juicio político', def: 'Proceso del Congreso para destituir a un presidente por mal desempeño.' },
      { term: 'Arresto domiciliario', def: 'La persona queda detenida en su casa mientras avanza la investigación.' },
    ],
    sources: [SRC.forbes, SRC.cnn, SRC.hoyPy],
  },
];

/** Cifras de la infografía. Cada una con su fuente. */
export const infoStats: InfoStat[] = [
  { value: 2.9, decimals: 1, suffix: ' M', label: 'clientes afectados por el cierre', source: SRC.elEconomista, size: 'xl', tone: 'lime' },
  { text: '03:24', label: 'hora del anuncio del cierre, 3 de noviembre de 2026', source: SRC.malaEspina, size: 'm', tone: 'outline' },
  { value: 8, label: 'directivos detenidos', source: SRC.infobae, size: 's' },
  { prefix: 'US$ ', value: 734, suffix: ' M', label: 'en fondos públicos colocados en ueno desde 2023, según ABC Color', source: SRC.abcFilizzola, size: 'l' },
  { value: 27, label: 'personas imputadas', source: SRC.malaEspina, size: 's', tone: 'lime' },
  { prefix: 'US$ ', value: 146, suffix: ' M', label: 'en créditos a tres empresas vinculadas, bajo investigación', source: SRC.iproup, size: 'm', tone: 'ink' },
  { prefix: 'US$ ', value: 70, suffix: ' M', label: 'en embargos dispuestos', source: SRC.elEconomista, size: 'm', tone: 'outline' },
  { value: 44, suffix: '/45', label: 'votos del Senado por la destitución, según CNN', source: SRC.cnn, size: 'm', tone: 'lime' },
];
