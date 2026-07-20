/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercicio } from '../types';
import BiomechanicsVisualizer from './BiomechanicsVisualizer';
import AnatomicalBody from './AnatomicalBody';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Wind, Award, ShieldAlert, Layers, Dumbbell, Tag, Calendar } from 'lucide-react';

interface ExerciseDetailProps {
  exercise: Exercicio;
  onBack: () => void;
}

export default function ExerciseDetail({ exercise, onBack }: ExerciseDetailProps) {
  // Format date for display
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'Recentemente';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn" id="exercise-detail-view">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-zinc-400 hover:text-[#39FF14] transition-colors duration-250 mb-8 group"
        id="back-to-lib-btn"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="text-sm font-semibold tracking-wider uppercase text-xs">Voltar para a Biblioteca</span>
      </button>

      {/* Main Title Banner */}
      <div className="mb-10" id="detail-banner">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-3.5 py-1 rounded-full bg-[#0F2A12] border border-[rgba(57,255,20,0.3)] text-[#39FF14] text-[10px] uppercase font-bold tracking-widest">
            {exercise.categoria}
          </span>
          <span className="px-3.5 py-1 rounded-full bg-[#0D0D0D] border border-zinc-800 text-zinc-300 text-[10px] uppercase font-mono tracking-wider">
            {exercise.grupoMuscular}
          </span>
          <span className={`px-3.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
            exercise.nivel === 'Iniciante' 
              ? 'bg-[#0F2A12] text-[#39FF14] border-[rgba(57,255,20,0.25)]' 
              : exercise.nivel === 'Intermediário' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            Nível {exercise.nivel}
          </span>
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl text-white font-extrabold leading-tight" id="detail-title">
          {exercise.nome}
        </h1>
        {exercise.subGrupo && (
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1.5" id="detail-subgroup">
            Subgrupo: {exercise.subGrupo}
          </p>
        )}
      </div>

      {/* Grid Layout: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" id="detail-grid">
        {/* Left Column: Visualizers (Biomechanics Loop & Anatomical Muscle Highlight) */}
        <div className="lg:col-span-5 flex flex-col space-y-8" id="detail-visual-col">
          {/* Biomechanical Simulation loop */}
          <BiomechanicsVisualizer 
            exerciseId={exercise.id}
            exerciseName={exercise.nome}
            gifUrl={exercise.gifUrl || exercise.gif}
            videoUrl={exercise.video}
            muscleGroup={exercise.grupoMuscular}
          />

          {/* Interactive Anatomical Body Map highlighting the active muscles */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6" id="anatomical-card">
            <h3 className="font-sans text-base text-white font-bold mb-4 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14]"></span>
              <span>Ativação Escapular & Muscular</span>
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-6">
              Os músculos coloridos em verde neon no mapa abaixo representam os grupos de maior recrutamento mecânico (motores primários e secundários) neste movimento.
            </p>
            <AnatomicalBody 
              activeMuscles={exercise.musculos}
              interactive={false}
            />
          </div>
        </div>

        {/* Right Column: Detailed Biomechanical Breakdown & Instructions */}
        <div className="lg:col-span-7 flex flex-col space-y-8" id="detail-content-col">
          {/* Description & Objective */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 space-y-4" id="detail-overview-card">
            <p className="text-zinc-300 text-sm leading-relaxed italic font-sans">
              &ldquo;{exercise.descricao}&rdquo;
            </p>
            <div className="border-t border-zinc-900 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#39FF14] mb-2 flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#39FF14]" />
                <span>Objetivo Funcional</span>
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {exercise.objetivo}
              </p>
            </div>
          </div>

          {/* How to Execute (Step-by-step) */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8" id="detail-execution-card">
            <h3 className="font-sans text-lg text-white font-bold mb-6 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />
              <span>Instruções de Execução Perfeita</span>
            </h3>
            <ol className="space-y-4" id="step-by-step-list">
              {exercise.execucao.map((step, idx) => (
                <li key={idx} className="flex space-x-4" id={`step-item-${idx}`}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0F2A12] border border-[rgba(57,255,20,0.3)] text-[#39FF14] flex items-center justify-center font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Breathing Cues & Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="detail-cues-grid">
            {/* Breathing */}
            <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 flex flex-col h-full" id="detail-breathing-card">
              <h4 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-3 flex items-center space-x-2">
                <Wind className="w-4.5 h-4.5" />
                <span>Cadência & Respiração</span>
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed flex-grow">
                {exercise.respiracao}
              </p>
            </div>

            {/* Tips / Dicas */}
            <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 flex flex-col h-full" id="detail-tips-card">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#39FF14] mb-3 flex items-center space-x-2">
                <Lightbulb className="w-4.5 h-4.5" />
                <span>Dicas do Treinador</span>
              </h4>
              <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed flex-grow list-disc list-inside">
                {exercise.dicas.map((tip, idx) => (
                   <li key={idx} className="text-zinc-300 pl-1">{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Common Errors */}
          <div className="bg-[#111111] border border-rose-950/40 rounded-[24px] p-6 sm:p-8" id="detail-errors-card">
            <h3 className="font-sans text-lg text-rose-400 font-bold mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Erros Comuns para Evitar</span>
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              Estes erros reduzem a eficiência do estímulo muscular e podem sobrecarregar suas articulações desnecessariamente.
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-400 leading-relaxed">
              {exercise.erros.map((error, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold mr-1.5">•</span>
                  <span className="text-zinc-300">{error}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Muscles Worked & Equipment Specs */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8" id="detail-specs-card">
            {/* Muscles recruitment list */}
            <div id="specs-muscles">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#39FF14] mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#39FF14]" />
                <span>Músculos Recrutados</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.musculos.map((muscle, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#0D0D0D] text-zinc-300 text-[10px] font-mono border border-[rgba(57,255,20,0.15)]">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Equipment list */}
            <div id="specs-equipment">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#39FF14] mb-3 flex items-center space-x-2">
                <Dumbbell className="w-4 h-4 text-[#39FF14]" />
                <span>Equipamentos</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.equipamentos.length > 0 ? (
                  exercise.equipamentos.map((equip, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#0D0D0D] text-zinc-300 text-[10px] font-mono border border-[rgba(57,255,20,0.15)]">
                      {equip}
                    </span>
                  ))
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-[#0D0D0D] text-zinc-300 text-[10px] font-mono border border-[rgba(57,255,20,0.15)]">
                    Peso Corporal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Benefits & Contraindications */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 space-y-6" id="detail-benefits-card">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                Benefícios do Movimento
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {exercise.beneficios}
              </p>
            </div>

            {exercise.contraindicacoes && (
              <div className="border-t border-zinc-900 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Restrições & Adaptações</span>
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {exercise.contraindicacoes}
                </p>
              </div>
            )}
          </div>

          {/* Variations & Tags */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 space-y-6" id="detail-extra-card">
            {/* Variations */}
            {exercise.variacoes && exercise.variacoes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#39FF14] mb-3">
                  Variações Sugeridas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.variacoes.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#0D0D0D] text-zinc-300 text-xs border border-[rgba(57,255,20,0.15)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags list */}
            <div className="border-t border-zinc-900 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-zinc-600" />
                {exercise.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-zinc-500 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t border-zinc-900/50 pt-4 flex items-center space-x-1 text-[10px] text-zinc-600 font-mono">
              <Calendar className="w-3 h-3" />
              <span>Atualizado em {formatDate(exercise.atualizadoEm)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
