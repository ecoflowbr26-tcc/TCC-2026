/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Recycle, ArrowRight, UserCheck, Eye } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="welcome-page" className="min-h-[80vh] flex items-center justify-center -mt-6">
      <div className="w-full max-w-6xl bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left column: Rich presentation text & primary button */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8">
          
          {/* Header tagline with subtle pulse */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-eco-forest rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border border-eco-sage/20 shadow-2xs"
            >
              <Recycle className="w-3.5 h-3.5 animate-spin-slow text-eco-sage" />
              <span>Transparência & Design Circular</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-stone-900"
            >
              Bem-vindo ao <br />
              <span className="text-eco-forest bg-gradient-to-r from-eco-forest to-eco-sage bg-clip-text text-transparent">EcoFlow</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans max-w-lg"
            >
              Nossa missão é conectar artesãos apaixonados a consumidores conscientes. 
              Aqui, resíduos como madeira de demolição, garrafas PET, embalagens de vidro de descarte e paletes 
              são transformados em móveis excepcionais e utilitários incríveis para seu lar.
            </motion.p>
          </div>

          {/* Quick value props / rules */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
          >
            <div className="p-4 bg-eco-cream/50 rounded-2xl border border-stone-150 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-eco-forest/10 flex items-center justify-center text-eco-forest shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-stone-850 block">Exclusivo para Vendedores</span>
                <p className="text-[9.5px] text-stone-500 leading-tight">Apenas marceneiros rústicos e artesãos do upcycling precisam se cadastrar para anunciar.</p>
              </div>
            </div>

            <div className="p-4 bg-eco-cream/50 rounded-2xl border border-stone-150 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-eco-sage/25 flex items-center justify-center text-eco-forest shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-stone-850 block">Compradores Sem Login</span>
                <p className="text-[9.5px] text-stone-500 leading-tight">Navegue livremente, curta, compartilhe ou fale direto com os criadores sem burocracias.</p>
              </div>
            </div>
          </motion.div>

          {/* Interaction area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-stone-150"
          >
            <button
              onClick={() => navigate('/feed')}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-2xl transition-all duration-300 text-xs shadow-md shadow-emerald-950/10 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Explorar o Feed de Projetos</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => navigate('/cadastro')}
              className="px-6 py-3.5 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold rounded-2xl border border-stone-250 transition-all text-xs cursor-pointer text-center"
            >
              Quero Anunciar Produtos
            </button>
          </motion.div>

          <div className="text-[9px] text-stone-400 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>EcoFlow Versão 1.5 - Design Circular sem Fins Lucrativos</span>
          </div>

        </div>

        {/* Right column: Immersive upcycled wood image banner */}
        <div className="hidden lg:block lg:col-span-5 relative min-h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=85"
            alt="Interior rústico minimalista mostrando móveis de madeira reaproveitada e iluminação aconchegante"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent pointer-events-none" />
          
          {/* Subtle decoration badge inside photo */}
          <div className="absolute bottom-8 right-8 left-8 bg-stone-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl text-left">
            <p className="text-[9.5px] font-black text-[#A8DDA8] font-mono tracking-widest uppercase flex items-center gap-1.5 mb-1.5">
              <Leaf className="w-3.5 h-3.5 text-eco-sage" />
              Impacto Ecológico Direto
            </p>
            <p className="text-[11.5px] text-stone-200 leading-normal font-sans">
              Cada anúncio representa quilos de matéria-prima resgatados que, de outra forma, repousariam em aterros por séculos. Conecte-se e inspire o amanhã de forma consciente.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
