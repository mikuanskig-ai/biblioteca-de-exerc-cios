/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dumbbell, UserCheck, Search, Sparkles } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
  activeView: 'library' | 'detail' | 'admin';
  setActiveView: (view: 'library' | 'detail' | 'admin') => void;
  onOpenLogin: () => void;
}

export default function Header({ isAdmin, onLogout, activeView, setActiveView, onOpenLogin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-[rgba(57,255,20,0.15)]" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveView('library')}
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-[18px] bg-[#0F2A12] flex items-center justify-center text-[#39FF14] border border-[rgba(57,255,20,0.15)] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300">
              <Dumbbell className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xl tracking-wider font-bold text-white leading-none">
                BIA TISATTO
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#39FF14] uppercase mt-0.5 font-semibold">
                Consultoria Premium
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8" id="header-nav">
            <button 
              onClick={() => setActiveView('library')}
              className={`text-xs tracking-widest uppercase transition-colors duration-250 ${
                activeView === 'library' || activeView === 'detail'
                  ? 'text-[#39FF14] font-bold drop-shadow-[0_0_6px_rgba(57,255,20,0.2)]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              id="nav-library-btn"
            >
              Biblioteca de Exercícios
            </button>
            <a 
              href="https://biatisatto.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors duration-250"
              id="nav-site-link"
            >
              O Método
            </a>
            <a 
              href="https://biatisatto.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors duration-250"
              id="nav-plans-link"
            >
              Planos & Consultoria
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4" id="header-actions">
            {/* Toggle Professional Mode */}
            <button
              onClick={() => {
                if (isAdmin) {
                  onLogout();
                } else {
                  onOpenLogin();
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-[16px] text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                isAdmin 
                  ? 'bg-[#0F2A12] text-[#39FF14] border-[rgba(57,255,20,0.3)] shadow-[0_0_15px_rgba(57,255,20,0.15)]' 
                  : 'bg-[#111111] text-[#D1D5DB] border-[rgba(57,255,20,0.15)] hover:border-[#39FF14] hover:text-white hover:shadow-[0_0_10px_rgba(57,255,20,0.1)]'
              }`}
              title="Alternar entre visualização de aluno e painel profissional"
              id="toggle-admin-btn"
            >
              <UserCheck className="w-4 h-4 text-[#39FF14]" />
              <span>{isAdmin ? 'Painel Profissional' : 'Área do Professor'}</span>
            </button>

            {/* CTA */}
            <a
              href="https://wa.me/554599584236"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-[16px] bg-[#39FF14] hover:bg-[#2DE600] text-[#050505] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(57,255,20,0.35)] hover:scale-[1.02]"
              id="cta-whatsapp"
            >
              Falar com a Bia
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
