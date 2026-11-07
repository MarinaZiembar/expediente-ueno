export const GAP = 13;

export const STATIONS = [
  { id: 'entrada', code: '00', title: 'Expediente', hint: 'Qué es y cómo se arma' },
  { id: 'cronologia', code: '01', title: 'Cronología', hint: 'Hechos con fecha y fuente' },
  { id: 'vinculos', code: '02', title: 'Red de vínculos', hint: 'Pasá el mouse por una ficha' },
  { id: 'prensa', code: '03', title: 'Archivo de prensa', hint: 'Se actualiza cada hora' },
  { id: 'redes', code: '04', title: 'Redes sociales', hint: 'Posteos públicos seleccionados' },
  { id: 'empleados', code: '05', title: 'Lo que sabemos los empleados', hint: 'Estado de situación' },
] as const;

export type StationId = (typeof STATIONS)[number]['id'];
