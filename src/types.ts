/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoriaType = 'Musculação' | 'Alongamentos' | 'Cardio' | 'Funcional' | 'Mobilidade' | 'Reabilitação';

export type GrupoMuscularType = 
  | 'Peito' 
  | 'Costas' 
  | 'Ombros' 
  | 'Trapézio' 
  | 'Bíceps' 
  | 'Tríceps' 
  | 'Antebraço' 
  | 'Abdômen' 
  | 'Lombar' 
  | 'Quadríceps' 
  | 'Posterior' 
  | 'Glúteos' 
  | 'Adutores' 
  | 'Abdutores' 
  | 'Panturrilhas';

export type NivelType = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Exercicio {
  id: string;
  nome: string;
  slug: string;
  categoria: CategoriaType;
  grupoMuscular: GrupoMuscularType;
  subGrupo?: string;
  nivel: NivelType;
  equipamentos: string[]; // e.g. ["Halteres", "Banco"]
  musculos: string[]; // List of specific muscles worked, e.g. ["Deltoide Anterior", "Deltoide Lateral"]
  descricao: string;
  objetivo: string;
  execucao: string[]; // Step-by-step instructions
  respiracao: string; // Breathing instructions
  dicas: string[]; // 3 to 8 tips
  erros: string[]; // 3 to 8 common errors
  beneficios: string;
  contraindicacoes?: string;
  variacoes?: string[];
  gif: string; // URL or identifier for visual movement
  video?: string; // Optional YouTube/Vimeo URL or local video path
  tags: string[];
  exerciseDbId?: string;
  gifUrl?: string;
  exerciseDbName?: string;
  exerciseDbEquipment?: string;
  exerciseDbTarget?: string;
  exerciseDbSecondaryMuscles?: string[];
  lastSync?: string;
  ativo?: boolean; // True by default, can be deactivated
  criadoEm: string;
  atualizadoEm: string;
}

export interface FilterState {
  search: string;
  categoria: CategoriaType | 'Todos';
  grupoMuscular: GrupoMuscularType | 'Todos';
  nivel: NivelType | 'Todos';
  equipamento: string | 'Todos';
  objetivo: string;
}
