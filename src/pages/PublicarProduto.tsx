/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { CATEGORIES, BRAZIL_STATES } from '../data/mockData';
import { Category } from '../types';
import { Plus, Trash2, ArrowUpCircle, Image, Sparkles, MapPin, DollarSign, Trees, Info, Upload } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicarProduto: React.FC = () => {
  const { addProduct, currentUser, addToast } = useEco();
  const navigate = useNavigate();

  // Redirect if logged out
  React.useEffect(() => {
    if (!currentUser) {
      addToast('Faça login ou cadastre-se para poder publicar.', 'info');
      navigate('/login');
    }
  }, [currentUser]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Reciclados Criativos');
  const [material, setMaterial] = useState('');
  const [productType, setProductType] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'Curitiba');
  const [state, setState] = useState(currentUser?.state || 'PR');
  
  // Multiple Image URL Management list
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [isDragging, setIsDragging] = useState(false);

  // Helper file uploader
  const handleImageUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Por favor, envie apenas arquivos de imagem válida.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const base64 = evt.target.result as string;
        setImageUrls((prev) => {
          // If the first input is empty, overwrite it, otherwise append
          if (prev.length === 1 && prev[0].trim() === '') {
            return [base64];
          }
          return [...prev, base64];
        });
        addToast('Foto adicionada com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Special premium wood fields state
  const [woodType, setWoodType] = useState('');
  const [woodOrigin, setWoodOrigin] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [isArtisanal, setIsArtisanal] = useState(true);
  const [priceRange, setPriceRange] = useState('');

  // Custom product contact details
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactInstagram, setContactInstagram] = useState('');
  const [contactFacebook, setContactFacebook] = useState('');
  const [socialPostUrl, setSocialPostUrl] = useState('');

  // Built-in presets for quick demonstration publishing
  const PRESET_IDEAS = [
    {
      title: 'Luminária de Mesa Lotus de Garrafa PET',
      description: 'Luminária ecológica contemporânea feita a partir de 6 garrafas PET transparentes devidamente higienizadas e moldadas artisticamente sob calor brando. Fornece iluminação acolhedora e furações decorativas vazadas.',
      category: 'Reciclados Criativos' as Category,
      material: 'Garrafas PET Descartadas',
      productType: 'Luminária',
      price: '95.00',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      woodType: '',
      woodOrigin: '',
      dimensions: '30cm de Altura',
      priceRange: 'R$ 90 - R$ 110'
    },
    {
      title: 'Ecobag Boho de Jeans & Tecido de Reuso',
      description: 'Sacola ecobag super resistente confeccionada pela técnica de upcycling de patchwork com retalhos denim industriais e forração interna de lençóis higienizados. Perfeita para feiras livres e compras conscientes.',
      category: 'Moda Sustentável' as Category,
      material: 'Jeans e Tecido Reaproveitados',
      productType: 'Bolsa Ecobag',
      price: '78.00',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      woodType: '',
      woodOrigin: '',
      dimensions: '40 x 35 cm',
      priceRange: 'R$ 70 - R$ 85'
    }
  ];

  const handleAddImageUrlInput = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrlInput = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const handleImageUrlChange = (idx: number, value: string) => {
    const updated = [...imageUrls];
    updated[idx] = value;
    setImageUrls(updated);
  };

  const handleApplyPreset = (p: typeof PRESET_IDEAS[0]) => {
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setMaterial(p.material);
    setProductType(p.productType);
    setPrice(p.price);
    setImageUrls([p.image]);
    setWoodType(p.woodType);
    setWoodOrigin(p.woodOrigin);
    setDimensions(p.dimensions);
    setPriceRange(p.priceRange);
    addToast(`Preset "${p.title}" preenchido com sucesso!`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !material.trim() || !productType.trim() || !price || !city.trim() || !state.trim()) {
      addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    // Filter valid images, fall back if empty
    const validImages = imageUrls.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      validImages.push('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast('Insira um preço válido maior do que zero.', 'error');
      return;
    }

    const isWoodSelection = category === 'Madeira Sustentável' || category === 'Móveis Sustentáveis';

    addProduct({
      title,
      description,
      category,
      material,
      productType,
      price: priceNum,
      images: validImages,
      city,
      state: state.toUpperCase(),
      contactWhatsapp: contactWhatsapp.trim() || undefined,
      contactInstagram: contactInstagram.trim() || undefined,
      contactFacebook: contactFacebook.trim() || undefined,
      socialPostUrl: socialPostUrl.trim() || undefined,
      // Premium Wood specific properties
      isPremiumWood: isWoodSelection,
      woodType: isWoodSelection ? (woodType || 'Pinho Orgânico') : undefined,
      woodOrigin: isWoodSelection ? (woodOrigin || 'Sobras de Marcenaria Local') : undefined,
      isArtisanal,
      dimensions: isWoodSelection ? (dimensions || 'Variável') : undefined,
      priceRange: isWoodSelection ? (priceRange || 'Sob Consulta') : undefined
    });

    navigate('/feed');
  };

  return (
    <div id="publicar-produto-page" className="max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Intro Context header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-3xl font-extrabold text-eco-forest leading-none">
          Publicar Novo Projeto de Reciclagem
        </h1>
        <p className="text-xs text-stone-550 leading-relaxed font-sans">
          Mostre ao mundo como você ressignificou resíduos! Compartilhe fotos do seu projeto de garrafa PET, vidro, latas, tampinhas, papelão, pneus ou tecidos de reuso.
        </p>
      </div>

      {/* Recommended ideas helper block */}
      <section className="bg-amber-50/50 border border-amber-250/35 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <p className="text-xs font-bold text-eco-wood flex items-center gap-1">
            <Info className="w-4 h-4 text-eco-wood" /> Ideias de Publicações Rápidas
          </p>
          <p className="text-[11px] text-stone-605">
            Gostaria de poupar tempo no teste? Clique em um de nossos presets rápidos de demonstração para preencher o formulário automaticamente.
          </p>
        </div>

        <div className="flex gap-2 max-w-full overflow-x-auto pb-1 sm:pb-0 shrink-0">
          {PRESET_IDEAS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="bg-white border border-amber-200 text-[10px] font-bold text-stone-750 px-3 py-1.5 rounded-lg hover:bg-amber-100/50 transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              🚀 Pres.: {preset.productType}
            </button>
          ))}
        </div>
      </section>

      {/* Main product submission form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-medium">
        
        {/* Left Column: Visual uploads and media presets */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/60 p-5 space-y-4 select-none animate-fade-in">
            <h3 className="font-bold text-xs uppercase tracking-wider text-eco-forest border-b pb-2 mb-2 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-eco-sage" /> Visual do Produto
            </h3>
            
            <p className="text-[11px] text-stone-500 leading-normal mb-2">
              Envie fotos de alta qualidade do seu produto reciclado na zona abaixo ou cole links da internet. Suporta múltiplas imagens de carrossel.
            </p>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = Array.from(e.dataTransfer.files);
                files.forEach(handleImageUpload);
              }}
              className={`p-5 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                isDragging 
                  ? 'border-eco-forest bg-eco-forest/5' 
                  : 'border-stone-250 hover:border-eco-sage bg-stone-50/50'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(handleImageUpload);
                  }
                }}
                className="hidden"
                id="product-file-upload-input"
              />
              <label htmlFor="product-file-upload-input" className="cursor-pointer block space-y-2">
                <Upload className="w-6 h-6 text-eco-forest mx-auto" />
                <p className="text-[10px] font-bold text-stone-650">
                  Arraste fotos aqui ou <span className="text-eco-forest underline">clique para selecionar</span>
                </p>
                <p className="text-[8px] text-stone-400">Suporta múltiplos arquivos PNG, JPEG ou WEBP de uma vez.</p>
              </label>
            </div>

            {/* Thumbnail PREVIEW Block */}
            {imageUrls.filter(url => url.trim() !== '').length > 0 && (
              <div className="space-y-1.5 bg-stone-50/55 p-3 rounded-2xl border border-stone-200/60">
                <p className="font-bold text-stone-600 text-[10px] uppercase font-mono tracking-wide">Fotos Adicionadas ({imageUrls.filter(url => url.trim() !== '').length}):</p>
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, idx) => {
                    if (!url.trim()) return null;
                    return (
                      <div key={idx} className="relative group/thumb w-14 h-14 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrlInput(idx)}
                          className="absolute inset-0 bg-stone-900/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white"
                          title="Remover imagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-0 right-0 bg-black/50 text-white text-[7.5px] font-bold px-1 rounded-tl-md">
                          #0{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Manual URL Collapse Section as Bonus/Backup option */}
            <details className="text-[10.5px] text-stone-500 bg-stone-50 p-2.5 rounded-xl cursor-pointer">
              <summary className="font-bold text-stone-600">Ver e gerenciar as URLs manualmente</summary>
              <div className="space-y-2 mt-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-1.5 items-center">
                    <span className="text-[8.5px] text-stone-400 font-mono">#0{idx + 1}</span>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-2.5 py-1.5 border border-stone-200 bg-white rounded text-[9.5px] focus:outline-none overflow-hidden text-ellipsis"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrlInput(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImageUrlInput}
                  className="w-full py-1.5 border border-dashed border-stone-200 hover:border-eco-sage rounded-xl flex items-center justify-center gap-1 text-eco-forest hover:bg-white font-bold transition-all text-[9.5px] mt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Mais Link</span>
                </button>
              </div>
            </details>
          </div>

          {/* Quick placeholder help box showing high-quality reference links */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <h4 className="font-bold text-stone-705 mb-1 text-[11px]">Dica de Fotos em Alta Resolução</h4>
            <p className="text-[10px] text-stone-450 leading-relaxed">
              Você pode usar fotos incríveis do portal Unsplash como referência. Copie os links curtos clicando com o botão direito nas fotos do site e inserindo acima!
            </p>
          </div>
        </div>

        {/* Right Column: Text inputs, categories and spatial options */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/60 p-6 space-y-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-eco-forest border-b pb-2 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-eco-sage" /> Informações Básicas
          </h3>

          <div className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="font-bold text-stone-600 block">Título do Produto *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Exemplo: Cadeira Tora Orgânica Rústica"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750 font-semibold"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-bold text-stone-605 block">Descrição do Produto e Conceito Coletivo *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fale das furações, estado de conservação do galho, do acabamento com selador atóxico natural ou das técnicas artesanais empregadas..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-700 leading-relaxed font-sans"
              />
            </div>

            {/* Category selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-705 cursor-pointer leading-none0"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product type */}
              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">Tipo do Produto *</label>
                <input
                  type="text"
                  required
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="Exemplo: Mesa, Banqueta, Vaso, Luminária"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700"
                />
              </div>
            </div>

            {/* Pricing + material inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-650 block">Mão de Obra e Preço R$ *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250.00"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-bold"
                  />
                  <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">Matéria-Prima Predominante *</label>
                <input
                  type="text"
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ex: Tora de Canela Caída, Algodão Reciclado"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-semibold"
                />
              </div>
            </div>

            {/* Geographical localization of production */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">Cidade Fabricação *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Curitiba"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700"
                  />
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">Estado (UF) *</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="PR"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 uppercase"
                />
              </div>
            </div>

            {/* Expanded properties ONLY if category matches Timber sections */}
            {(category === 'Madeira Sustentável' || category === 'Móveis Sustentáveis') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-dashed border-amber-300 space-y-4"
              >
                <h4 className="font-bold text-xs text-eco-wood font-mono uppercase tracking-wide flex items-center gap-1">
                  <Trees className="w-4 h-4 text-eco-sage" /> Rastreamento de Madeira de Reuso Nobre
                </h4>
                
                <p className="text-[10px] text-stone-500 leading-normal leading-relaxed">
                  Para podermos publicar este item com o selo premium **"Premium Wood"** em nossa Home, preencha a biografia e mensurações da tora:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-605 text-[9.5px]">Tipo da Madeira (Ex: Peroba, Canela)</label>
                    <input
                      type="text"
                      value={woodType}
                      onChange={(e) => setWoodType(e.target.value)}
                      placeholder="Ex: Peroba Amarela de Demolição"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-605 text-[9.5px]">Origem (Galpão, Demolição, Reflorestamento)</label>
                    <input
                      type="text"
                      value={woodOrigin}
                      onChange={(e) => setWoodOrigin(e.target.value)}
                      placeholder="Ex: Antigo Barracão de Cargas da Fepasa"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-605 text-[9.5px]">Dimensões do Móvel (AxLxP)</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="Ex: 120 x 80 x 75 cm"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-605 text-[9.5px]">Faixa Estimada de Preço Coletivo</label>
                    <input
                      type="text"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="Ex: R$ 850 - R$ 980"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 font-sans">
                  <input
                    type="checkbox"
                    id="isArtisanalBox"
                    checked={isArtisanal}
                    onChange={(e) => setIsArtisanal(e.target.checked)}
                    className="w-4 h-4 rounded text-eco-wood accent-eco-wood"
                  />
                  <label htmlFor="isArtisanalBox" className="text-[10px] font-bold text-stone-650 cursor-pointer">
                    Este item foi feito 100% de forma manual ou artesanal (Corte, polimento e tratamento artesanal).
                  </label>
                </div>
              </motion.div>
            )}

            {/* Meios de Contato do Produto */}
            <div className="bg-stone-50/70 border border-stone-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-eco-wood rounded-full" />
                <h4 className="font-bold text-[11px] text-stone-700 uppercase tracking-wide">Meios de Contato Desse Produto</h4>
              </div>
              <p className="text-[10px] text-stone-400 font-medium">
                Se desejar, adicione canais de contato específicos para este produto. 
                <span className="text-eco-forest font-bold"> Se deixar em branco, o sistema usará automaticamente os contatos do seu perfil de vendedor.</span>
              </p>

              <div className="space-y-2.5">
                <div>
                  <label className="font-bold text-stone-550 block mb-0.5">WhatsApp do Produto (Somente números com DDD)</label>
                  <input
                    type="text"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ex: 5541999999999"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-eco-sage text-[11px] text-stone-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-stone-550 block mb-0.5 font-mono">Instagram (Sem @)</label>
                    <input
                      type="text"
                      value={contactInstagram}
                      onChange={(e) => setContactInstagram(e.target.value.replace(/^@/, ''))}
                      placeholder="Ex: seu_atelie"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-eco-sage text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-550 block mb-0.5 font-mono">Facebook</label>
                    <input
                      type="text"
                      value={contactFacebook}
                      onChange={(e) => setContactFacebook(e.target.value)}
                      placeholder="Ex: facebook_atelie"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-eco-sage text-[11px]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-stone-550 block mb-0.5">Link da Publicação do Produto em sua Rede Social (Instagram, TikTok, etc.)</label>
                  <input
                    type="url"
                    value={socialPostUrl}
                    onChange={(e) => setSocialPostUrl(e.target.value)}
                    placeholder="Ex: https://www.instagram.com/p/C_abcde123/"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-eco-sage text-[11px] text-stone-700 font-semibold"
                  />
                  <p className="text-[9px] text-stone-400 mt-1 leading-normal">
                    Seus compradores poderão clicar em um botão dedicado no card para visitar este post original na sua rede social, onde podem ver vídeos, comentários, curtir e interagir!
                  </p>
                </div>
              </div>
            </div>

            {/* Submission triggers */}
            <button
              type="submit"
              className="w-full py-3.5 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl transition-all shadow-md mt-6 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowUpCircle className="w-5 h-5" />
              <span>Publicar Código de Impacto</span>
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};
