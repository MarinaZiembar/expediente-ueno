import type { GraphEdge, GraphNode } from './types';
import { SRC } from './timeline';

// Estados tal como los informan las fuentes. Actualizalos a mano cuando cambien.
export const nodes: GraphNode[] = [
  { id: 'cartes', name: 'Horacio Cartes', kind: 'persona', status: 'Expresidente, líder del Partido Colorado', pos: [-3.7, 3.05] },
  { id: 'senado', name: 'Congreso', kind: 'institucion', status: 'Juicio político', pos: [-1.85, 3.05] },
  { id: 'pena', name: 'Santiago Peña', kind: 'persona', status: 'Expresidente · arresto domiciliario (6/11)', pos: [0, 3.05] },
  { id: 'fiscalia', name: 'Fiscalía', kind: 'institucion', status: 'Causa penal abierta', pos: [1.85, 3.05] },
  { id: 'ahorristas', name: 'Ahorristas', kind: 'colectivo', status: '~2,9 millones de clientes', pos: [3.7, 3.05] },

  { id: 'ips', name: 'IPS', kind: 'institucion', status: 'Seguro social', pos: [-3.7, 1.95] },
  { id: 'holding', name: 'ueno Holding', kind: 'empresa', pos: [-1.3, 1.95] },
  { id: 'carvallo', name: 'Carlos Carvallo', kind: 'persona', status: 'Renunció al BCP (nov 2026)', pos: [1.3, 1.95] },
  { id: 'bcp', name: 'Banco Central (BCP)', kind: 'institucion', status: 'Regulador', pos: [3.7, 1.95] },

  { id: 'mvazquez', name: 'Miguel Vázquez', kind: 'persona', status: 'Detenido (nov 2026)', pos: [-3.7, 0.85] },
  { id: 'gv', name: 'Grupo Vázquez', kind: 'empresa', status: 'Accionista mayoritario', pos: [-1.3, 0.85] },
  { id: 'ueno', name: 'ueno bank', kind: 'empresa', status: 'Cerrado por el BCP (3/11)', pos: [1.3, 0.85] },
  { id: 'gustale', name: 'Juan Manuel Gustale', kind: 'persona', status: 'Detenido (nov 2026)', pos: [3.7, 0.85] },
];

export const edges: GraphEdge[] = [
  { from: 'pena', to: 'holding', label: 'Accionista hasta marzo de 2025', source: SRC.iproup },
  { from: 'holding', to: 'ueno', label: 'Sociedad matriz del banco', source: SRC.elFinanciero },
  { from: 'gv', to: 'ueno', label: 'Accionista mayoritario', source: SRC.elFinanciero },
  { from: 'mvazquez', to: 'gv', label: 'Presidente del Grupo Vázquez', source: SRC.elFinanciero },
  { from: 'gustale', to: 'ueno', label: 'Presidente de la entidad', source: SRC.infobae },
  { from: 'carvallo', to: 'ueno', label: 'Presidió Financiera Ueno, antecesora del banco', source: SRC.apLaNacion },
  { from: 'pena', to: 'carvallo', label: 'Lo designó al frente del BCP', source: SRC.apLaNacion },
  { from: 'carvallo', to: 'bcp', label: 'Presidente 2023–2026; renunció a pedido de Peña', source: SRC.elEconomista },
  { from: 'bcp', to: 'ueno', label: 'Dispuso su cierre por falta de solvencia', source: SRC.malaEspina },
  { from: 'ips', to: 'ueno', label: 'Principal fondeador, según ABC Color', source: SRC.abcFondeador },
  { from: 'fiscalia', to: 'ueno', label: 'Imputó a 27 directivos del grupo', source: SRC.malaEspina },
  { from: 'fiscalia', to: 'mvazquez', label: 'Orden de detención', source: SRC.elFinanciero },
  { from: 'fiscalia', to: 'pena', label: 'Arresto domiciliario y citación a declarar', source: SRC.hoyPy },
  { from: 'senado', to: 'pena', label: 'Destitución por juicio político (44 de 45)', source: SRC.cnn },
  { from: 'cartes', to: 'pena', label: 'Le retiró su respaldo', source: SRC.forbes },
  { from: 'ahorristas', to: 'ueno', label: 'Sin acceso a sus depósitos tras el cierre', source: SRC.elFinanciero },
];
