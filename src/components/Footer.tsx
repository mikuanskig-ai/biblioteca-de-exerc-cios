/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dumbbell, Instagram, Youtube, Globe, Heart, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[rgba(57,255,20,0.15)] pt-16 pb-12 mt-auto" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand info */}
          <div className="md:col-span-2 flex flex-col space-y-4" id="footer-brand">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-[18px] bg-[#0F2A12] flex items-center justify-center text-[#39FF14] border border-[rgba(57,255,20,0.15)]">
                <Dumbbell className="w-4.5 h-4.5 text-[#39FF14]" />
              </div>
              <span className="font-sans text-lg tracking-wider font-bold text-white">
                BIA TISATTO
              </span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Desenvolvendo o bem-estar, a performance e a consciência corporal de centenas de alunos através de metodologias de treinamento personalizadas e cientificamente embasadas.
            </p>
            {/* Social icons */}
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://www.instagram.com/biatisatto.personal/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14] transition-all duration-300"
                id="footer-insta"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/554599584236" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#39FF14] hover:text-[#39FF14] hover:border-[#39FF14] transition-all duration-300"
                id="footer-whatsapp"
                title="Falar no WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14] transition-all duration-300"
                id="footer-yt"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://biatisatto.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14] transition-all duration-300"
                id="footer-web"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>

            {/* Contato Direto */}
            <div className="pt-2" id="footer-whatsapp-text">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-1">Contato WhatsApp</span>
              <a 
                href="https://wa.me/554599584236" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#39FF14] text-xs font-semibold transition-colors duration-250 flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span>
                <span>(45) 9958-4236</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories quick access */}
          <div className="flex flex-col space-y-4" id="footer-categories">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#39FF14]">
              Categorias
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="hover:text-[#39FF14] transition-colors duration-200 cursor-pointer">🏋️ Musculação</li>
              <li className="hover:text-[#39FF14] transition-colors duration-200 cursor-pointer">🤸 Alongamentos</li>
              <li className="hover:text-[#39FF14] transition-colors duration-200 cursor-pointer">🧘 Mobilidade</li>
              <li className="hover:text-[#39FF14] transition-colors duration-200 cursor-pointer">💪 Funcional</li>
              <li className="hover:text-[#39FF14] transition-colors duration-200 cursor-pointer">❤️ Reabilitação</li>
            </ul>
          </div>

          {/* Col 3: Disclaimer & Guidance */}
          <div className="flex flex-col space-y-4" id="footer-disclaimer">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#39FF14]">
              Aviso Importante
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              O conteúdo desta biblioteca é estritamente informativo e educativo. Consulte sempre seu médico antes de iniciar qualquer rotina de exercícios físicos. Preze sempre pela técnica ideal e o alinhamento postural perfeito antes de aumentar cargas.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(57,255,20,0.15)] pt-8 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-xs gap-4">
          <p id="copyright-text">
            &copy; 2026 Bia Tisatto. Todos os direitos reservados.
          </p>
          <p className="flex items-center space-x-1" id="footer-credits">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-[#39FF14] animate-pulse fill-[#39FF14]" />
            <span>para alunos de Consultoria de Alta Performance</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
