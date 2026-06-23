/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { CardProduto } from '../components/CardProduto';
import { CATEGORIES } from '../data/mockData';
import { Search, Filter, SlidersHorizontal, Eye, Star, Sparkles, TrendingUp, Calendar, Undo2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Explorar: React.FC = () => {
  const { products } = useEco();
  const location = useLocation();

  // Route URL queries
  const getQueryParam = (name: string) => {
    return new URLSearchParams(location.search).get(name);
  };

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [showFilters, setShowFilters] = useState(false);
  const [onlyPremiumWood, setOnlyPremiumWood] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent'>('all');

  // Trigger search term if query loaded from Navbar
  useEffect(() => {
    const q = getQueryParam('q');
    if (q) {
      setSearchTerm(q);
    }
    const cat = getQueryParam('cat');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [location.search]);

  // Unique list of materials from mock database
  const availableMaterials = Array.from(new Set(products.map((p) => p.material)));

  // Filter application
  let filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesMaterial = selectedMaterial ? p.material === selectedMaterial : true;
    const matchesPrice = p.price <= maxPrice;
    const matchesPremiumWood = onlyPremiumWood ? p.isPremiumWood === true : true;
    const matchesActive = !p.isInactive;

    return matchesSearch && matchesCategory && matchesMaterial && matchesPrice && matchesPremiumWood && matchesActive;
  });

  // Tab sort ordering
  if (activeTab === 'popular') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.likesCount - a.likesCount);
  } else if (activeTab === 'recent') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setMaxPrice(4000);
    setOnlyPremiumWood(false);
    setActiveTab('all');
  };

  return (
    <div id="explorar-page" className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-3xl font-extrabold text-eco-forest leading-none">
          Explorar Projetos de Reciclagem
        </h1>
        <p className="text-xs text-stone-550 leading-relaxed font-sans">
          Descubra criações revolucionárias feitas a partir de garrafas PET, garrafas de vidro, pneus, papelão, latas e tecidos reaproveitados. Apoie a economia circular!
        </p>
      </header>

      {/* HORIZONTAL CATEGORY STRIP (Sugerido para maior fluidez e design moderno) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
          <span>Filtragem Rápida por Categoria</span>
          <span className="text-eco-forest whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-md font-extrabold">
            {filteredProducts.length} itens encontrados
          </span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-2xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
              selectedCategory === ''
                ? 'bg-eco-forest text-white border-eco-forest'
                : 'bg-white text-stone-605 border-stone-200/80 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Todos os Projetos ({products.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-2xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  isSelected
                    ? 'bg-eco-forest text-white border-eco-forest'
                    : 'bg-white text-stone-605 border-stone-200/80 hover:bg-stone-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search Bar + Filters panel toggle */}
      <section className="bg-white border border-stone-200/60 p-4 rounded-3xl shadow-xs space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por título, artesão, matéria-prima ou palavra-chave..."
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 bg-stone-50 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-sage/25 focus:border-eco-sage transition-all text-stone-700 font-medium"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 p-0.5 bg-stone-200 text-stone-600 rounded-full hover:bg-stone-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border text-stone-700 transition-all text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer ${
              showFilters ? 'bg-amber-50 border-eco-wood/30 text-eco-wood' : 'border-stone-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros Avançados</span>
          </button>
        </div>

        {/* Filter Drawer containing advanced controls */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-4 gap-5"
            >
              {/* Category dropdown selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide font-mono">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-xs px-3.5 py-2.5 rounded-xl text-stone-700 w-full focus:outline-none focus:ring-1 focus:ring-eco-sage"
                >
                  <option value="">Todas as Categorias</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide font-mono">Matéria-Prima</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-xs px-3.5 py-2.5 rounded-xl text-stone-700 w-full focus:outline-none focus:ring-1 focus:ring-eco-sage"
                >
                  <option value="">Todas as Matérias-Primas</option>
                  {availableMaterials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price slider scale input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide font-mono">Preço Máximo</label>
                  <span className="text-xs font-bold text-eco-wood">
                    {maxPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="4000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-eco-wood cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[8px] text-stone-400 font-mono">
                  <span>R$ 50</span>
                  <span>R$ 4.000</span>
                </div>
              </div>

              {/* Extra toggles like "Apenas Madeira Sustentável" */}
              <div className="flex flex-col gap-3 justify-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyPremiumWood}
                    onChange={(e) => setOnlyPremiumWood(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-stone-300 text-eco-wood focus:ring-eco-sage accent-eco-wood"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-stone-850 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                      Apenas Madeira de Reuso
                    </span>
                    <span className="text-[9px] text-stone-400 leading-none">Demolição, pallets e resgate</span>
                  </div>
                </label>

                {/* Reset button inside filters section */}
                <button
                  onClick={clearAllFilters}
                  className="text-left text-[11px] font-bold text-rose-600 hover:text-rose-750 flex items-center gap-1 transition-colors px-1 shrink-0 width-fit cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Limpar Filtros</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Sorting Tabs indicators (All, Popular, Recent) */}
      <div className="flex gap-2.5 border-b border-stone-200/80 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-eco-forest text-white shadow-xs'
              : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
          }`}
        >
          <span>Todos os Resultados</span>
        </button>

        <button
          onClick={() => setActiveTab('popular')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'popular'
              ? 'bg-eco-forest text-white shadow-xs'
              : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Mais Curtidos (Populares)</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'recent'
              ? 'bg-eco-forest text-white shadow-xs'
              : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mais Recentes</span>
        </button>
      </div>

      {/* Search Grid Results */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
            <Filter className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-stone-800">Nenhum eco-produto encontrado</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-normal">
              Experimente ajustar os filtros avançados, deslizar o teto do preço ou pesquisar por termos alternativos.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-eco-forest hover:bg-eco-leaf text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Exibir Tudo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id}>
                <CardProduto product={prod} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
