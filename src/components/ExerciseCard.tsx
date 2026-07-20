/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercicio } from '../types';
import { Dumbbell, ArrowRight, Gauge, Layers } from 'lucide-react';

interface ExerciseCardProps {
  key?: string | number;
  exercise: Exercicio;
  onSelect: (exercise: Exercicio) => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  // Level badge styling helper
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-[#0F2A12] text-[#39FF14] border-[rgba(57,255,20,0.25)]';
      case 'Intermediário':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Avançado':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-900 text-zinc-400 border-zinc-800';
    }
  };

  return (
    <div 
      className="group bg-[#111111] hover:bg-[#161616] border border-[rgba(57,255,20,0.15)] hover:border-[#39FF14] rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.45),0_0_30px_rgba(57,255,20,0.08)]"
      id={`exercise-card-${exercise.id}`}
    >
      {/* Decorative Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#39FF14]/15 to-transparent group-hover:via-[#39FF14]/70 transition-all duration-300"></div>

      {/* Card Content body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Header Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#39FF14]">
              {exercise.categoria}
            </span>
            <span className="text-zinc-700 font-bold text-xs">•</span>
            <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
              {exercise.grupoMuscular}
            </span>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getLevelBadge(exercise.nivel)}`}>
            {exercise.nivel}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-sans text-lg text-white font-bold group-hover:text-[#39FF14] transition-colors duration-200 mb-2 leading-snug">
          {exercise.nome}
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed mb-6 line-clamp-3">
          {exercise.descricao}
        </p>

        {/* Biomechanical Thumbnail Preview (Simple stylized muscle group highlight) */}
        <div className="bg-[#0D0D0D] rounded-[16px] border border-[rgba(57,255,20,0.15)] p-4 mb-6 flex items-center justify-between">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Foco Principal</span>
            <span className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#39FF14]" />
              <span>{exercise.subGrupo || exercise.grupoMuscular}</span>
            </span>
          </div>
          <div className="flex flex-col space-y-1.5 text-right">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Equipamento</span>
            <span className="text-xs font-semibold text-zinc-300 flex items-center justify-end space-x-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-[#39FF14]" />
              <span className="truncate max-w-[100px]">{exercise.equipamentos[0] || 'Peso Corporal'}</span>
            </span>
          </div>
        </div>

        {/* Action Button at Bottom */}
        <button
          onClick={() => onSelect(exercise)}
          className="mt-auto w-full py-3 rounded-[16px] bg-[#0D0D0D] text-[#D1D5DB] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 border border-[rgba(57,255,20,0.15)] group-hover:bg-[#39FF14] group-hover:text-[#050505] group-hover:border-[#39FF14] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          id={`view-btn-${exercise.id}`}
        >
          <span>Visualizar Execução</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
