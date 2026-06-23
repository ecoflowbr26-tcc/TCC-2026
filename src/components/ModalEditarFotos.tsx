/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useEco } from '../contexts/EcoContext';
import { X, Trash2, Upload, Plus, Image, ArrowRight, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface ModalEditarFotosProps {
  product: Product;
  onClose: () => void;
}

export const ModalEditarFotos: React.FC<ModalEditarFotosProps> = ({ product, onClose }) => {
  const { updateProduct, addToast } = useEco();
  const [images, setImages] = useState<string[]>([...product.images]);
  const [newUrl, setNewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // File reader helper
  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Por favor, insira somente arquivos de imagem.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const base64 = evt.target.result as string;
        setImages((prev) => [...prev, base64]);
        addToast('Uma imagem foi adicionada às fotos!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileUpload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleFileUpload);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setImages((prev) => [...prev, newUrl.trim()]);
    setNewUrl('');
    addToast('Link de imagem adicionado!', 'success');
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length <= 1) {
      addToast('O produto deve ter pelo menos uma imagem principal.', 'error');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== idx));
    addToast('Imagem removida do rascunho.', 'info');
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setImages(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === images.length - 1) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setImages(updated);
  };

  const handleSave = () => {
    const validImages = images.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      addToast('Adicione pelo menos uma imagem válida para o produto.', 'error');
      return;
    }

    updateProduct(product.id, { images: validImages });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <span className="text-[9px] font-bold text-eco-forest uppercase tracking-widest font-mono">Gerenciamento Visual</span>
            <h3 className="block font-serif text-base font-bold text-stone-900 truncate max-w-[280px] sm:max-w-[340px]">
              Editar Fotos de "{product.title}"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 bg-white hover:bg-stone-150 border border-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-5 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-eco-forest bg-eco-forest/5'
                : 'border-stone-200 hover:border-eco-sage bg-stone-50/60'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              id="modal-file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="modal-file-upload" className="cursor-pointer space-y-2 block">
              <Upload className="w-6 h-6 text-eco-forest mx-auto" />
              <p className="font-bold text-stone-700 text-[11px]">
                Arraste imagens aqui ou <span className="text-eco-forest underline">clique para selecionar</span>
              </p>
              <p className="text-[9px] text-stone-400 font-medium">JPEG, PNG ou WEBP em Alta Qualidade (Base64)</p>
            </label>
          </div>

          {/* Text/URL Input section */}
          <form onSubmit={handleAddUrl} className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200/50">
            <label className="font-bold text-stone-605 block text-[10px]">Ou cole o Link de uma foto (URL)</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 border border-stone-200 bg-white rounded-lg focus:outline-none text-[10px]"
              />
              <button
                type="submit"
                className="px-3 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
          </form>

          {/* Current Images Management list with Ordering */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-700 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1">
              <Image className="w-4 h-4 text-eco-sage" /> Fotos do Produto ({images.length})
            </h4>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="p-2 border border-stone-200/70 bg-white rounded-xl flex items-center gap-3 transition-colors hover:border-stone-250"
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-12 h-12 rounded-lg object-cover border border-stone-150"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-700 text-[10px]">
                      {idx === 0 ? '★ Foto Principal (Capa)' : `Foto Adicional #0${idx + 1}`}
                    </p>
                    <p className="text-[8px] text-stone-400 font-mono truncate">
                      {img.startsWith('data:') ? 'Arquivo de Upload' : img}
                    </p>
                  </div>

                  {/* Ordering operations */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 px-1.5 text-[9px] font-bold border border-stone-200 hover:bg-stone-50 rounded-md disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 px-1.5 text-[9px] font-bold border border-stone-200 hover:bg-stone-50 rounded-md disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 border border-rose-200/40 rounded-md transition-colors cursor-pointer ml-1"
                      title="Excluir foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-100/80 bg-stone-50/50 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-250 hover:bg-stone-200/50 rounded-xl font-bold text-stone-500 cursor-pointer transition-colors"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
