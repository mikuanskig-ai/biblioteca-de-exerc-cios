/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

interface AnatomicalBodyProps {
  activeMuscles: string[]; // Músculos ativos no exercício selecionado, ex: ["Glúteo Máximo", "Quadríceps"]
  onMuscleClick?: (muscleGroup: string) => void; // Para filtrar os exercícios ao clicar na anatomia
  interactive?: boolean;
}

export default function AnatomicalBody({ activeMuscles = [], onMuscleClick, interactive = true }: AnatomicalBodyProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  // Mapeamento simplificado de músculos individuais da nossa API para grupos de destaque anatômico
  const isHighlighted = (group: string) => {
    // Normalizar texto para correspondência resiliente
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return activeMuscles.some(m => {
      const nm = normalize(m);
      const ng = normalize(group);
      
      // Checar correspondências exatas ou parciais comuns em Biomecânica
      if (ng === 'peito' && (nm.includes('peit') || nm.includes('pectoral'))) return true;
      if (ng === 'costas' && (nm.includes('costas') || nm.includes('dorsal') || nm.includes('latissimo') || nm.includes('romboide') || nm.includes('redondo'))) return true;
      if (ng === 'ombros' && (nm.includes('ombro') || nm.includes('deltoid'))) return true;
      if (ng === 'trapezio' && nm.includes('trapezi')) return true;
      if (ng === 'biceps' && nm.includes('biceps')) return true;
      if (ng === 'triceps' && nm.includes('triceps')) return true;
      if (ng === 'antebreco' && nm.includes('antebra')) return true;
      if (ng === 'abdomen' && (nm.includes('abdom') || nm.includes('core') || nm.includes('obliquo') || nm.includes('reto abdominal') || nm.includes('transverso'))) return true;
      if (ng === 'lombar' && (nm.includes('lombar') || nm.includes('erector') || nm.includes('ereto') || nm.includes('espinha'))) return true;
      if (ng === 'quadriceps' && (nm.includes('quadriceps') || nm.includes('coxa') || nm.includes('fret'))) return true;
      if (ng === 'posterior' && (nm.includes('posterior') || nm.includes('isquio') || nm.includes('femoral') || nm.includes('traseira'))) return true;
      if (ng === 'gluteos' && nm.includes('gluteo')) return true;
      if (ng === 'panturrilhas' && (nm.includes('panturrilha') || nm.includes('gastrocn') || nm.includes('soleo'))) return true;
      if (ng === 'adutores' && nm.includes('adutor')) return true;
      if (ng === 'abdutores' && nm.includes('abdutor')) return true;
      
      return nm.includes(ng) || ng.includes(nm);
    });
  };

  const getStyle = (group: string) => {
    const active = isHighlighted(group);
    const hovered = hoveredGroup === group;
    
    if (active) {
      return {
        fill: '#39FF14', // Neon Green highlight
        fillOpacity: 0.95,
        stroke: '#FFFFFF',
        strokeWidth: 1.5,
        filter: 'drop-shadow(0px 0px 8px rgba(57, 255, 20, 0.75))',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }
    
    return {
      fill: hovered ? '#161616' : '#111111',
      fillOpacity: 0.85,
      stroke: hovered ? '#39FF14' : 'rgba(57, 255, 20, 0.15)',
      strokeWidth: hovered ? 1.5 : 1,
      cursor: interactive ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  };

  const handleGroupAction = (group: string) => {
    if (interactive && onMuscleClick) {
      // Retornar o nome formatado apropriado para os filtros de Bia Tisatto
      const nameMap: { [key: string]: string } = {
        peito: 'Peito',
        costas: 'Costas',
        ombros: 'Ombros',
        trapezio: 'Trapézio',
        biceps: 'Bíceps',
        triceps: 'Tríceps',
        antebreco: 'Antebraço',
        abdomen: 'Abdômen',
        lombar: 'Lombar',
        quadriceps: 'Quadríceps',
        posterior: 'Posterior',
        gluteos: 'Glúteos',
        adutores: 'Adutores',
        abdutores: 'Abdutores',
        panturrilhas: 'Panturrilhas'
      };
      onMuscleClick(nameMap[group] || group);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4 px-2 bg-[#0D0D0D] rounded-[24px] border border-[rgba(57,255,20,0.15)] backdrop-blur-md" id="anatomical-body-container">
      {/* Front View */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] tracking-widest text-[#39FF14] uppercase mb-3 font-mono font-bold">Vista Anterior (Frente)</span>
        <svg className="w-40 sm:w-44 h-80 select-none" viewBox="0 0 200 400" id="anterior-svg">
          {/* Base Head and Skeleton Guideline (Behind) */}
          <circle cx="100" cy="40" r="15" className="fill-zinc-900 stroke-zinc-800" strokeWidth="1" />
          <line x1="100" y1="55" x2="100" y2="170" className="stroke-zinc-800" strokeWidth="2" />
          {/* Neck */}
          <rect x="96" y="55" width="8" height="15" className="fill-zinc-800" />
          
          {/* OMBROS */}
          <path 
            d="M 68 70 Q 55 75 58 92 Q 68 95 76 80 Z" 
            style={getStyle('ombros')}
            onMouseEnter={() => setHoveredGroup('ombros')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('ombros')}
          />
          <path 
            d="M 132 70 Q 145 75 142 92 Q 132 95 124 80 Z" 
            style={getStyle('ombros')}
            onMouseEnter={() => setHoveredGroup('ombros')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('ombros')}
          />

          {/* PEITO */}
          <path 
            d="M 72 82 C 85 82 98 84 100 95 C 100 115 88 120 72 118 C 68 100 68 90 72 82 Z" 
            style={getStyle('peito')}
            onMouseEnter={() => setHoveredGroup('peito')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('peito')}
          />
          <path 
            d="M 128 82 C 115 82 102 84 100 95 C 100 115 112 120 128 118 C 132 100 132 90 128 82 Z" 
            style={getStyle('peito')}
            onMouseEnter={() => setHoveredGroup('peito')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('peito')}
          />

          {/* ABDÔMEN */}
          <path 
            d="M 76 122 Q 100 120 124 122 Q 120 170 116 182 Q 100 185 84 182 Q 80 170 76 122 Z" 
            style={getStyle('abdomen')}
            onMouseEnter={() => setHoveredGroup('abdomen')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('abdomen')}
          />

          {/* BÍCEPS */}
          <path 
            d="M 54 94 Q 48 110 50 128 Q 58 128 60 112 Q 62 100 54 94 Z" 
            style={getStyle('biceps')}
            onMouseEnter={() => setHoveredGroup('biceps')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('biceps')}
          />
          <path 
            d="M 146 94 Q 152 110 150 128 Q 142 128 140 112 Q 138 100 146 94 Z" 
            style={getStyle('biceps')}
            onMouseEnter={() => setHoveredGroup('biceps')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('biceps')}
          />

          {/* ANTEBRAÇO */}
          <path 
            d="M 48 132 Q 40 155 45 180 Q 52 180 54 155 Z" 
            style={getStyle('antebreco')}
            onMouseEnter={() => setHoveredGroup('antebreco')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('antebreco')}
          />
          <path 
            d="M 152 132 Q 160 155 155 180 Q 148 180 146 155 Z" 
            style={getStyle('antebreco')}
            onMouseEnter={() => setHoveredGroup('antebreco')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('antebreco')}
          />

          {/* QUADRÍCEPS */}
          <path 
            d="M 72 196 Q 84 210 82 265 Q 66 265 62 215 Q 64 198 72 196 Z" 
            style={getStyle('quadriceps')}
            onMouseEnter={() => setHoveredGroup('quadriceps')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('quadriceps')}
          />
          <path 
            d="M 128 196 Q 116 210 118 265 Q 134 265 138 215 Q 136 198 128 196 Z" 
            style={getStyle('quadriceps')}
            onMouseEnter={() => setHoveredGroup('quadriceps')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('quadriceps')}
          />

          {/* ADUTORES */}
          <path 
            d="M 85 200 Q 94 212 90 255 Q 84 255 83 230 Z" 
            style={getStyle('adutores')}
            onMouseEnter={() => setHoveredGroup('adutores')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('adutores')}
          />
          <path 
            d="M 115 200 Q 106 212 110 255 Q 116 255 117 230 Z" 
            style={getStyle('adutores')}
            onMouseEnter={() => setHoveredGroup('adutores')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('adutores')}
          />

          {/* ABDUTORES */}
          <path 
            d="M 58 195 Q 54 215 58 245 Q 64 245 66 195 Z" 
            style={getStyle('abdutores')}
            onMouseEnter={() => setHoveredGroup('abdutores')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('abdutores')}
          />
          <path 
            d="M 142 195 Q 146 215 142 245 Q 136 245 134 195 Z" 
            style={getStyle('abdutores')}
            onMouseEnter={() => setHoveredGroup('abdutores')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('abdutores')}
          />

          {/* Hands & Feet (Decorators) */}
          <circle cx="44" cy="188" r="5" className="fill-zinc-800" />
          <circle cx="156" cy="188" r="5" className="fill-zinc-800" />
          <path d="M 60 355 Q 55 365 48 365 L 68 365 Z" className="fill-zinc-800" />
          <path d="M 140 355 Q 145 365 152 365 L 132 365 Z" className="fill-zinc-800" />
        </svg>
      </div>

      {/* Back View */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] tracking-widest text-[#39FF14] uppercase mb-3 font-mono font-bold">Vista Posterior (Costas)</span>
        <svg className="w-40 sm:w-44 h-80 select-none" viewBox="0 0 200 400" id="posterior-svg">
          {/* Base Head */}
          <circle cx="100" cy="40" r="15" className="fill-zinc-900 stroke-zinc-800" strokeWidth="1" />
          
          {/* TRAPÉZIO */}
          <path 
            d="M 80 58 Q 100 50 120 58 Q 130 75 100 85 Q 70 75 80 58 Z" 
            style={getStyle('trapezio')}
            onMouseEnter={() => setHoveredGroup('trapezio')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('trapezio')}
          />

          {/* OMBROS (POSTERIOR DELTOIDE) */}
          <path 
            d="M 66 72 Q 54 78 57 91 Q 65 91 71 80 Z" 
            style={getStyle('ombros')}
            onMouseEnter={() => setHoveredGroup('ombros')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('ombros')}
          />
          <path 
            d="M 134 72 Q 146 78 143 91 Q 135 91 129 80 Z" 
            style={getStyle('ombros')}
            onMouseEnter={() => setHoveredGroup('ombros')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('ombros')}
          />

          {/* TRÍCEPS */}
          <path 
            d="M 52 92 Q 46 110 48 126 Q 56 124 57 110 Z" 
            style={getStyle('triceps')}
            onMouseEnter={() => setHoveredGroup('triceps')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('triceps')}
          />
          <path 
            d="M 148 92 Q 154 110 152 126 Q 144 124 143 110 Z" 
            style={getStyle('triceps')}
            onMouseEnter={() => setHoveredGroup('triceps')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('triceps')}
          />

          {/* COSTAS (DORSAIS/LATS) */}
          <path 
            d="M 72 88 Q 100 88 100 135 L 75 145 Q 68 115 72 88 Z" 
            style={getStyle('costas')}
            onMouseEnter={() => setHoveredGroup('costas')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('costas')}
          />
          <path 
            d="M 128 88 Q 100 88 100 135 L 125 145 Q 132 115 128 88 Z" 
            style={getStyle('costas')}
            onMouseEnter={() => setHoveredGroup('costas')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('costas')}
          />

          {/* LOMBAR */}
          <path 
            d="M 78 147 Q 100 144 122 147 L 118 178 Q 100 182 82 178 Z" 
            style={getStyle('lombar')}
            onMouseEnter={() => setHoveredGroup('lombar')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('lombar')}
          />

          {/* GLÚTEOS */}
          <path 
            d="M 68 188 C 76 182 100 185 100 200 C 100 216 88 228 72 224 C 64 212 64 200 68 188 Z" 
            style={getStyle('gluteos')}
            onMouseEnter={() => setHoveredGroup('gluteos')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('gluteos')}
          />
          <path 
            d="M 132 188 C 124 182 100 185 100 200 C 100 216 112 228 128 224 C 136 212 136 200 132 188 Z" 
            style={getStyle('gluteos')}
            onMouseEnter={() => setHoveredGroup('gluteos')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('gluteos')}
          />

          {/* POSTERIOR (HAMSTRINGS) */}
          <path 
            d="M 70 232 Q 82 245 78 290 Q 64 290 62 248 Z" 
            style={getStyle('posterior')}
            onMouseEnter={() => setHoveredGroup('posterior')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('posterior')}
          />
          <path 
            d="M 130 232 Q 118 245 122 290 Q 136 290 138 248 Z" 
            style={getStyle('posterior')}
            onMouseEnter={() => setHoveredGroup('posterior')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('posterior')}
          />

          {/* PANTURRILHAS */}
          <path 
            d="M 66 304 Q 74 315 70 344 L 62 344 Q 56 325 66 304 Z" 
            style={getStyle('panturrilhas')}
            onMouseEnter={() => setHoveredGroup('panturrilhas')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('panturrilhas')}
          />
          <path 
            d="M 134 304 Q 126 315 130 344 L 138 344 Q 144 325 134 304 Z" 
            style={getStyle('panturrilhas')}
            onMouseEnter={() => setHoveredGroup('panturrilhas')}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => handleGroupAction('panturrilhas')}
          />

          {/* Decorators */}
          <circle cx="44" cy="188" r="5" className="fill-zinc-800" />
          <circle cx="156" cy="188" r="5" className="fill-zinc-800" />
        </svg>
      </div>
    </div>
  );
}
