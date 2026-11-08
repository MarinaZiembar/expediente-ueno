/** Términos, condiciones y aviso legal. Editá este archivo para cambiar el texto de la modal. */

export const LEGAL_UPDATED = '2026-11-07';

export type LegalSection = { title: string; body: string[] };

export const LEGAL: LegalSection[] = [
  {
    title: 'Qué es este sitio',
    body: [
      'El Caso ueno (en adelante, “el sitio”) es un proyecto personal, independiente y sin fines de lucro que reúne, ordena y enlaza información publicada por terceros sobre el caso ueno. No es un medio de comunicación, no realiza investigaciones propias ni emite opiniones, juicios o conclusiones sobre los hechos ni sobre las personas mencionadas.',
      'El sitio no tiene vínculo con ueno, itti, las demás empresas del grupo, el Gobierno de la República del Paraguay, el Banco Central del Paraguay ni con ninguna otra empresa, institución o partido político, y no representa su posición.',
    ],
  },
  {
    title: 'Origen de la información',
    body: [
      'Todo el contenido proviene de fuentes de terceros —medios de comunicación, comunicados oficiales, documentos públicos y publicaciones en redes sociales— que se citan y enlazan en cada caso. Los titulares y extractos se reproducen con fines exclusivamente informativos y de cita, conforme al derecho de información.',
      'La sección de noticias se actualiza de forma automática a partir de buscadores de noticias públicos. Esa selección se hace por coincidencia de palabras clave, sin revisión humana previa, por lo que puede incluir notas desactualizadas, duplicadas o no relacionadas.',
    ],
  },
  {
    title: 'Limitación de responsabilidad',
    body: [
      'La autora del sitio no es autora de la información que se cita y no garantiza su exactitud, integridad, vigencia ni veracidad. La responsabilidad por cada contenido corresponde a la fuente que lo publicó originalmente. Ante cualquier diferencia, prevalece siempre la versión de la fuente original.',
      'El sitio se ofrece “tal como está”. La autora no se hace responsable por errores, omisiones, interpretaciones, decisiones o daños de cualquier tipo que puedan derivarse del uso de la información aquí reunida, ni por el contenido, la disponibilidad o las políticas de los sitios externos enlazados.',
      'Nada de lo publicado constituye asesoramiento legal, financiero, laboral ni de ningún otro tipo. Si tenés depósitos, créditos, reclamos laborales u otros intereses afectados, consultá a un profesional y a los canales oficiales correspondientes.',
    ],
  },
  {
    title: 'Presunción de inocencia',
    body: [
      'Todas las personas mencionadas gozan de la presunción de inocencia mientras no exista una sentencia firme que determine lo contrario. Las imputaciones, investigaciones y estados procesales se consignan tal como los informan las fuentes a la fecha indicada y pueden haber cambiado desde entonces. La mención de una persona o empresa no implica afirmar que haya cometido delito alguno.',
    ],
  },
  {
    title: 'Contenido aportado por usuarios',
    body: [
      'Las secciones “Testimonios” y “Entre todos” incluyen contenido enviado por personas usuarias. Quien envía un testimonio o una noticia es la única persona responsable de lo que envía y declara que es verídico, que tiene derecho a compartirlo y que no vulnera derechos de terceros.',
      'Todo aporte se revisa antes de publicarse. La autora puede editarlo para quitar datos personales o lenguaje ofensivo, rechazarlo o retirarlo en cualquier momento y sin necesidad de dar explicaciones. La publicación de un aporte no implica que la autora lo avale, verifique ni comparta.',
      'No se aceptan insultos, amenazas, acusaciones sin fuente, datos personales propios o de terceros, ni contenido discriminatorio, ilegal o publicitario.',
    ],
  },
  {
    title: 'Privacidad',
    body: [
      'El sitio no pide nombre, correo electrónico ni registro. Los testimonios se publican sin el nombre de quien los envía. Lo que se envía por los formularios se guarda en un repositorio privado al que solo accede la autora para moderarlo.',
      'Para evitar abusos, la dirección IP se usa de forma temporal para limitar la cantidad de envíos y no se almacena junto con el aporte. El sitio usa Vercel Web Analytics, que mide visitas de forma agregada y sin cookies. Si querés que se retire un aporte tuyo, podés pedirlo por el contacto indicado más abajo.',
    ],
  },
  {
    title: 'Marcas y derechos de terceros',
    body: [
      'Los nombres, marcas, logotipos, artículos, imágenes y videos mencionados o enlazados pertenecen a sus respectivos titulares. Los videos se muestran mediante los reproductores oficiales de cada plataforma, sin copiarlos; al reproducirlos rigen las políticas de privacidad de esa plataforma. Su inclusión es solo informativa y no implica afiliación ni respaldo.',
    ],
  },
  {
    title: 'Correcciones y pedidos de retiro',
    body: [
      'Si encontrás un error, un enlace caído, información desactualizada o un contenido que te afecta, escribile a la autora por LinkedIn indicando qué contenido es y por qué. Cada pedido se revisa y, si corresponde, el contenido se corrige o se retira a la brevedad.',
    ],
  },
  {
    title: 'Cambios',
    body: [
      'Estos términos pueden actualizarse en cualquier momento. La versión vigente es siempre la publicada en esta ventana, con su fecha de actualización. Usar el sitio implica aceptarlos.',
    ],
  },
];
