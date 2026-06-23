/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { UserPlus, Mail, Lock, User, FileImage, ShieldCheck, MapPin, Camera, Upload } from 'lucide-react';
import { motion } from 'motion/react';

const DEFAULT_WHATSAPP_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' fill='%23eceff1'/><circle cx='12' cy='9' r='4' fill='%23b0bec5'/><path d='M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z' fill='%23b0bec5'/></svg>";

export const Cadastro: React.FC = () => {
  const { register, currentUser, addToast } = useEco();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_WHATSAPP_AVATAR);
  const [isDragging, setIsDragging] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  // Pre-configured avatar selections (Nature & Ecology related only - no people photos)
  const avatarChoices = [
    { name: 'Brotar Verde', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Solo Vivo', url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Casca & Fibra', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Equilíbrio', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=150&h=150&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('As senhas não coincidem.', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('A senha deve conter no mínimo 6 dígitos.', 'error');
      return;
    }

    register(name, email, password, avatar, city, state, whatsapp, instagram, facebook);
    navigate('/feed');
  };

  return (
    <div id="cadastro-page" className="max-w-md mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-eco-forest/10 flex items-center justify-center text-eco-forest mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Cadastro de Vendedor</h1>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-normal">
            Exclusivo para artesãos, oficinas e criadores que desejam anunciar projetos ecológicos. 
            <span className="text-eco-forest font-bold block mt-1">Visitantes e compradores não precisam de conta ou login para navegar ou contatar os vendedores!</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nome */}
          <div className="space-y-1">
            <label className="font-bold text-stone-600 block">Nome do Criador ou Oficina *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Oficina Araucária Design"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
              />
              <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {/* E-mail */}
          <div className="space-y-1">
            <label className="font-bold text-stone-600 block">E-mail Comercial *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="araucaria@design.com"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {/* Localização */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-605 block">Cidade</label>
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Curitiba"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
                />
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-605 block">Estado (UF)</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="PR"
                maxLength={2}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750 uppercase"
              />
            </div>
          </div>

          {/* Senhas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-600 block">Senha *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-650 block">Confirmar Senha *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
              />
            </div>
          </div>

          {/* Foto de Perfil Drag & Drop + Selecionador */}
          <div className="space-y-2 pt-1 select-none">
            <label className="font-bold text-stone-605 block">Sua Foto de Perfil (Envie um arquivo ou selecione abaixo)</label>
            
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  if (!file.type.startsWith('image/')) {
                    addToast('Por favor, envie apenas arquivos de imagem.', 'error');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    if (evt.target?.result) {
                      setAvatar(evt.target.result as string);
                      addToast('Foto de perfil carregada com sucesso!', 'success');
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className={`p-4 border-2 border-dashed rounded-2xl text-center transition-all ${
                isDragging 
                  ? 'border-eco-forest bg-eco-forest/5' 
                  : 'border-stone-250 hover:border-eco-sage/85 bg-stone-50/50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={avatar}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-eco-sage bg-white shrink-0 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_WHATSAPP_AVATAR;
                    }}
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 bg-eco-forest hover:bg-eco-leaf text-white rounded-full cursor-pointer shadow-md transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setAvatar(evt.target.result as string);
                              addToast('Foto de perfil carregada!', 'success');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-[10px] text-stone-550 font-bold leading-none mt-1">
                  Arraste sua foto aqui ou <span className="text-eco-forest underline cursor-pointer">clique para selecionar</span>
                </p>
                <p className="text-[8px] text-stone-400 font-medium leading-none">Arquivos de imagem JPG, PNG ou SVG.</p>
              </div>
            </div>

            {avatar !== DEFAULT_WHATSAPP_AVATAR && (
              <button
                type="button"
                onClick={() => {
                  setAvatar(DEFAULT_WHATSAPP_AVATAR);
                  addToast('Foto removida.', 'info');
                }}
                className="text-[9px] text-rose-600 font-bold hover:underline block mx-auto pt-0.5"
              >
                Remover foto (Usar avatar padrão)
              </button>
            )}

            {/* Presets Grid */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[9px] text-stone-400 font-bold text-center">Ou escolha uma de nossas imagens ecológicas ilustrativas:</p>
              <div className="grid grid-cols-4 gap-2 border-b border-stone-100 pb-3">
                {avatarChoices.map((choice) => (
                  <button
                    key={choice.name}
                    type="button"
                    onClick={() => setAvatar(choice.url)}
                    className={`relative p-1 rounded-xl border bg-white overflow-hidden transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                      avatar === choice.url
                        ? 'border-eco-forest ring-1 ring-eco-sage/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={choice.url}
                      className="w-7 h-7 rounded-full object-cover"
                      alt={choice.name}
                    />
                    <span className="text-[8.5px] font-bold text-stone-500 truncate w-full">{choice.name}</span>
                  </button>
                ))}
              </div>

              {/* Engagement prompt */}
              <div className="mt-1 bg-eco-forest/10 border border-eco-sage/30 rounded-xl p-3 text-eco-forest">
                <p className="text-[9px] font-bold leading-normal">
                  💡 <strong>Por que usar foto própria?</strong> Anúncios e perfis artesanais com foto real do criador ou a logo de sua marca própria registram até <strong>85% mais engajamento de compra</strong> e geram confiança e credibilidade imediatas nos canais de contato!
                </p>
              </div>
            </div>
          </div>

          {/* Meios de Contato */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-eco-forest rounded-full" />
              <h3 className="font-bold text-stone-700 text-[11px] uppercase tracking-wide">Meios de Contato (Vendedor)</h3>
            </div>
            <p className="text-[10px] text-stone-400 font-medium">Insira as redes e contatos para que os compradores falem diretamente com você ao visualizar seus produtos:</p>
            
            <div className="space-y-2">
              <div>
                <label className="font-bold text-stone-550 block mb-0.5">WhatsApp (Apenas números com DDD)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 5541999999999"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-550 block mb-0.5 font-mono">Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value.replace(/^@/, ''))}
                    placeholder="Ex: seu_atelie"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-550 block mb-0.5 font-mono">Facebook</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="Ex: seuateleco"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl transition-all shadow-md mt-6 cursor-pointer text-xs"
          >
            Concluir Cadastro & Entrar
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-stone-500 font-medium">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-eco-wood font-bold hover:underline">
              Entrar aqui
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
