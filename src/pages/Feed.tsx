/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEco } from '../contexts/EcoContext';
import { CardProduto } from '../components/CardProduto';
import { Sparkles, Hammer, Trees, ChevronRight, Award, Compass, MessageSquare, Recycle, Smile, Info, Globe, Droplets, RotateCcw, Trash2, Flame } from 'lucide-react';

export const Feed: React.FC = () => {
  const { products } = useEco();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Calculator Weights States
  const [petWeight, setPetWeight] = useState<number>(10);
  const [glassWeight, setGlassWeight] = useState<number>(15);
  const [metalWeight, setMetalWeight] = useState<number>(5);
  const [paperWeight, setPaperWeight] = useState<number>(20);
  const [woodWeight, setWoodWeight] = useState<number>(30);

  // Filter products: Primary Focus (Recycled Wastes)
  const featuredRecycledProducts = products.filter(
    (p) => !p.isInactive && p.category !== 'Madeira Sustentável' && p.category !== 'Móveis Sustentáveis' && !p.isPremiumWood
  );

  // Filter products: Secondary Focus (Repurposed Wood, Pallets)
  const secondaryWoodProducts = products.filter(
    (p) => !p.isInactive && (p.category === 'Madeira Sustentável' || p.category === 'Móveis Sustentáveis' || p.isPremiumWood === true)
  );

  // Categories list
  const categoryTabs = [
    'Todos',
    'Reciclados Criativos',
    'Moda Sustentável',
    'Jardinagem',
    'Utilidades Domésticas',
    'Arte',
    'Decoração',
    'Madeira Sustentável',
    'Móveis Sustentáveis',
  ];

  const filteredFeed = selectedCategory === 'Todos'
    ? products.filter((p) => !p.isInactive)
    : products.filter((p) => !p.isInactive && p.category === selectedCategory);

  return (
    <div id="home-page" className="space-y-12">
      
      {/* 1. Hero banner with split minimalist ecology layout */}
      <section className="relative overflow-hidden bg-stone-950 rounded-3xl text-white border border-stone-850 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6 z-10 relative">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-white/5 backdrop-blur-md rounded-full text-[10.5px] font-bold font-mono tracking-wider uppercase border border-white/10 text-emerald-400">
              <Recycle className="w-3.5 h-3.5 animate-spin-slow text-eco-sage" />
              <span>Plataforma de Design Circular</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-none">
                Estética Industrial & <br />
                <span className="text-emerald-400">Artesanato Circular</span>
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                Seja bem-vindo à rede EcoFlow. Aqui, materiais descartados como paletes industriais, 
                garrafas de vidro e retalhos de ferro ganham uma segunda vida refinada. Navegue pela autenticidade do upcycling brasileiro.
              </p>
            </div>

            {/* Micro KPIs statistics layout */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-md">
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">1.2k+</span>
                <p className="text-[9.5px] uppercase tracking-wider text-stone-550 font-bold">Quilos Popados</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">82</span>
                <p className="text-[9.5px] uppercase tracking-wider text-stone-550 font-bold">Oficinas Ativas</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">650+</span>
                <p className="text-[9.5px] uppercase tracking-wider text-stone-550 font-bold">Ideias em Ciclo</p>
              </div>
            </div>
          </div>

          {/* Right Immersive Image Block with visual upcycling quote overlay */}
          <div className="hidden lg:block lg:col-span-5 relative min-h-[380px]">
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80" 
              alt="Mesa de centro rústica feita com madeira recuperada e pés de ferro em ambiente iluminado"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
            
            {/* Elegant Floating Quote */}
            <div className="absolute bottom-6 right-6 left-6 p-4 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
              <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono mb-1">Citação do Artesão</p>
              <p className="text-stone-300 text-[11px] leading-snug italic">
                "Não existem resíduos inúteis, apenas materiais esperando a dose correta de criatividade e design para renascer."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Interactive Calculator section (Interactive Upcycling Carbon Impact Tool) */}
      <section id="eco-calculator" className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left info */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-eco-forest/10 rounded-full text-[9.5px] font-bold text-eco-forest font-mono tracking-wider uppercase">
              <Droplets className="w-3.5 h-3.5" />
              Impactômetro EcoFlow
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              Calcule seu Impacto de Produção Reciclada
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed font-sans">
              Cada retalho resgatado tem um peso real de impacto. Use esta ferramenta viva para mensurar a estimativa de CO₂ evitado e água limpa preservada com base nas suas criações ou compras sustentáveis.
            </p>

            <div className="pt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 flex items-start gap-2.5">
                <Info className="w-4.5 h-4.5 text-eco-forest shrink-0 mt-0.5" />
                <p className="text-[10px] text-stone-500 leading-normal">
                  Estas estimativas de impacto usam métricas consolidadas de reciclagem (coleta seletiva x extração virgem) para calcular as economias em pegada ecológica direto no seu navegador.
                </p>
              </div>
            </div>
          </div>

          {/* Right Interface sliders & metrics */}
          <div className="lg:col-span-7 bg-eco-cream/40 rounded-2xl border border-stone-150 p-5 sm:p-6 space-y-6">
            
            {/* Sliders container */}
            <div className="space-y-4">
              {/* PET Bottles Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px] font-bold">
                  <span className="text-stone-700 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Garrafas PET (Unidades)
                  </span>
                  <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md font-mono">{petWeight} unid</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={petWeight}
                  onChange={(e) => setPetWeight(Number(e.target.value))}
                  className="w-full accent-eco-forest cursor-pointer"
                />
              </div>

              {/* Glass Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px] font-bold">
                  <span className="text-stone-700 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Garrafas / Potes de Vidro
                  </span>
                  <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md font-mono">{glassWeight} unid</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150" 
                  value={glassWeight}
                  onChange={(e) => setGlassWeight(Number(e.target.value))}
                  className="w-full accent-eco-forest cursor-pointer"
                />
              </div>

              {/* Metal/Iron Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px] font-bold">
                  <span className="text-stone-700 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-550" />
                    Sucata de Ferro / Alumínio (kg)
                  </span>
                  <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md font-mono">{metalWeight} kg</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={metalWeight}
                  onChange={(e) => setMetalWeight(Number(e.target.value))}
                  className="w-full accent-eco-forest cursor-pointer"
                />
              </div>

              {/* Wood Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px] font-bold">
                  <span className="text-stone-700 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                    Madeira / Palete de Descarte (kg)
                  </span>
                  <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md font-mono">{woodWeight} kg</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150" 
                  value={woodWeight}
                  onChange={(e) => setWoodWeight(Number(e.target.value))}
                  className="w-full accent-eco-forest cursor-pointer"
                />
              </div>
            </div>

            {/* Results Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              
              {/* Water Metric */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3.5 text-center">
                <p className="text-[8.5px] font-bold text-sky-600 font-mono tracking-widest uppercase mb-1">Água Preservada</p>
                <div className="inline-flex items-baseline gap-0.5">
                  <span className="text-xl sm:text-2xl font-black text-sky-850 font-mono">
                    {(petWeight * 2 + glassWeight * 1.5 + metalWeight * 40 + woodWeight * 8).toFixed(1)}
                  </span>
                  <span className="text-xs text-sky-700 font-bold">L</span>
                </div>
              </div>

              {/* Carbon saved Metric */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-center">
                <p className="text-[8.5px] font-bold text-emerald-600 font-mono tracking-widest uppercase mb-1">CO₂ Evitado</p>
                <div className="inline-flex items-baseline gap-0.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-850 font-mono">
                    {(petWeight * 0.15 + glassWeight * 0.25 + metalWeight * 1.8 + woodWeight * 0.9).toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">kg</span>
                </div>
              </div>

              {/* Energy saved Metric */}
              <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3.5 text-center">
                <p className="text-[8.5px] font-bold text-purple-600 font-mono tracking-widest uppercase mb-1">Energia Salva</p>
                <div className="inline-flex items-baseline gap-0.5">
                  <span className="text-xl sm:text-2xl font-black text-purple-850 font-mono">
                    {(petWeight * 0.5 + glassWeight * 0.3 + metalWeight * 4.5 + woodWeight * 1.2).toFixed(1)}
                  </span>
                  <span className="text-xs text-purple-700 font-bold">kWh</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. Primary focus: Recycled Wastes Creative Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-eco-forest font-mono tracking-widest uppercase flex items-center gap-1">
              <Recycle className="w-3.5 h-3.5 text-eco-sage" />
              Projetos Circulares Ativos
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Vitrine Criativa de Upcycling
            </h2>
            <p className="text-stone-500 text-xs leading-relaxed max-w-sm">
              Explore criações exclusivas feitas puramente de materiais re-aproveitados das ruas e indústrias nacionais.
            </p>
          </div>
          
          {/* Quick link button to category anchors or filter panel */}
          <div className="text-[11.5px] text-eco-forest font-bold flex items-center gap-1 cursor-pointer hover:underline">
            <span>Visão Geral do Catalogo</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Carousel grid of products on recycled focus */}
        {featuredRecycledProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-xs text-stone-750">Nenhum projeto de resíduos criativos cadastrado ainda</h3>
            <p className="text-[10px] text-stone-550 max-w-xs mx-auto mt-0.5 leading-normal">
              Participe! Se você cria produtos de upcycling, cadastre o seu agora mesmo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecycledProducts.slice(0, 6).map((product) => (
              <div key={product.id}>
                <CardProduto product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Secondary focus: Demolition Wood & Artisanal Premium */}
      <section className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-eco-wood font-mono tracking-widest uppercase flex items-center gap-1">
              <Hammer className="w-3.5 h-3.5 text-eco-forest animate-pulse" />
              Soberania do Rustico
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Móveis Rústicos & Madeira de Demolição
            </h2>
            <p className="text-stone-500 text-xs leading-relaxed max-w-md">
              Móveis luxuosos esculpidos a partir de toras caídas na floresta, dormentes antigos de ferrovias e madeiras centenárias resgatadas.
            </p>
          </div>
        </div>

        {/* Premium Wood/Furniture listings */}
        {secondaryWoodProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-150 p-6">
            <Trees className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-stone-750">Nenhum móvel premium cadastrado</h4>
            <p className="text-[10px] text-stone-550 max-w-xs mx-auto mt-0.5 leading-normal">
              Anunciantes com toras de demolição ou móveis pesados rústicos podem cadastrar itens nesta prateleira.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryWoodProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="relative group">
                {/* Premium Banner badge */}
                <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full font-mono tracking-wider flex items-center gap-1 shadow-md">
                  <Award className="w-3 h-3 text-amber-100" />
                  <span>PREMIUM WOOD</span>
                </div>
                <CardProduto product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Complete unified social catalog search section */}
      <section id="catalogo-feed" className="pt-4 border-t border-stone-200">
        <div className="space-y-6">
          
          {/* Header block with category filters */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-eco-sage font-mono tracking-widest uppercase block">
                Navegação Unificada por Categoria
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Catalogo Integral EcoFlow
              </h2>
              <p className="text-stone-500 text-xs leading-relaxed max-w-md">
                Utilize as abas rápidas abaixo para fazer buscas seletivas e achar projetos específicos da nossa comunidade de artesãos.
              </p>
            </div>

            {/* Category selection bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
              {categoryTabs.map((catName) => (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-bold font-mono tracking-tight transition-all duration-300 border cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === catName
                      ? 'bg-eco-forest border-eco-forest text-white shadow-xs'
                      : 'bg-white border-eco-amber text-stone-605 hover:bg-stone-50 hover:text-eco-forest'
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>
          </div>

          {/* Card feed listing */}
          {filteredFeed.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-eco-amber/60 p-6">
              <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-stone-850">Nenhum projeto listado nesta categoria</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-normal">
                Seja o pioneiro a cadastrar um projeto criativo de {selectedCategory} na nossa rede!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeed.map((prod) => (
                <div key={prod.id}>
                  <CardProduto product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
