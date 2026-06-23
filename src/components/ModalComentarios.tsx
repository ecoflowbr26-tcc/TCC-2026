/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useEco } from '../contexts/EcoContext';
import { X, Heart, MessageCircle, MapPin, Tag, User, Trash2, CalendarHeart, ChevronLeft, ChevronRight, Bookmark, Star, Flag, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface ModalComentariosProps {
  product: Product;
  onClose: () => void;
}

export const ModalComentarios: React.FC<ModalComentariosProps> = ({ product, onClose }) => {
  const { addComment, toggleLike, toggleSave, likedProductIds, savedProductIds, currentUser, deleteProduct, addToast, addReport } = useEco();
  const [newRating, setNewRating] = useState<number>(5);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Reporting State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Produto incorreto ou enganoso');
  const [reportDetails, setReportDetails] = useState('');

  const isLiked = likedProductIds.includes(product.id);
  const isSaved = savedProductIds.includes(product.id);

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div id={`com-modal-${product.id}`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={onClose} />
      
      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] z-50"
      >
        {/* Close Button absolute top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-stone-900/80 hover:bg-stone-950 text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column Left: Visual Carrossel of Product Images */}
        <div className="md:col-span-7 bg-stone-950 relative flex items-center justify-center min-h-[300px] md:min-h-0 select-none">
          <img
            src={product.images[activeImageIdx]}
            alt={product.title}
            className="w-full h-full object-contain max-h-[40vh] md:max-h-[85vh]"
          />
          
          {/* Carrossel navigation buttons */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-xs transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-xs transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Carousel Indicators or Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/30 px-3 py-1.5 rounded-full">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === activeImageIdx ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Categoria Badge overlays */}
          <div className="absolute top-4 left-4 bg-eco-forest/85 text-white text-[10px] uppercase tracking-wider font-mono font-bold px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-md">
            {product.category}
          </div>
        </div>

        {/* Column Right: Details, specifications and Comments Roll */}
        <div className="md:col-span-5 flex flex-col h-full bg-white max-h-[50vh] md:max-h-[85vh]">
          {/* Section 1: Creator Bio info header */}
          <div className="p-4 border-b border-stone-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={product.creatorAvatar}
                alt={product.creatorName}
                className="w-10 h-10 rounded-full object-cover border border-eco-sage ring-2 ring-stone-50"
              />
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-stone-900 leading-tight">{product.creatorName}</h4>
                <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
                  <MapPin className="w-3 h-3 text-eco-wood" />
                  <span>{product.city}, {product.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Product Specifications, materials and details scrollable block */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
            <div>
              <h2 className="text-base font-bold text-eco-forest mb-1 leading-snug">{product.title}</h2>
              <span className="text-sm font-extrabold text-eco-wood">
                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <p className="text-stone-600 mt-2 leading-relaxed text-[11px] whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Material indicators */}
            <div className="bg-stone-50 rounded-xl p-3 flex flex-col gap-2 border border-stone-200/50">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Material Principal:</span>
                <span className="text-stone-850 font-semibold">{product.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Tipo de Produto:</span>
                <span className="text-stone-850 font-semibold">{product.productType}</span>
              </div>
              
              {/* Specialized section fields for "Madeira Sustentável" */}
              {product.isPremiumWood && (
                <div className="mt-2 pt-2 border-t border-stone-200/60 flex flex-col gap-1.5 bg-amber-50/40 -mx-3 -mb-3 p-3 rounded-b-xl border-dashed">
                  <p className="text-[10px] font-bold text-eco-wood uppercase tracking-wider font-mono">
                    🌳 Especificações da Madeira Reaproveitada:
                  </p>
                  <div className="flex justify-between mt-1">
                    <span className="text-stone-500">Tipo de Madeira:</span>
                    <span className="text-eco-wood font-medium font-mono">{product.woodType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Origem Florestal/Civil:</span>
                    <span className="text-stone-700 text-right truncate max-w-[150px] font-mono" title={product.woodOrigin}>
                      {product.woodOrigin || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dimensões:</span>
                    <span className="text-stone-700 font-mono">{product.dimensions || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Produção Artesanal:</span>
                    <span className="text-stone-700">{product.isArtisanal ? 'Sim (100% Manual)' : 'Semi-industrial'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Classe de Preço:</span>
                    <span className="text-eco-wood font-semibold font-mono">{product.priceRange || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Evaluations Stack */}
            <div className="border-t border-stone-100 pt-4 flex flex-col gap-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-eco-forest">
                Avaliações do Produto ({product.comments.length})
              </h5>

              {/* Dynamic Average Rating Banner */}
              <div className="bg-stone-50 rounded-2xl p-4 flex items-center justify-between border border-stone-200/60 shadow-xs">
                <div>
                  <span className="font-extrabold text-[11px] text-stone-750 block uppercase tracking-wider font-mono">Nota Geral</span>
                  <span className="text-[10px] text-stone-400 font-bold leading-none block mt-1">
                    {product.comments.length} {product.comments.length === 1 ? 'avaliação realizada' : 'avaliações realizadas'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/25">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span className="text-xs font-black text-amber-900 font-mono">
                    {product.comments && product.comments.length > 0 
                      ? (product.comments.reduce((sum, c) => sum + (c.rating || 5), 0) / product.comments.length).toFixed(1)
                      : '0.0'
                    } / 5.0
                  </span>
                </div>
              </div>
              
              {product.comments.length === 0 ? (
                <div className="text-center py-7 text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-250">
                  <Star className="w-5 h-5 mx-auto text-stone-300 mb-1" />
                  <p className="text-[11px] font-bold">Nenhuma avaliação por enquanto.</p>
                  <p className="text-[10px] text-stone-400 font-medium">Seja o primeiro a avaliar esta peça sustentável!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {product.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2.5 items-start">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-stone-100 shadow-xs"
                      />
                      <div className="flex-1 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/50">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-[10px] text-stone-900 leading-none">
                            {comment.authorName}
                          </span>
                          <span className="text-[8px] text-stone-400 font-bold">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {/* Star display */}
                        <div className="flex items-center gap-0.5 my-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <Star
                              key={starVal}
                              className={`w-3.5 h-3.5 ${
                                starVal <= (comment.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-200 fill-stone-100'
                              }`}
                            />
                          ))}
                        </div>
                        {comment.text && comment.text !== "Avaliação com estrela" && !comment.text.startsWith("Avaliou") && (
                          <p className="text-[10px] text-stone-605 leading-relaxed break-words mt-1">
                            {comment.text}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Action Drawer Likes/Interesse overlay and Comments submission */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/50 shrink-0">
            {/* Quick interactive parameters */}
            <div className="flex items-center justify-between mb-3 text-stone-500 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(product.id)}
                  className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                    isLiked ? 'text-rose-500' : ''
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-semibold text-[11px]">{product.likesCount}</span>
                </button>
                <div className="flex items-center gap-1 cursor-default text-stone-500">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-[11px]">{product.comments.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Denúncia Button */}
                <button
                  onClick={() => setIsReportOpen(!isReportOpen)}
                  className={`p-1 hover:text-red-500 transition-colors flex items-center gap-1 ${
                    isReportOpen ? 'text-red-500' : 'text-stone-400'
                  }`}
                  title="Denunciar publicação"
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Denunciar</span>
                </button>

                <button
                  onClick={() => toggleSave(product.id)}
                  className={`hover:text-amber-500 transition-colors ${
                    isSaved ? 'text-amber-500' : ''
                  }`}
                  title="Salvar produto"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Reporting Form overlay */}
            {isReportOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-3 space-y-3"
              >
                <div className="flex items-center gap-2 text-red-800">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black font-mono uppercase tracking-wider">Formulário de Denúncia</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-stone-550 block font-mono uppercase">Motivo Principal:</span>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-red-300"
                  >
                    <option value="Não é reciclável / ecológico">Não parece ser ecológico / reciclado</option>
                    <option value="Preço abusivo ou fraude">Suspeita de golpe ou preço falso</option>
                    <option value="Uso não autorizado de imagens">Imagens copiadas / direitos autorais</option>
                    <option value="Conteúdo ofensivo ou spam">Conteúdo obsceno ou spam comercial</option>
                    <option value="Outro motivo específico">Outro motivo (especifique abaixo)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-stone-550 block font-mono uppercase">Detalhes Adicionais (opcional):</span>
                  <textarea
                    rows={2}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Descreva o problema para os administradores"
                    className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs text-stone-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-red-300"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReportOpen(false);
                      setReportDetails('');
                    }}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-250 text-stone-750 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const finalReason = reportDetails.trim() ? `${reportReason}: ${reportDetails.trim()}` : reportReason;
                      addReport(product.id, product.title, finalReason, currentUser?.name || 'Membro do EcoFlow');
                      setIsReportOpen(false);
                      setReportDetails('');
                    }}
                    className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] transition-colors cursor-pointer shadow-xs"
                  >
                    Enviar Denúncia
                  </button>
                </div>
              </motion.div>
            )}

            {/* Post Rating picker */}
            {currentUser && !isReportOpen && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono block">Sua nota:</span>
                    <span className="text-[9px] text-stone-400 font-semibold italic mt-0.5 block">Selecione as estrelas abaixo e clique em Avaliar</span>
                  </div>
                  <div className="flex gap-1.5 font-sans">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-115 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5.5 h-5.5 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 fill-stone-105'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Rating Button with absolutely NO text input */}
            {currentUser && !isReportOpen && (
              <button
                type="button"
                onClick={() => {
                  addComment(product.id, "Avaliação com estrela", newRating);
                  addToast(`Você avaliou este produto com ${newRating} estrelas!`, 'success');
                }}
                className="w-full py-3 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl transition-all shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Enviar Avaliação ({newRating} Estrelas)</span>
              </button>
            )}

            {!currentUser && !isReportOpen && (
              <div className="bg-stone-100/80 text-center py-2.5 rounded-xl border border-stone-200">
                <p className="text-[10px] text-stone-500 font-bold font-mono">FAÇA LOGIN PARA PODER AVALIAR</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
