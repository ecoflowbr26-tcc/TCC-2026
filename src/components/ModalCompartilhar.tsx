/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { useEco } from '../contexts/EcoContext';
import { X, Copy, Check, Send, Link as LinkIcon, Facebook, Twitter, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface ModalCompartilharProps {
  product: Product;
  onClose: () => void;
}

export const ModalCompartilhar: React.FC<ModalCompartilharProps> = ({ product, onClose }) => {
  const { addToast } = useEco();
  const [copied, setCopied] = React.useState(false);

  const sharedUrl = `${window.location.origin}/explorar?q=${encodeURIComponent(product.title)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setCopied(true);
      addToast('Link copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Erro ao copiar o link.', 'error');
    }
  };

  return (
    <div id={`share-modal-${product.id}`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Sharing Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 z-50 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-750 transition-colors p-1 rounded-lg hover:bg-stone-100"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold text-eco-forest uppercase tracking-wider mb-2 font-mono">
          Compartilhar Eco-Produto
        </h3>
        
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          Ajude a divulgar a economia circular compartilhando este produto sofisticado feito por artesãos brasileiros!
        </p>

        {/* Product mini profile */}
        <div className="flex gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/50 text-left mb-6 items-center">
          <img
            src={product.images[0]}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
            alt={product.title}
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate leading-tight">{product.title}</h4>
            <p className="text-[10px] text-eco-wood font-medium leading-none mt-1">
              Ref.: {product.material}
            </p>
          </div>
        </div>

        {/* Copy url field block */}
        <div className="flex gap-2 mb-6 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
          <input
            type="text"
            readOnly
            value={sharedUrl}
            className="bg-transparent border-none text-[10px] text-stone-600 px-2 font-mono flex-1 focus:outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-eco-forest text-white hover:bg-eco-leaf rounded-lg text-xs font-semibold select-none shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* Virtual networks list layout */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => {
              addToast('Compartilhando no WhatsApp (simulado)', 'info');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 text-emerald-600 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <Send className="w-4 h-4 fill-emerald-600/10" />
            </div>
            <span className="text-[9px] font-semibold text-stone-600">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              addToast('Compartilhando no Facebook (simulado)', 'info');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 text-blue-600 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <Facebook className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-semibold text-stone-600">Facebook</span>
          </button>

          <button
            onClick={() => {
              addToast('Compartilhando no Twitter (simulado)', 'info');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 text-stone-900 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
              <Twitter className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-semibold text-stone-600">X / Twitter</span>
          </button>

          <button
            onClick={() => {
              addToast('Compartilhando por E-mail (simulado)', 'info');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 text-eco-wood transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-semibold text-stone-600">E-mail</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
