/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useEco } from '../contexts/EcoContext';
import { Heart, MessageCircle, Share2, MapPin, Sparkles, ChevronLeft, ChevronRight, Bookmark, Instagram, Facebook, Camera, Star } from 'lucide-react';
import { ModalComentarios } from './ModalComentarios';
import { ModalCompartilhar } from './ModalCompartilhar';
import { ModalEditarFotos } from './ModalEditarFotos';
import { AnimatePresence } from 'motion/react';

interface CardProdutoProps {
  product: Product;
}

export const CardProduto: React.FC<CardProdutoProps> = ({ product }) => {
  const { toggleLike, toggleSave, expressInterest, updateProduct, likedProductIds, savedProductIds, interestedProductIds, users, currentUser } = useEco();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditPhotosOpen, setIsEditPhotosOpen] = useState(false);

  const safeLikedIds = Array.isArray(likedProductIds) ? likedProductIds : [];
  const safeSavedIds = Array.isArray(savedProductIds) ? savedProductIds : [];
  const safeInterestedIds = Array.isArray(interestedProductIds) ? interestedProductIds : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const isLiked = safeLikedIds.includes(product.id);
  const isSaved = safeSavedIds.includes(product.id);
  const isInterested = safeInterestedIds.includes(product.id);

  const creator = safeUsers.find((u) => u.id === product.creatorId);
  const finalWhatsapp = product.contactWhatsapp || creator?.contactWhatsapp;
  const finalInstagram = product.contactInstagram || creator?.contactInstagram;
  const finalFacebook = product.contactFacebook || creator?.contactFacebook;

  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=600&auto=format&fit=crop'];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const calculateDaysAgo = (isoString: string) => {
    const created = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    return `Ha ${diffDays} dias`;
  };

  return (
    <>
      <article
        id={`product-card-${product.id}`}
        className="group bg-white rounded-3xl border border-eco-amber/60 overflow-hidden shadow-xs hover:shadow-md hover:border-eco-sage/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5"
      >
        {/* Card Header: Creator Info */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={product.creatorAvatar}
              alt={product.creatorName}
              className="w-8.5 h-8.5 rounded-full object-cover border border-eco-sage ring-2 ring-eco-sand"
            />
            <div className="flex flex-col min-w-0">
              <h4 className="text-[11px] font-bold text-stone-900 truncate leading-snug group-hover:text-eco-forest transition-colors">
                {product.creatorName}
              </h4>
              <div className="flex items-center gap-1 text-[9px] text-stone-500 font-medium">
                <MapPin className="w-3 h-3 text-eco-wood" />
                <span className="truncate">{product.city}, {product.state}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 select-none">
            {currentUser && currentUser.id === product.creatorId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditPhotosOpen(true);
                }}
                className="px-2 py-1 bg-stone-50 hover:bg-eco-forest text-stone-600 hover:text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs border border-stone-200"
                title="Editar Fotos deste Produto"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Editar Fotos</span>
              </button>
            )}
            <div className="text-[9px] font-mono text-stone-400 font-bold uppercase">
              {calculateDaysAgo(product.createdAt)}
            </div>
          </div>
        </div>

        {/* Card Media: Multi Image Frame */}
        <div className="relative aspect-square w-full overflow-hidden bg-eco-sand group-hover:brightness-[1.01] transition-all">
          <img
            src={productImages[activeImageIdx]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />

          {/* Sold Overlay */}
          {product.isSold && (
            <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-center z-10">
              <span className="bg-amber-500 text-stone-950 font-black text-xs sm:text-sm font-mono tracking-widest px-4 py-2 rounded-2xl shadow-xl transform -rotate-2 animate-pulse">
                VENDIDO / ESGOTADO
              </span>
              <span className="text-[10px] text-stone-200 mt-1.5 font-mono uppercase tracking-wider font-bold">Unindo Design e Consciencia</span>
            </div>
          )}

          {/* Inactive Overlay (visible to owner on profile) */}
          {!product.isSold && product.isInactive && (
            <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-center z-10">
              <span className="bg-red-600 text-white font-black text-xs sm:text-sm font-mono tracking-widest px-4 py-2 rounded-2xl shadow-xl">
                INATIVADO PELO VENDEDOR
              </span>
              <span className="text-[9px] text-stone-300 mt-1.5 font-mono uppercase tracking-widest font-bold">Invisivel para o publico</span>
            </div>
          )}

          {/* Overlay Tag: Material type */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-eco-amber text-[10px] font-bold text-eco-forest px-3 py-1 rounded-full shadow-xs">
            {product.material}
          </div>

          {/* Premium Wood Star Emblem */}
          {product.isPremiumWood && (
            <div className="absolute top-3 right-3 bg-eco-forest text-white text-[9px] uppercase tracking-wider font-mono font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current text-white/90" />
              <span>Premium Wood</span>
            </div>
          )}

          {/* Media Carrossel Controls */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-stone-850 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white text-stone-850 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
              >
                <ChevronRight className="w-4 h-4 text-stone-800" />
              </button>
              
              {/* Media indicator badges */}
              <div className="absolute bottom-3 right-3 bg-stone-900/40 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                {activeImageIdx + 1}/{productImages.length}
              </div>
            </>
          )}

          {/* Action icons row inside media hover layer */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="text-[10px] font-mono font-bold bg-white/90 text-eco-forest px-2.5 py-1 rounded-full backdrop-blur-md border border-stone-150 shadow-xs">
              {product.productType}
            </span>
          </div>

        </div>

        {/* Card Details Body */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            {/* Category tag */}
            <span className="text-[9px] font-bold text-eco-sage uppercase tracking-widest font-mono">
              {product.category}
            </span>
            <h3
              onClick={() => setIsCommentsOpen(true)}
              className="font-serif text-base font-bold text-stone-900 mt-1 hover:text-eco-forest transition-colors cursor-pointer line-clamp-1 leading-tight"
            >
              {product.title}
            </h3>
            <p className="text-[10px] text-stone-550 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specialized Details for Wood carvings inside custom container */}
          {product.isPremiumWood && (
            <div className="bg-eco-sand/50 rounded-xl p-2.5 border border-eco-amber/60 text-[9.5px] mt-1.5 mb-3 flex flex-col gap-1">
              <div className="flex justify-between font-mono">
                <span className="text-stone-500">Madeira:</span>
                <span className="text-eco-wood font-semibold truncate max-w-[120px]">{product.woodType}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-stone-500">Resgate:</span>
                <span className="text-stone-700 truncate max-w-[150px]">{product.woodOrigin}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-stone-500">Morfologia:</span>
                <span className="text-stone-750 font-medium">{product.dimensions}</span>
              </div>
            </div>
          )}

          {/* Price label container */}
          <div className="flex justify-between items-baseline mt-auto pt-2 border-t border-stone-100">
            <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-bold">Preco de Valor</span>
            <span className="text-xs font-extrabold text-eco-forest">
              {(product.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          {/* Canais de Contato Rapidos */}
          {(finalWhatsapp || finalInstagram || finalFacebook || product.socialPostUrl) && (
            <div id="quick-contacts-bar" className="mt-3 pt-2 border-t border-stone-100 flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-stone-400 uppercase font-mono tracking-wide">Falar com o Vendedor:</span>
              <div className="flex flex-wrap gap-1.5">
                {finalWhatsapp && (
                  <a
                    href={`https://wa.me/${finalWhatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[70px] py-1 bg-green-500/10 hover:bg-green-500/20 text-green-700 font-bold rounded-lg text-[9px] flex items-center justify-center gap-1 transition-all"
                    title="Chamar no WhatsApp"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-3 h-3 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {finalInstagram && (
                  <a
                    href={`https://instagram.com/${finalInstagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[70px] py-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 font-bold rounded-lg text-[9px] flex items-center justify-center gap-1 transition-all"
                    title="Ver Instagram"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram className="w-3 h-3" />
                    <span>Instagram</span>
                  </a>
                )}

                {finalFacebook && (
                  <a
                    href={`https://facebook.com/${finalFacebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[70px] py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 font-bold rounded-lg text-[9px] flex items-center justify-center gap-1 transition-all"
                    title="Ver Facebook"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Facebook className="w-3 h-3" />
                    <span>Facebook</span>
                  </a>
                )}

                {product.socialPostUrl && (
                  <a
                    href={product.socialPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[70px] py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-black rounded-lg text-[9px] flex items-center justify-center gap-1 transition-all border border-amber-300/30"
                    title="Ver publicacao do produto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Ver Post</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Seller Moderation Bar */}
          {currentUser && currentUser.id === product.creatorId && (
            <div className="mt-3 pt-2.5 border-t border-dashed border-stone-200 bg-stone-50 rounded-2xl p-2.5 space-y-1.5 shrink-0">
              <span className="text-[9px] font-black text-stone-500 uppercase font-mono tracking-wider block">Ferramentas de Controle:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProduct(product.id, { isSold: !product.isSold });
                  }}
                  className={`flex-1 py-1 px-1.5 text-[9px] font-bold rounded-lg font-mono transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                    product.isSold 
                      ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200' 
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{product.isSold ? 'REATIVAR ESTOQUE' : 'MARCAR VENDIDO'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProduct(product.id, { isInactive: !product.isInactive });
                  }}
                  className={`flex-1 py-1 px-1.5 text-[9px] font-bold rounded-lg font-mono transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                    product.isInactive 
                      ? 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200' 
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{product.isInactive ? 'ATIVAR VISAO' : 'INATIVAR'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Engagement Social Bar */}
          <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-stone-100/60 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike(product.id)}
                className={`p-1.5 hover:bg-rose-50 rounded-lg hover:text-rose-500 transition-colors flex items-center gap-1 ${
                  isLiked ? 'text-rose-500' : 'text-stone-400'
                }`}
                title="Curtir publicacao"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">{product.likesCount}</span>
              </button>

              <button
                onClick={() => setIsCommentsOpen(true)}
                className="p-1.5 hover:bg-amber-50 text-stone-400 hover:text-amber-600 rounded-lg transition-colors flex items-center gap-1"
                title="Avaliacoes"
              >
                <Star className="w-4 h-4 fill-amber-300 text-amber-500" />
                <span className="text-[10px] font-bold">{(product.comments || []).length}</span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleSave(product.id)}
                className={`p-1.5 hover:bg-emerald-50 rounded-lg hover:text-eco-forest transition-colors ${
                  isSaved ? 'text-eco-forest' : 'text-stone-400'
                }`}
                title="Salvar produto"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Tenho Interesse Button */}
            <button
              onClick={() => expressInterest(product.id)}
              disabled={isInterested || product.isSold || product.isInactive}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                isInterested || product.isSold || product.isInactive
                  ? 'bg-stone-100 text-stone-400 border border-stone-200 shadow-none cursor-default'
                  : 'bg-eco-sand hover:bg-[#D2E3C8]/40 text-eco-forest'
              }`}
            >
              {product.isSold ? 'Esgotado' : product.isInactive ? 'Indisponivel' : isInterested ? 'Enviado' : 'Tenho Interesse'}
            </button>
          </div>
        </div>
      </article>

      {/* Embedded Modals on active toggle states */}
      <AnimatePresence>
        {isCommentsOpen && (
          <ModalComentarios
            product={product}
            onClose={() => setIsCommentsOpen(false)}
          />
        )}
        
        {isShareOpen && (
          <ModalCompartilhar
            product={product}
            onClose={() => setIsShareOpen(false)}
          />
        )}

        {isEditPhotosOpen && (
          <ModalEditarFotos
            product={product}
            onClose={() => setIsEditPhotosOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};


