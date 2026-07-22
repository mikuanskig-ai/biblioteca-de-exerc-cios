/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Play, RotateCcw, Video, Image as ImageIcon, Info, Activity, Loader2 } from 'lucide-react';

interface BiomechanicsVisualizerProps {
  exerciseId: string;
  exerciseName: string;
  gifUrl?: string;
  videoUrl?: string;
  muscleGroup: string;
}

export default function BiomechanicsVisualizer({ exerciseId, exerciseName, gifUrl, videoUrl, muscleGroup }: BiomechanicsVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'animation' | 'media'>('animation');
  const [animationTick, setAnimationTick] = useState(0);
  const [isGifLoading, setIsGifLoading] = useState(true);
  const [gifError, setGifError] = useState(false);

  // Toggle play/pause
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationTick(prev => (prev + 1) % 100);
      }, 35); // 30fps approximate loop
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // If a custom GIF or Video is added, prefer that view mode initially if requested
  useEffect(() => {
    if (gifUrl || videoUrl) {
      setViewMode('media');
    } else {
      setViewMode('animation');
    }
    setIsGifLoading(true);
    setGifError(false);
  }, [gifUrl, videoUrl, exerciseId]);

  // Get current state values based on the animation tick
  const progress = animationTick / 100; // 0 to 1
  // Sinusoidal wave for smooth up/down motion (0 to 1 to 0)
  const sineProgress = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2;

  // Render a beautifully crafted vector animation of the biomechanical movement
  const renderInteractiveAnimation = () => {
    switch (exerciseId) {
      case 'ex_01': // Agachamento Livre
        return (
          <g id="squat-animation-elements">
            {/* Floor */}
            <line x1="20" y1="280" x2="280" y2="280" className="stroke-zinc-850" strokeWidth="3" strokeDasharray="5 5" />
            <rect x="20" y="280" width="260" height="40" className="fill-zinc-900/10" />
            
            {/* Squat Rack (Background decoration) */}
            <line x1="60" y1="120" x2="60" y2="280" className="stroke-zinc-900" strokeWidth="4" />
            <line x1="240" y1="120" x2="240" y2="280" className="stroke-zinc-900" strokeWidth="4" />
            <line x1="60" y1="120" x2="240" y2="120" className="stroke-zinc-900" strokeWidth="2" />
            
            {/* Dynamic Figure (Squatting) */}
            {(() => {
              // Angles and positions dynamically calculated
              const hipY = 170 + sineProgress * 50; // Hip goes down
              const kneeY = 220 + sineProgress * 20; // Knee moves slightly forward/down
              const kneeX = 135 + sineProgress * 5;
              const ankleX = 130;
              const ankleY = 275;
              const shoulderY = 115 + sineProgress * 50;
              const shoulderX = 115 + sineProgress * 5;
              const hipX = 105 + sineProgress * 15; // Hip pushes back
              
              return (
                <>
                  {/* Highlight Active Muscles (Glow behind muscles) */}
                  <circle cx={hipX + 15} cy={hipY + 20} r="25" className="fill-[#39FF14]/15 blur-md" />
                  <path 
                    d={`M ${hipX} ${hipY} Q ${kneeX} ${kneeY} ${ankleX} ${ankleY}`} 
                    className="stroke-[#39FF14]/15 blur-sm" 
                    strokeWidth="16" 
                    fill="none" 
                  />
                  
                  {/* Bones / Joints */}
                  {/* Foot */}
                  <line x1={ankleX} y1={ankleY} x2={ankleX + 25} y2={ankleY} className="stroke-zinc-300" strokeWidth="4" strokeLinecap="round" />
                  {/* Shin (Ankle to Knee) */}
                  <line x1={ankleX} y1={ankleY} x2={kneeX} y2={kneeY} className="stroke-zinc-400" strokeWidth="6" strokeLinecap="round" />
                  {/* Thigh (Knee to Hip) - Highlighted Quadriceps/Glute */}
                  <line 
                    x1={kneeX} 
                    y1={kneeY} 
                    x2={hipX} 
                    y2={hipY} 
                    className={`transition-colors duration-200 ${sineProgress > 0.6 ? 'stroke-[#39FF14]' : 'stroke-zinc-100'}`} 
                    strokeWidth={sineProgress > 0.6 ? "10" : "8"} 
                    strokeLinecap="round" 
                  />
                  {/* Torso (Hip to Shoulder) */}
                  <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} className="stroke-zinc-400" strokeWidth="8" strokeLinecap="round" />
                  {/* Head */}
                  <circle cx={shoulderX + 5} cy={shoulderY - 20} r="12" className="fill-zinc-300 stroke-zinc-100" strokeWidth="2" />
                  
                  {/* Barbell and Plates */}
                  <line x1={shoulderX - 50} y1={shoulderY - 5} x2={shoulderX + 50} y2={shoulderY - 5} className="stroke-zinc-500" strokeWidth="4" />
                  {/* Weight Plates Left */}
                  <rect x={shoulderX - 54} y={shoulderY - 25} width="8" height="40" rx="2" className="fill-zinc-600 stroke-zinc-950" />
                  <rect x={shoulderX - 62} y={shoulderY - 20} width="6" height="30" rx="1" className="fill-[#39FF14] stroke-zinc-950" />
                  {/* Weight Plates Right */}
                  <rect x={shoulderX + 46} y={shoulderY - 25} width="8" height="40" rx="2" className="fill-zinc-600 stroke-zinc-950" />
                  <rect x={shoulderX + 56} y={shoulderY - 20} width="6" height="30" rx="1" className="fill-[#39FF14] stroke-zinc-950" />
 
                  {/* Muscle Engagement Indicator Overlay */}
                  {sineProgress > 0.6 && (
                    <g transform={`translate(${hipX - 10}, ${hipY + 5})`} className="animate-pulse">
                      <text x="0" y="0" className="fill-[#39FF14] font-mono font-bold text-[9px] tracking-wider" textAnchor="middle">GLÚTEO ATIVO</text>
                      <text x="35" y="45" className="fill-[#39FF14] font-mono font-bold text-[9px] tracking-wider" textAnchor="middle">QUADRÍCEPS</text>
                    </g>
                  )}
                  
                  {/* Biomechanics Vector Arrows */}
                  {sineProgress > 0.7 ? (
                    <g className="opacity-80">
                      {/* Vertical Force Arrow Upwards from ground */}
                      <path d="M 130 270 L 130 220" className="stroke-green-500" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 125 230 L 130 220 L 135 230" className="stroke-green-500" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <text x="140" y="210" className="fill-green-400 font-mono text-[9px]">FORÇA DE REAÇÃO</text>
                    </g>
                  ) : (
                    <g className="opacity-50">
                      {/* Gravity force pulling bar down */}
                      <path d={`M ${shoulderX} ${shoulderY - 30} L ${shoulderX} ${shoulderY + 10}`} className="stroke-red-500" strokeWidth="2" fill="none" />
                      <path d={`M ${shoulderX - 4} ${shoulderY + 4} L ${shoulderX} ${shoulderY + 10} L ${shoulderX + 4} ${shoulderY + 4}`} className="stroke-red-500" strokeWidth="2" fill="none" />
                    </g>
                  )}
                </>
              );
            })()}
          </g>
        );

      case 'ex_02': // Elevação Lateral
        return (
          <g id="lateral-raise-animation-elements">
            {/* Floor */}
            <line x1="20" y1="280" x2="280" y2="280" className="stroke-zinc-850" strokeWidth="2" />
            
            {/* Torso Base */}
            <circle cx="150" cy="115" r="14" className="fill-zinc-300" /> {/* Head */}
            <line x1="150" y1="130" x2="150" y2="220" className="stroke-zinc-500" strokeWidth="12" strokeLinecap="round" /> {/* Spine */}
            <line x1="120" y1="140" x2="180" y2="140" className="stroke-zinc-400" strokeWidth="10" strokeLinecap="round" /> {/* Collarbone */}
            
            {/* Legs */}
            <line x1="142" y1="220" x2="135" y2="280" className="stroke-zinc-400" strokeWidth="6" />
            <line x1="158" y1="220" x2="165" y2="280" className="stroke-zinc-400" strokeWidth="6" />

            {/* Arms Raising */}
            {(() => {
              // Arm raises from vertical (90 deg down) to horizontal (0 deg)
              // Angle goes from ~80 degrees down to ~0 degrees
              const angleDeg = 80 - sineProgress * 80;
              const rad = (angleDeg * Math.PI) / 180;
              
              const shoulderLeftX = 120;
              const shoulderY = 140;
              const armLength = 50;
              
              const handLeftX = shoulderLeftX - Math.sin(rad) * armLength;
              const handLeftY = shoulderY + Math.cos(rad) * armLength;
              
              const shoulderRightX = 180;
              const handRightX = shoulderRightX + Math.sin(rad) * armLength;
              const handRightY = shoulderY + Math.cos(rad) * armLength;

              return (
                <>
                  {/* Highlights */}
                  {sineProgress > 0.7 && (
                    <>
                      <circle cx={shoulderLeftX} cy={shoulderY} r="14" className="fill-[#39FF14]/20 blur-sm" />
                      <circle cx={shoulderRightX} cy={shoulderY} r="14" className="fill-[#39FF14]/20 blur-sm" />
                    </>
                  )}

                  {/* Left Arm */}
                  <line 
                    x1={shoulderLeftX} 
                    y1={shoulderY} 
                    x2={handLeftX} 
                    y2={handLeftY} 
                    className="stroke-zinc-100" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                  />
                  <circle cx={handLeftX} cy={handLeftY} r="8" className="fill-zinc-600 stroke-zinc-950" /> {/* Dumbbell Left */}
                  <line x1={handLeftX - 10} y1={handLeftY} x2={handLeftX + 10} y2={handLeftY} className="stroke-zinc-400" strokeWidth="3" />

                  {/* Right Arm */}
                  <line 
                    x1={shoulderRightX} 
                    y1={shoulderY} 
                    x2={handRightX} 
                    y2={handRightY} 
                    className="stroke-zinc-100" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                  />
                  <circle cx={handRightX} cy={handRightY} r="8" className="fill-zinc-600 stroke-zinc-950" /> {/* Dumbbell Right */}
                  <line x1={handRightX - 10} y1={handRightY} x2={handRightX + 10} y2={handRightY} className="stroke-zinc-400" strokeWidth="3" />

                  {/* Active Deltoid highlight */}
                  <path 
                    d={`M ${shoulderLeftX - 12} ${shoulderY - 5} Q ${shoulderLeftX} ${shoulderY + 12} ${shoulderLeftX + 10} ${shoulderY}`}
                    className={`fill-none transition-colors duration-200 ${sineProgress > 0.6 ? 'stroke-[#39FF14]' : 'stroke-zinc-600'}`}
                    strokeWidth="4" 
                  />
                  <path 
                    d={`M ${shoulderRightX + 12} ${shoulderY - 5} Q ${shoulderRightX} ${shoulderY + 12} ${shoulderRightX - 10} ${shoulderY}`}
                    className={`fill-none transition-colors duration-200 ${sineProgress > 0.6 ? 'stroke-[#39FF14]' : 'stroke-zinc-600'}`}
                    strokeWidth="4" 
                  />

                  {sineProgress > 0.7 && (
                    <text x="150" y="80" className="fill-[#39FF14] font-mono font-bold text-[10px] tracking-wider" textAnchor="middle">
                      DELTÓIDE LATERAL ATIVO
                    </text>
                  )}
                </>
              );
            })()}
          </g>
        );

      case 'ex_03': // Stiff com Halteres
        return (
          <g id="stiff-animation-elements">
            {/* Floor */}
            <line x1="20" y1="280" x2="280" y2="280" className="stroke-zinc-850" strokeWidth="2" />

            {/* Dynamic Hip Hinge Figure */}
            {(() => {
              // Hinge motion (bend at hips)
              // Hip angle tilts trunk down
              const angleDeg = sineProgress * 55; // Up to 55 degrees tilt
              const rad = (angleDeg * Math.PI) / 180;
              
              const hipX = 110;
              const hipY = 190;
              
              // Leg stays almost vertical (subtle bend)
              const kneeX = 112;
              const kneeY = 230;
              const ankleX = 110;
              const ankleY = 275;

              // Spine pivots on Hip
              const trunkLength = 65;
              const shoulderX = hipX + Math.sin(rad) * trunkLength;
              const shoulderY = hipY - Math.cos(rad) * trunkLength;

              // Head
              const headX = shoulderX + Math.sin(rad) * 15;
              const headY = shoulderY - Math.cos(rad) * 15;

              // Arm hangs straight down under gravity
              const armLength = 45;
              const handX = shoulderX; // hanging vertical
              const handY = shoulderY + armLength;

              return (
                <>
                  {/* Highlights (Back of thigh) */}
                  {sineProgress > 0.5 && (
                    <path 
                      d={`M ${hipX} ${hipY} Q ${kneeX} ${kneeY} ${ankleX} ${ankleY}`} 
                      className="stroke-[#39FF14]/20 blur-sm" 
                      strokeWidth="15" 
                      fill="none" 
                    />
                  )}

                  {/* Legs */}
                  <line x1={ankleX} y1={ankleY} x2={ankleX + 20} y2={ankleY} className="stroke-zinc-400" strokeWidth="4" />
                  <line x1={ankleX} y1={ankleY} x2={kneeX} y2={kneeY} className="stroke-zinc-300" strokeWidth="6" />
                  <line 
                    x1={kneeX} 
                    y1={kneeY} 
                    x2={hipX} 
                    y2={hipY} 
                    className={`transition-colors duration-200 ${sineProgress > 0.5 ? 'stroke-[#39FF14]' : 'stroke-zinc-300'}`} 
                    strokeWidth="7" 
                  />

                  {/* Torso */}
                  <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} className="stroke-zinc-100" strokeWidth="8" strokeLinecap="round" />
                  <circle cx={headX} cy={headY} r="10" className="fill-zinc-300" />

                  {/* Arms & Halter */}
                  <line x1={shoulderX} y1={shoulderY} x2={handX} y2={handY} className="stroke-zinc-300" strokeWidth="5" strokeLinecap="round" />
                  <circle cx={handX} cy={handY} r="7" className="fill-zinc-600 stroke-zinc-950" />
                  <line x1={handX - 10} y1={handY} x2={handX + 10} y2={handY} className="stroke-zinc-400" strokeWidth="3" />

                  {/* Muscle pull lines */}
                  {sineProgress > 0.5 && (
                    <g transform={`translate(${hipX - 60}, ${hipY + 30})`} className="animate-pulse">
                      <text x="0" y="0" className="fill-[#39FF14] font-mono font-bold text-[9px]" textAnchor="start">ALONGANDO</text>
                      <text x="0" y="12" className="fill-[#39FF14] font-mono font-bold text-[9px]" textAnchor="start">POSTERIORES</text>
                    </g>
                  )}
                </>
              );
            })()}
          </g>
        );

      case 'ex_04': // Supino Reto com Halteres
        return (
          <g id="bench-press-animation-elements">
            {/* Bench */}
            <rect x="70" y="180" width="160" height="15" rx="2" className="fill-zinc-800" />
            <rect x="90" y="195" width="15" height="85" className="fill-zinc-900" />
            <rect x="195" y="195" width="15" height="85" className="fill-zinc-900" />
            <line x1="50" y1="280" x2="250" y2="280" className="stroke-zinc-800" strokeWidth="2" />

            {/* Flat Lying Figure */}
            {(() => {
              const bodyY = 172;
              const shoulderX = 110;
              const hipX = 180;
              
              // Arm extension
              // Pushing barbell up
              const barTravel = 45;
              const pushY = bodyY - 15 - sineProgress * barTravel;

              return (
                <>
                  {/* Torso lying down */}
                  <line x1={shoulderX} y1={bodyY} x2={hipX} y2={bodyY} className="stroke-zinc-400" strokeWidth="12" strokeLinecap="round" />
                  {/* Head */}
                  <circle cx={shoulderX - 18} cy={bodyY - 2} r="10" className="fill-zinc-300" />
                  {/* Active Pecs Glow */}
                  {sineProgress < 0.4 && (
                    <circle cx={shoulderX + 15} cy={bodyY - 6} r="15" className="fill-[#39FF14]/15 blur-sm" />
                  )}

                  {/* Legs hanging down */}
                  <line x1={hipX} y1={bodyY} x2={205} y2={210} className="stroke-zinc-500" strokeWidth="6" />
                  <line x1={205} y1={210} x2={205} y2={280} className="stroke-zinc-500" strokeWidth="5" />
                  <line x1={205} y1={280} x2={220} y2={280} className="stroke-zinc-400" strokeWidth="3" />

                  {/* Arm Pushing */}
                  {/* Upper Arm */}
                  <line x1={shoulderX} y1={bodyY - 4} x2={shoulderX + 10} y2={pushY + (bodyY - pushY)/2} className="stroke-zinc-300" strokeWidth="6" />
                  {/* Forearm */}
                  <line x1={shoulderX + 10} y1={pushY + (bodyY - pushY)/2} x2={shoulderX + 5} y2={pushY} className="stroke-zinc-100" strokeWidth="5" />

                  {/* Halter Left */}
                  <circle cx={shoulderX + 5} cy={pushY} r="7" className="fill-zinc-600 stroke-zinc-950" />
                  <line x1={shoulderX - 5} y1={pushY} x2={shoulderX + 15} y2={pushY} className="stroke-zinc-400" strokeWidth="3" />

                  {/* Helper Text */}
                  {sineProgress < 0.4 && (
                    <text x="150" y="110" className="fill-[#39FF14] font-mono font-bold text-[9px] tracking-wider animate-pulse" textAnchor="middle">
                      MÁXIMA ATIVAÇÃO NO PEITO
                    </text>
                  )}
                </>
              );
            })()}
          </g>
        );

      case 'ex_06': // Prancha Isométrica
        return (
          <g id="plank-animation-elements">
            {/* Floor */}
            <line x1="20" y1="260" x2="280" y2="260" className="stroke-zinc-850" strokeWidth="3" />

            {/* Static Figure holding Plank with core breathing indicator */}
            {(() => {
              const ankleX = 60;
              const ankleY = 210;
              const hipX = 130;
              const hipY = 195 + Math.sin(progress * Math.PI * 4) * 0.8; // subtle vibration/holding effort
              const shoulderX = 210;
              const shoulderY = 190;
              
              const elbowX = 210;
              const elbowY = 255;

              return (
                <>
                  {/* Core Highlight Ring (Breathing) */}
                  <circle 
                    cx={hipX - 10} 
                    cy={hipY + 5} 
                    r={18 + Math.sin(progress * Math.PI * 4) * 3} 
                    className="stroke-[#39FF14]/35 fill-none" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 2"
                  />

                  {/* Legs */}
                  <line x1={ankleX} y1={ankleY} x2={ankleX - 5} y2={220} className="stroke-zinc-500" strokeWidth="3" /> {/* Feet */}
                  <line x1={ankleX} y1={ankleY} x2={hipX} y2={hipY} className="stroke-zinc-100" strokeWidth="7" strokeLinecap="round" /> {/* Legs to hips */}

                  {/* Torso */}
                  <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} className="stroke-zinc-100" strokeWidth="8" strokeLinecap="round" />
                  <circle cx={shoulderX + 16} cy={shoulderY - 10} r="10" className="fill-zinc-300" />

                  {/* Arms (Elbow supported) */}
                  <line x1={shoulderX} y1={shoulderY} x2={elbowX} y2={elbowY} className="stroke-zinc-400" strokeWidth="6" />
                  <line x1={elbowX} y1={elbowY} x2={elbowX + 25} y2={elbowY} className="stroke-zinc-500" strokeWidth="5" strokeLinecap="round" />

                  {/* Core Tension Indicators */}
                  <text x="150" y="140" className="fill-[#39FF14] font-mono font-bold text-[9px] tracking-wider" textAnchor="middle">
                    ISOMETRIA ATIVA (CORE)
                  </text>
                  <text x="150" y="152" className="fill-zinc-500 font-mono text-[8px]" textAnchor="middle">
                    MANTENHA O TRONCO ALINHADO
                  </text>
                </>
              );
            })()}
          </g>
        );

      default: // Generic Abstract Flow Visualizer for other exercises
        return (
          <g id="abstract-biomechanics-elements">
            {/* Moving central core glowing */}
            <circle cx="150" cy="180" r={40 + sineProgress * 15} className="fill-[#39FF14]/5 stroke-[#39FF14]/20" strokeWidth="1" />
            <circle cx="150" cy="180" r={25 + sineProgress * 10} className="fill-[#39FF14]/10 stroke-[#39FF14]/40" strokeWidth="2" />
            
            {/* Dynamic Orbit Lines representing kinetic loops */}
            <ellipse 
              cx="150" 
              cy="180" 
              rx={90} 
              ry={35 + sineProgress * 15} 
              className="stroke-zinc-700 fill-none" 
              strokeWidth="1.5" 
              transform="rotate(30 150 180)" 
            />
            <ellipse 
              cx="150" 
              cy="180" 
              rx={90} 
              ry={35 - sineProgress * 10} 
              className="stroke-[#39FF14]/30 fill-none" 
              strokeWidth="2" 
              transform="rotate(-30 150 180)" 
            />

            {/* Floating Energy particles representing joint movement */}
            {(() => {
              const particleX1 = 150 + Math.cos(progress * Math.PI * 2) * 90;
              const particleY1 = 180 + Math.sin(progress * Math.PI * 2) * (35 + sineProgress * 15);
              const particleX2 = 150 - Math.cos(progress * Math.PI * 2) * 90;
              const particleY2 = 180 - Math.sin(progress * Math.PI * 2) * (35 - sineProgress * 10);

              return (
                <>
                  <circle cx={particleX1} cy={particleY1} r="5" className="fill-[#39FF14] filter drop-shadow(0 0 4px #39FF14)" />
                  <circle cx={particleX2} cy={particleY2} r="4" className="fill-white" />
                </>
              );
            })()}

            {/* Muscle Group Tag in center */}
            <text x="150" y="176" className="fill-[#39FF14] font-sans text-sm tracking-wider font-extrabold" textAnchor="middle">
              {exerciseName.toUpperCase()}
            </text>
            <text x="150" y="194" className="fill-zinc-400 font-mono text-[9px] tracking-widest uppercase" textAnchor="middle">
              Foco: {muscleGroup}
            </text>
          </g>
        );
    }
  };

  return (
    <div className="flex flex-col bg-[#111111] rounded-[24px] border border-[rgba(57,255,20,0.15)] overflow-hidden" id="biomechanics-visualizer">
      {/* Controls Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(57,255,20,0.15)] bg-[#0D0D0D]" id="visualizer-header">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#39FF14]" />
          <span className="text-xs uppercase tracking-widest text-[#39FF14] font-bold">Demonstração Biomecânica</span>
        </div>
        
        {/* Toggle Mode Button (only show if custom gif or video is specified) */}
        {(gifUrl || videoUrl) && (
          <div className="flex space-x-1" id="visualizer-mode-toggle">
            <button
              onClick={() => setViewMode('animation')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[16px] text-[10px] uppercase font-bold tracking-wider transition-all ${
                viewMode === 'animation' 
                  ? 'bg-[#39FF14] text-[#050505]' 
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              id="mode-anim-btn"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>
            <button
              onClick={() => setViewMode('media')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[16px] text-[10px] uppercase font-bold tracking-wider transition-all ${
                viewMode === 'media' 
                  ? 'bg-[#39FF14] text-[#050505]' 
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              id="mode-media-btn"
            >
              {videoUrl ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span>{videoUrl ? 'Vídeo' : 'GIF Real'}</span>
            </button>
          </div>
        )}
      </div>
 
      {/* Main Display Stage */}
      <div className="relative aspect-square flex items-center justify-center bg-[#050505] p-6 min-h-[300px]" id="visualizer-stage">
        {viewMode === 'animation' ? (
          <svg className="w-full h-full max-h-[360px]" viewBox="0 0 300 360" id="interactive-biomechanics-svg">
            {/* Gradients */}
            <defs>
              <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#39FF14" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Backdrop glow */}
            <circle cx="150" cy="180" r="140" fill="url(#stageGlow)" />
            
            {/* Dynamic simulation elements */}
            {renderInteractiveAnimation()}
          </svg>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-[24px] border border-[rgba(57,255,20,0.15)] bg-[#0D0D0D]" id="media-stage">
            {videoUrl ? (
              /* If it's a video */
              <div className="w-full h-full aspect-video flex flex-col justify-center items-center p-6 text-center">
                <Video className="w-12 h-12 text-[#39FF14] mb-3 animate-pulse" />
                <span className="text-sm font-semibold text-white mb-1">Vídeo Instrutivo de Bia Tisatto</span>
                <p className="text-xs text-zinc-500 max-w-xs mb-4">
                  Clique abaixo para abrir a demonstração completa do movimento em vídeo.
                </p>
                <a 
                  href={videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-[16px] bg-[#111111] border border-[rgba(57,255,20,0.15)] hover:border-[#39FF14] text-xs font-semibold text-white hover:bg-[#161616] transition-all duration-300 flex items-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 text-[#39FF14] fill-[#39FF14]" />
                  <span>Assistir no Canal da Bia</span>
                </a>
              </div>
            ) : gifUrl && !gifError ? (
              /* If it's an image/gif URL with modern lazy loading */
              <div className="relative w-full h-full flex items-center justify-center min-h-[250px]" id="gif-lazy-container">
                {isGifLoading && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#0C0C0E]/95 rounded-xl border border-[rgba(57,255,20,0.1)] space-y-3 z-10 animate-pulse"
                    id="gif-skeleton-loader"
                  >
                    <Loader2 className="w-8 h-8 text-[#39FF14] animate-spin" />
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-[11px] font-mono text-zinc-400 tracking-widest uppercase">Carregando GIF</span>
                      <span className="text-[9px] font-mono text-zinc-600 tracking-wider">Aguardando conexão segura...</span>
                    </div>
                  </div>
                )}
                <img
                  src={gifUrl.startsWith('http') ? `/api/proxy-gif?url=${encodeURIComponent(gifUrl)}` : gifUrl}
                  alt={`Demonstração de ${exerciseName}`}
                  className={`max-w-full max-h-full object-contain rounded-xl select-none transition-all duration-500 ease-out ${
                    isGifLoading ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-none'
                  }`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onLoad={() => setIsGifLoading(false)}
                  onError={() => { setIsGifLoading(false); setGifError(true); }}
                  id="lazy-loaded-gif"
                />
              </div>
            ) : gifUrl && gifError ? (
              /* GIF source is unavailable (dead link upstream) - fall back gracefully instead of a broken image icon */
              <div className="text-center p-6">
                <ImageIcon className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <span className="text-xs text-zinc-500">GIF indisponível no momento. Use o Simulador ao lado!</span>
              </div>
            ) : (
              /* Fallback if somehow clicked media view with empty values */
              <div className="text-center p-6">
                <ImageIcon className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <span className="text-xs text-zinc-500">Sem mídia cadastrada. Use o Simulador ao lado!</span>
              </div>
            )}
          </div>
        )}
 
        {/* Legend Overlay for simulation */}
        {viewMode === 'animation' && (
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] text-zinc-500 bg-[#111111]/70 backdrop-blur-md px-3 py-2 rounded-[16px] border border-[rgba(57,255,20,0.15)]" id="visualizer-legend">
            <span className="flex items-center space-x-1.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] inline-block animate-pulse"></span>
              <span>Zona de Carga</span>
            </span>
            <span className="font-mono text-zinc-400">Ciclo de Execução: {(sineProgress * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
 
      {/* Footer Controls (Play/Pause/Reset) */}
      {viewMode === 'animation' && (
        <div className="flex items-center justify-center space-x-3 py-4 border-t border-[rgba(57,255,20,0.15)] bg-[#0D0D0D]" id="visualizer-playback-controls">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#111111] hover:bg-[#161616] text-white transition-colors border border-[rgba(57,255,20,0.15)]"
            title={isPlaying ? 'Pausar ciclo' : 'Reproduzir ciclo'}
            id="play-pause-btn"
          >
            {isPlaying ? (
              <span className="text-xs font-bold text-[#39FF14] font-mono">||</span>
            ) : (
              <Play className="w-4 h-4 fill-[#39FF14] text-[#39FF14] ml-0.5" />
            )}
          </button>
          
          <button
            onClick={() => {
              setAnimationTick(0);
              setIsPlaying(false);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#111111] hover:bg-[#161616] text-zinc-400 hover:text-white transition-colors border border-[rgba(57,255,20,0.15)]"
            title="Reiniciar animação"
            id="reset-anim-btn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
