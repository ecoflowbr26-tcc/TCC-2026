/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, ShieldCheck, Heart, Footprints, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="app-footer" className="bg-white border-t border-eco-amber mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Value Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-10 border-b border-eco-amber/60 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2 max-w-sm">
            <div className="p-2.5 bg-eco-sand rounded-xl text-eco-forest">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Produção Artesanal</h4>
            <p className="text-xs text-stone-550 leading-relaxed">
              Móveis e utensílios fabricados artesanalmente por comunidades, marceneiros locais e estúdios de arte sustentável parceiros.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2 max-w-sm">
            <div className="p-2.5 bg-eco-sand rounded-xl text-eco-wood">
              <Footprints className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Economia Circular & Zero Plástico</h4>
            <p className="text-xs text-stone-550 leading-relaxed">
              Foco exclusivo em upcycling, resgate de pallets, resíduos de serralherias e fibras botânicas orgânicas com descarte limpo.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2 max-w-sm">
            <div className="p-2.5 bg-eco-sand rounded-xl text-stone-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Rastreabilidade Garantida</h4>
            <p className="text-xs text-stone-550 leading-relaxed">
              Cada peça premium de madeira possibilita conhecer a fundo sua origem florestal, antiga utilidade civil e histórico do fabricante.
            </p>
          </div>
        </div>

        {/* Links and Brand Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-eco-forest flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 fill-emerald-300/10" />
              </div>
              <span className="text-base font-bold tracking-tight text-eco-forest">EcoFlow</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Criando conexões estéticas e duradouras entre criadores conscientes e consumidores apaixonados pelo design circular de baixo carbono.
            </p>
            <div className="flex gap-3 mt-1">
              <div className="text-[10px] bg-eco-sand text-eco-forest px-2.5 py-1 rounded-md font-bold border border-eco-amber/50">
                ♻️ +4.2 Ton Resgatadas
              </div>
              <div className="text-[10px] bg-eco-sand text-eco-wood px-2.5 py-1 rounded-md font-bold border border-eco-amber/50">
                🪵 +51 Famílias Apoiadas
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-eco-forest mb-3">Categorias Populares</h5>
            <div className="flex flex-col gap-2">
              <Link to="/explorar?cat=Madeira%20Sustent%C3%A1vel" className="text-xs text-stone-500 hover:text-eco-forest transition-colors">
                Madeira de Demolição
              </Link>
              <Link to="/explorar?cat=M%C3%B3veis%20Sustent%C3%A1veis" className="text-xs text-stone-500 hover:text-eco-forest transition-colors">
                Móveis Circulares
              </Link>
              <Link to="/explorar?cat=Moda%20Sustent%C3%A1vel" className="text-xs text-stone-500 hover:text-eco-forest transition-colors">
                Moda Botânica & Algodão
              </Link>
              <Link to="/explorar?cat=Reciclados%20Criativos" className="text-xs text-stone-500 hover:text-eco-forest transition-colors">
                Upscaling Criativo
              </Link>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-eco-forest mb-3">Como Funciona</h5>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-stone-500 hover:text-eco-forest cursor-pointer">
                1. Publique seu Trabalho
              </span>
              <span className="text-xs text-stone-500 hover:text-eco-forest cursor-pointer">
                2. Simule Interesse no Botão
              </span>
              <span className="text-xs text-stone-500 hover:text-eco-forest cursor-pointer">
                3. Conecte com o Produtor
              </span>
              <span className="text-xs text-stone-500 hover:text-eco-forest cursor-pointer font-bold mt-1 text-eco-wood flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" /> Comércio Justo
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-eco-forest mb-3">Circular Newsletter</h5>
            <p className="text-xs text-stone-500 leading-relaxed mb-3">
              Receba semanalmente histórias de reflorestamento, dicas de restauro e novidades de criadores locais.
            </p>
            {subscribed ? (
              <div className="bg-eco-sand text-eco-forest p-3 rounded-xl border border-eco-moss/40 text-[11px] font-bold">
                💚 Obrigado! Newsletter ativada.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail orgânico..."
                  className="bg-stone-50 border border-stone-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage flex-1"
                />
                <button
                  type="submit"
                  className="bg-eco-forest text-white px-3 py-2 text-xs font-semibold rounded-xl hover:bg-eco-leaf cursor-pointer transition-colors"
                >
                  Ok
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-eco-amber/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} EcoFlow. Desenvolvido com amor pelo Planeta e Marcenaria Consciente.
          </p>
          <p className="text-xs text-stone-400 flex items-center gap-1.5 justify-center">
            Feito para unir inovação circular <Heart className="w-3 h-3 text-eco-wood fill-current" /> no Brasil.
          </p>
        </div>
        
      </div>
    </footer>
  );
};
