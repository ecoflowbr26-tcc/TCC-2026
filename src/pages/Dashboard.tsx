/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEco } from '../contexts/EcoContext';
import { Product, Comment } from '../types';
import { LayoutDashboard, Award, Hammer, HardHat, Heart, MessageSquare, Trees, Trash2, Edit2, BarChart2, CheckCircle, Eye, AlertCircle, X, Check, DollarSign, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { products, currentUser, updateProduct, deleteProduct, addToast } = useEco();
  
  // State for tracking custom editing modal/drawer
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Editing form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMaterial, setEditMaterial] = useState('');
  const [editWoodType, setEditWoodType] = useState('');
  const [editWoodOrigin, setEditWoodOrigin] = useState('');
  const [editDimensions, setEditDimensions] = useState('');

  if (!currentUser) {
    return (
      <div id="require-auth-dashboard" className="text-center py-20 bg-white border border-stone-250/50 rounded-3xl p-6">
        <LayoutDashboard className="w-12 h-12 text-stone-300 mx-auto mb-2" />
        <h3 className="font-extrabold text-sm text-stone-850">Acesso Restrito ao Painel</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4 leading-normal">
          Para monitorar seu faturamento, organizar curtidas de seus clientes rústicos e responder depoimentos, realize login.
        </p>
        <button
          onClick={() => window.location.hash = '/login'}
          className="px-5 py-2.5 bg-eco-forest hover:bg-eco-leaf text-white text-xs font-bold rounded-full shadow-md cursor-pointer"
        >
          Entrar com a minha Conta
        </button>
      </div>
    );
  }

  // Filter listings belonging strictly to the registered user
  const myProducts = products.filter((p) => p.creatorId === currentUser.id);

  // Aggregating statistics metrics
  const totalPosts = myProducts.length;
  const totalLikes = myProducts.reduce((sum, p) => sum + p.likesCount, 0);
  const totalCommentsCount = myProducts.reduce((sum, p) => sum + p.comments.length, 0);
  const totalInterestsCount = myProducts.reduce((sum, p) => sum + p.interestsCount, 0);
  const totalValueGained = myProducts.reduce((sum, p) => sum + (p.price * (p.interestsCount || 1)), 0);

  // Aggregate all interactive comments received
  const receivedComments: { comment: Comment; productTitle: string; productId: string }[] = [];
  myProducts.forEach((prod) => {
    prod.comments.forEach((comm) => {
      receivedComments.push({
        comment: comm,
        productTitle: prod.title,
        productId: prod.id
      });
    });
  });

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditDescription(p.description);
    setEditPrice(p.price.toString());
    setEditMaterial(p.material);
    setEditWoodType(p.woodType || '');
    setEditWoodOrigin(p.woodOrigin || '');
    setEditDimensions(p.dimensions || '');
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast('Por favor, informe um preço numérico válido e maior que zero.', 'error');
      return;
    }

    updateProduct(editingProduct.id, {
      title: editTitle,
      description: editDescription,
      price: priceNum,
      material: editMaterial,
      woodType: editingProduct.isPremiumWood ? editWoodType : undefined,
      woodOrigin: editingProduct.isPremiumWood ? editWoodOrigin : undefined,
      dimensions: editingProduct.isPremiumWood ? editDimensions : undefined,
    });

    setEditingProduct(null);
  };

  const handleDeleteWithPrompt = (id: string, name: string) => {
    if (window.confirm(`Tem certeza absoluta de que deseja remover e ocultar permanentemente o eco-produto "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div id="creator-dashboard-page" className="space-y-8 select-none">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-eco-forest leading-none">
            Meu Escritório Ecológico
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed font-sans mt-1">
            Analise seu engajamento com a comunidade, edite dados técnicos de marcenaria ou confira feedbacks de clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {myProducts.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Tem certeza de que deseja limpar TODOS os seus produtos publicados? Esta ação removerá permanentemente suas peças do catálogo público.')) {
                  myProducts.forEach((p) => deleteProduct(p.id));
                  addToast('Suas publicações foram impas e limpas do portal!', 'success');
                }
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 font-bold rounded-2xl transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Meus Produtos Postados</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 border border-emerald-150 rounded-2xl">
            <HardHat className="w-4 h-4 text-eco-leaf shrink-0" />
            <div className="text-[10px] leading-tight font-semibold text-emerald-900">
              <span>Produtor Parceiro: </span>
              <span className="font-bold underline text-eco-forest">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 shadow-xs space-y-1">
          <p className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider">Total Publicado</p>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-lg sm:text-2xl font-extrabold text-stone-900">{totalPosts}</span>
            <span className="text-[10px] bg-sky-50 text-sky-650 px-2 py-0.5 font-bold rounded-md">Peças</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 shadow-xs space-y-1">
          <p className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider">Carinho Recebido</p>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-lg sm:text-2xl font-extrabold text-stone-900">{totalLikes}</span>
            <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 font-bold rounded-md flex items-center gap-0.5">
              <Heart className="w-3 h-3 fill-current" /> Curtidas
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 shadow-xs space-y-1">
          <p className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider">Avaliações</p>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-lg sm:text-2xl font-extrabold text-stone-900">{totalCommentsCount}</span>
            <span className="text-[10px] bg-amber-50 text-amber-650 px-2 py-0.5 font-bold rounded-md flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Notas
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 shadow-xs space-y-1">
          <p className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider">Leads de Interesse</p>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-lg sm:text-2xl font-extrabold text-stone-900">{totalInterestsCount}</span>
            <span className="text-[10px] bg-amber-50 text-eco-wood px-2 py-0.5 font-bold rounded-md">Contatos</span>
          </div>
        </div>

      </section>

      {/* Main split: left manage pieces table, right received feedback list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-semibold">
        
        {/* Left Side: Publications Management Cabinet */}
        <div className="lg:col-span-8 bg-white border border-stone-200/60 rounded-3xl p-5 shadow-xs space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-eco-forest border-b pb-3 flex items-center gap-1.5 mb-2">
            <Hammer className="w-4 h-4 text-eco-sage" /> Gerenciamento de Portfólio ({myProducts.length})
          </h3>

          {myProducts.length === 0 ? (
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
              <p className="font-bold text-stone-800">Seu portfólio está vazio</p>
              <p className="text-[10px] text-stone-500 max-w-xs mx-auto leading-relaxed mt-0.5">
                Faça uma publicação preenchendo todos os dados técnicos de resgate para começar a coletar estatísticas de interesse.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] uppercase text-stone-400 tracking-wider font-mono">
                    <th className="pb-3.5 pl-1.5">Produto</th>
                    <th className="pb-3.5">Categoria</th>
                    <th className="pb-3.5">Preço</th>
                    <th className="pb-3.5 text-center">Cliques / Leads</th>
                    <th className="pb-3.5 text-right pr-2">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[11px] font-sans">
                  {myProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-eco-cream/50 transition-colors">
                      {/* Name with square thumbnail */}
                      <td className="py-3.5 pl-1.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-100"
                            alt={p.title}
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate max-w-[170px] leading-snug">{p.title}</p>
                            <span className="text-[10px] font-mono font-medium text-stone-405 block -mt-0.5">{p.material}</span>
                          </div>
                        </div>
                      </td>

                      {/* Cat */}
                      <td className="py-3.5 text-stone-550 font-bold font-sans">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 text-stone-850 font-bold font-mono">
                        {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      {/* Interests */}
                      <td className="py-3.5 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50 text-eco-wood px-2.5 py-1 rounded-full font-mono font-bold border border-amber-200/40">
                          <span>{p.interestsCount || 0}</span>
                        </div>
                      </td>

                      {/* Controls */}
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="p-2 text-stone-500 hover:text-eco-forest hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar especificações"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteWithPrompt(p.id, p.title)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Excluir do catálogo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Feedback Roll of Received Comments */}
        <div className="lg:col-span-4 bg-white border border-stone-200/60 rounded-3xl p-5 shadow-xs space-y-4 max-h-[500px] overflow-y-auto">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-eco-forest border-b pb-3 flex items-center gap-1.5 mb-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Avaliações ({receivedComments.length})
          </h3>

          {receivedComments.length === 0 ? (
            <div className="text-center py-10 text-stone-400 leading-normal">
              <p className="text-[11px]">Nenhuma avaliação por enquanto.</p>
              <p className="text-[10px] mt-0.5">As avaliações recebidas nos seus produtos vão aparecer listadas aqui!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {receivedComments.map((record, index) => (
                <div key={index} className="space-y-1.5 p-3.5 bg-stone-50 rounded-xl border border-stone-205/40 text-[11px] leading-relaxed">
                  <div className="flex items-center gap-2">
                    <img
                      src={record.comment.authorAvatar}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-150"
                      alt={record.comment.authorName}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate leading-none">{record.comment.authorName}</p>
                      <span className="text-[8.5px] text-stone-400">Avaliou: <span className="underline italic text-eco-wood font-medium">{record.productTitle}</span></span>
                    </div>
                  </div>
                  
                  {/* Star display */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <Star
                        key={starVal}
                        className={`w-3 h-3 ${
                          starVal <= (record.comment.rating || 5)
                            ? 'fill-amber-450 text-amber-400'
                            : 'text-stone-200 fill-stone-100'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-stone-650 leading-normal text-[10.5px] font-sans pl-1 border-l-2 border-eco-sage/40">
                    "{record.comment.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Editing Dialog Modal overlay */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-xs shadow-xl" onClick={() => setEditingProduct(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden z-50 p-6 space-y-6 text-xs max-h-[90vh] overflow-y-auto"
            >
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-eco-wood" />
                  <h3 className="text-sm font-extrabold text-eco-forest uppercase tracking-wider font-mono">Editar Peça</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-stone-400 hover:text-stone-750 hover:bg-stone-50 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form editing sheet */}
              <form onSubmit={handleSaveEditSubmit} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-600 block">Título do Produto *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-605 block">Descrição Técnica *</label>
                  <textarea
                    required
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 block">Preço Cobrado R$ *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  {/* Material */}
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 block">Matéria-Prima Predominante *</label>
                    <input
                      type="text"
                      required
                      value={editMaterial}
                      onChange={(e) => setEditMaterial(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Specialized specs if wood carving */}
                {editingProduct.isPremiumWood && (
                  <div className="bg-amber-50/50 rounded-xl p-4 border border-dashed border-amber-300 space-y-3">
                    <p className="text-[10px] font-bold text-eco-wood font-mono uppercase tracking-wide">🌳 Características da Madeira Ecológica</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-stone-500 block text-[9px] mb-0.5">Tipo de Madeira</label>
                        <input
                          type="text"
                          value={editWoodType}
                          onChange={(e) => setEditWoodType(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-500 block text-[9px] mb-0.5">Dimensões (AxLxP)</label>
                        <input
                          type="text"
                          value={editDimensions}
                          onChange={(e) => setEditDimensions(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-500 block text-[9px] mb-0.5">Local Relatado de Resgate / Demolição</label>
                      <input
                        type="text"
                        value={editWoodOrigin}
                        onChange={(e) => setEditWoodOrigin(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px]"
                      />
                    </div>
                  </div>
                )}

                {/* Confirm actions */}
                <div className="flex gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 border border-stone-250 text-stone-605 font-bold rounded-xl text-center cursor-pointer hover:bg-stone-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
