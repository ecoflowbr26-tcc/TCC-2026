/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEco } from '../contexts/EcoContext';
import { CardProduto } from '../components/CardProduto';
import { LayoutGrid, Heart, Bookmark, MapPin, Grid, Camera, Share2, Award, Mail, CalendarDays, MessageCircle, Instagram, Facebook, Edit, Save, X, Upload, ShieldCheck, Star, Trophy, Compass, Layers, Palette, Sparkles, HelpCircle, Users, Hammer, Zap, Flame, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const Perfil: React.FC = () => {
  const { currentUser, products, likedProductIds, savedProductIds, addToast, updateUser, fontFamily, fontSize, setFontFamily, setFontSize } = useEco();
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'saves' | 'settings'>('posts');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [isEditing, setIsEditing] = useState(false);

  // Profile Edit states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editState, setEditState] = useState(currentUser?.state || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editBanner, setEditBanner] = useState(currentUser?.banner || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editWhatsapp, setEditWhatsapp] = useState(currentUser?.contactWhatsapp || '');
  const [editInstagram, setEditInstagram] = useState(currentUser?.contactInstagram || '');
  const [editFacebook, setEditFacebook] = useState(currentUser?.contactFacebook || '');

  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);

  // Pre-configured avatar selections (Nature & Ecology related only - no people photos)
  const avatarChoices = [
    { name: 'Brotar Verde', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Solo Vivo', url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Casca & Fibra', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Equilíbrio', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=150&h=150&q=80' },
  ];

  // Pre-configured banner selections for ease of use
  const bannerChoices = [
    { name: 'Madeiras Nobres', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&h=400&q=80' },
    { name: 'Ateliê Ferro & Cedro', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&h=400&q=80' },
    { name: 'Floresta Viva', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&h=400&q=80' },
    { name: 'Textura Natural', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&h=400&q=80' },
    { name: 'Brotar Sustentável', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&h=400&q=80' },
  ];
  
  if (!currentUser) {
    return (
      <div id="require-auth-profile" className="flex flex-col items-center justify-center py-20 bg-white border rounded-3xl p-6 text-center shadow-xs">
        <MapPin className="w-12 h-12 text-stone-300 mb-2 animate-bounce" />
        <h3 className="font-extrabold text-sm text-stone-850">Faça login para ver seu perfil</h3>
        <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-4 leading-normal">
          Conecte-se com a rede EcoFlow para gerenciar suas publicações de madeira circular e organizar itens salvos.
        </p>
        <button
          onClick={() => window.location.hash = '/login'}
          className="px-5 py-2.5 bg-eco-forest hover:bg-eco-leaf text-white text-xs font-bold rounded-full shadow-md"
        >
          Entrar na Conta
        </button>
      </div>
    );
  }

  // Filter listings based on active tab
  const myPublications = products.filter((p) => p.creatorId === currentUser.id);

  // Dynamic Low-DB Badge calculation rules
  const woodActiveCount = myPublications.filter(
    (p) => 
      p.category.toLowerCase().includes('madeira') || 
      p.category.toLowerCase().includes('móveis')
  ).length;
  const hasWoodMasterBadge = woodActiveCount >= 3;

  const allMyComments = myPublications.flatMap((p) => p.comments || []);
  const hasRatings = allMyComments.length > 0;
  const avgCreatorRating = hasRatings
    ? allMyComments.reduce((acc, c) => acc + (c.rating || 5), 0) / allMyComments.length
    : 0;
  const hasGreenConsensusBadge = hasRatings && avgCreatorRating >= 4.0;

  const hasEcoActiveBadge = !!(currentUser.email && currentUser.contactWhatsapp);

  // Computations for 25 additional custom eco-badges (no deep database constraints)
  const totalLikesOnCreations = myPublications.reduce((sum, p) => sum + (p.likesCount || 0), 0);
  const totalExpressionOfInterests = myPublications.reduce((sum, p) => sum + (p.interestsCount || 0), 0);
  const totalUploadedImages = myPublications.reduce((sum, p) => sum + (p.images?.length || 0), 0);
  const bioCharCount = currentUser.bio?.length || 0;
  const uniqueCategoriesUsed = new Set(myPublications.map(p => p.category)).size;
  const totalSumPrice = myPublications.reduce((sum, p) => sum + (p.price || 0), 0);
  const perfectFiveStarReviews = allMyComments.filter(c => (c.rating || 5) === 5).length;

  const brandNameMatch = ['ateliê', 'estúdio', 'eco', 'design', 'arte', 'oficina', 'artesanato', 'recicla'].some(w => currentUser.name.toLowerCase().includes(w));
  const totalInteractions = likedProductIds.length + savedProductIds.length;

  const ecoBadgesList = [
    {
      id: 'wood-master',
      name: 'Mestre da Madeira',
      description: 'Dedicado ao reaproveitamento de sobras de madeira e pallets.',
      requirement: 'Possuir no mínimo 3 anúncios ativos nas categorias de Madeira.',
      progress: `${woodActiveCount}/3`,
      active: hasWoodMasterBadge,
      icon: Award,
      color: 'from-amber-600/10 to-amber-600/5 text-amber-900 border-amber-600/35',
      categoryBadge: 'Madeira'
    },
    {
      id: 'green-consensus',
      name: 'Consenso Verde',
      description: 'Reconhecimento de excelência técnica e acabamento eco.',
      requirement: 'Ter avaliações com nota média de 4.0 ou superior (Mínimo 1 nota).',
      progress: hasRatings ? `${avgCreatorRating.toFixed(1)}/5.0` : '0/5',
      active: hasGreenConsensusBadge,
      icon: Star,
      color: 'from-emerald-600/10 to-emerald-600/5 text-emerald-900 border-emerald-600/35',
      categoryBadge: 'Feedback'
    },
    {
      id: 'eco-active',
      name: 'Eco-Ativo',
      description: 'Disponibilidade de contato ágil e completo para a comunidade.',
      requirement: 'Preencher o e-mail cadastrado e telefone celular de WhatsApp.',
      progress: hasEcoActiveBadge ? 'Completado' : 'Incompleto',
      active: hasEcoActiveBadge,
      icon: ShieldCheck,
      color: 'from-blue-600/10 to-blue-600/5 text-blue-900 border-blue-600/35',
      categoryBadge: 'Contato'
    },
    {
      id: 'pioneiro-verde',
      name: 'Pioneiro Verde',
      description: 'Começo marcante de sua jornada de catalogação circular.',
      requirement: 'Publicar o seu primeiro produto sustentável.',
      progress: `${Math.min(myPublications.length, 1)}/1`,
      active: myPublications.length >= 1,
      icon: Sparkles,
      color: 'from-teal-605/10 to-teal-605/5 text-teal-900 border-teal-600/35',
      categoryBadge: 'Divulgação'
    },
    {
      id: 'eco-semeador',
      name: 'Eco-Semeador',
      description: 'Ampla diversidade de peças criativas publicadas no mercado.',
      requirement: 'Publicar pelo menos 5 produtos ecológicos ativos.',
      progress: `${Math.min(myPublications.length, 5)}/5`,
      active: myPublications.length >= 5,
      icon: Flame,
      color: 'from-orange-600/10 to-orange-600/5 text-orange-900 border-orange-600/35',
      categoryBadge: 'Vitrine'
    },
    {
      id: 'grande-floresta',
      name: 'Grande Floresta',
      description: 'Uma verdadeira fábrica artesanal dedicada à economia circular.',
      requirement: 'Publicar 10 ou mais anúncios ativos de reciclagem.',
      progress: `${Math.min(myPublications.length, 10)}/10`,
      active: myPublications.length >= 10,
      icon: Trophy,
      color: 'from-purple-600/10 to-purple-600/5 text-purple-900 border-purple-600/35',
      categoryBadge: 'Vitrine'
    },
    {
      id: 'eco-estilista',
      name: 'Eco-Estilista',
      description: 'Valoriza retalhos, fibras orgânicas e moda upcycled.',
      requirement: 'Publicar no mínimo 2 itens na categoria Moda Sustentável.',
      progress: `${Math.min(myPublications.filter(p => p.category === 'Moda Sustentável').length, 2)}/2`,
      active: myPublications.filter(p => p.category === 'Moda Sustentável').length >= 2,
      icon: Bookmark,
      color: 'from-rose-600/10 to-rose-600/5 text-rose-900 border-rose-600/35',
      categoryBadge: 'Moda Eco'
    },
    {
      id: 'mestre-decorador',
      name: 'Mestre Decorador',
      description: 'Especialista em transformar garrafas, latas e caixas em design.',
      requirement: 'Publicar pelo menos 3 itens na categoria Decoração.',
      progress: `${Math.min(myPublications.filter(p => p.category === 'Decoração').length, 3)}/3`,
      active: myPublications.filter(p => p.category === 'Decoração').length >= 3,
      icon: LayoutGrid,
      color: 'from-indigo-605/10 to-indigo-605/5 text-indigo-900 border-indigo-605/35',
      categoryBadge: 'Criação'
    },
    {
      id: 'poeta-da-arte',
      name: 'Poeta da Arte',
      description: 'Usa materiais alternativos para expressar artes visuais únicas.',
      requirement: 'Publicar pelo menos 2 criações na categoria Arte.',
      progress: `${Math.min(myPublications.filter(p => p.category === 'Arte').length, 2)}/2`,
      active: myPublications.filter(p => p.category === 'Arte').length >= 2,
      icon: Palette,
      color: 'from-fuchsia-600/10 to-fuchsia-600/5 text-fuchsia-900 border-fuchsia-600/35',
      categoryBadge: 'Arte'
    },
    {
      id: 'dedo-verde',
      name: 'Dedo Verde',
      description: 'Especialista em vasos de pneus, composteiras e fibras de coco.',
      requirement: 'Publicar pelo menos 2 criações na categoria Jardinagem.',
      progress: `${Math.min(myPublications.filter(p => p.category === 'Jardinagem').length, 2)}/2`,
      active: myPublications.filter(p => p.category === 'Jardinagem').length >= 2,
      icon: MapPin,
      color: 'from-green-600/10 to-green-600/5 text-green-900 border-green-600/35',
      categoryBadge: 'Jardim'
    },
    {
      id: 'rei-utilidades',
      name: 'Rei das Utilidades',
      description: 'Praticidade sustentável em utensílios de cozinha e organizadores.',
      requirement: 'Publicar 3 ou mais itens em Utilidades Domésticas.',
      progress: `${Math.min(myPublications.filter(p => p.category === 'Utilidades Domésticas').length, 3)}/3`,
      active: myPublications.filter(p => p.category === 'Utilidades Domésticas').length >= 3,
      icon: Hammer,
      color: 'from-yellow-600/10 to-yellow-600/5 text-yellow-950 border-yellow-650/35',
      categoryBadge: 'Utilidades'
    },
    {
      id: 'alquimista-reciclado',
      name: 'Alquimista do Reciclado',
      description: 'Transformação radical de pneus furados e latas em produtos novos.',
      requirement: 'Publicar 3 ou mais itens em Reciclados Criativos.',
      progress: `${Math.min(myPublications.filter(p => p.category === 'Reciclados Criativos').length, 3)}/3`,
      active: myPublications.filter(p => p.category === 'Reciclados Criativos').length >= 3,
      icon: Layers,
      color: 'from-amber-705/10 to-amber-705/5 text-amber-950 border-amber-700/35',
      categoryBadge: 'Reciclados'
    },
    {
      id: 'criador-premium',
      name: 'Criador Premium',
      description: 'Peças de marcenaria de demolição fina ou móveis sob medida de alta qualidade.',
      requirement: 'Publicar 1 ou mais itens de catálogo Premium.',
      progress: myPublications.some(p => p.category === 'Produtos Premium' || p.isPremiumWood) ? '1/1' : '0/1',
      active: myPublications.some(p => p.category === 'Produtos Premium' || p.isPremiumWood),
      icon: Zap,
      color: 'from-red-650/10 to-red-650/5 text-red-955 border-red-600/35',
      categoryBadge: 'Exclusivo'
    },
    {
      id: 'artesao-elite',
      name: 'Artesão de Elite',
      description: 'Sua produção tem valor agregado de alto calibre no ateliê.',
      requirement: 'Soma total de preços das peças publicadas superar R$ 1.500.',
      progress: `R$ ${myPublications.reduce((sum, p) => sum + (p.price || 0), 0)} / R$ 1.500`,
      active: myPublications.reduce((sum, p) => sum + (p.price || 0), 0) >= 1500,
      icon: Award,
      color: 'from-cyan-600/10 to-cyan-600/5 text-cyan-900 border-cyan-600/35',
      categoryBadge: 'Valor'
    },
    {
      id: 'ame-planeta',
      name: 'Ame o Planeta',
      description: 'Suas criações sustentáveis tocam o coração do público.',
      requirement: 'Soma total de curtidas recebidas atingir no mínimo 10.',
      progress: `${totalLikesOnCreations}/10`,
      active: totalLikesOnCreations >= 10,
      icon: Heart,
      color: 'from-pink-600/10 to-pink-600/5 text-pink-905 border-pink-600/35',
      categoryBadge: 'Prestígio'
    },
    {
      id: 'eco-influencer',
      name: 'Eco-Influenciador',
      description: 'As atenções da comunidade estão fixadas nos seus lançamentos.',
      requirement: 'Soma total de curtidas recebidas atingir 50 ou mais.',
      progress: `${totalLikesOnCreations}/50`,
      active: totalLikesOnCreations >= 50,
      icon: Flame,
      color: 'from-violet-600/10 to-violet-600/5 text-violet-900 border-violet-600/35',
      categoryBadge: 'Prestígio'
    },
    {
      id: 'voz-comunidade',
      name: 'Voz da Comunidade',
      description: 'Engajamento social ativo de pessoas comentando seu catálogo.',
      requirement: 'Receber no mínimo 5 comentários e avaliações nos produtos.',
      progress: `${allMyComments.length}/5`,
      active: allMyComments.length >= 5,
      icon: MessageCircle,
      color: 'from-sky-600/10 to-sky-600/5 text-sky-900 border-sky-600/35',
      categoryBadge: 'Feedback'
    },
    {
      id: 'ima-clientes',
      name: 'Ímã de Clientes',
      description: 'Alto volume de interesse e conversas diretas de compra abertas.',
      requirement: 'Acumular no mínimo 3 solicitações de interesse para suas peças.',
      progress: `${totalExpressionOfInterests}/3`,
      active: totalExpressionOfInterests >= 3,
      icon: Users,
      color: 'from-lime-605/10 to-lime-605/5 text-lime-900 border-lime-600/35',
      categoryBadge: 'Impacto'
    },
    {
      id: 'fotografo-natureza',
      name: 'Olhar Ecológico',
      description: 'Gera segurança mostrando detalhes minuciosos de suas artes.',
      requirement: 'Adicionar 10 ou mais fotos no total de seus anúncios.',
      progress: `${totalUploadedImages}/10`,
      active: totalUploadedImages >= 10,
      icon: Camera,
      color: 'from-emerald-700/10 to-emerald-700/5 text-emerald-950 border-emerald-700/35',
      categoryBadge: 'Visual'
    },
    {
      id: 'poeta-verde',
      name: 'Poeta Verde',
      description: 'Biografia completa que expressa sua inspiração e amor ao planeta.',
      requirement: 'Ter uma biografia (Bio) de perfil com pelo menos 55 caracteres.',
      progress: `${bioCharCount}/55`,
      active: bioCharCount >= 55,
      icon: Edit,
      color: 'from-stone-500/10 to-stone-500/5 text-stone-850 border-stone-400/35',
      categoryBadge: 'Registro'
    },
    {
      id: 'saber-local',
      name: 'Saber Local',
      description: 'Facilita a logística e fomenta o comércio de proximidade.',
      requirement: 'Preencher cidade e estado corretamente nas configurações do perfil.',
      progress: currentUser.city && currentUser.state ? '1/1' : '0/1',
      active: !!(currentUser.city && currentUser.state),
      icon: MapPin,
      color: 'from-teal-600/10 to-teal-600/5 text-teal-950 border-teal-600/35',
      categoryBadge: 'Localização'
    },
    {
      id: 'mundo-conectado',
      name: 'Mundo Conectado',
      description: 'Ampla presença integradora em canais sociais externos.',
      requirement: 'Configurar perfis de link de Instagram e Facebook.',
      progress: (currentUser.contactInstagram && currentUser.contactFacebook) ? '2/2' : 'Incompleto',
      active: !!(currentUser.contactInstagram && currentUser.contactFacebook),
      icon: Share2,
      color: 'from-indigo-600/10 to-indigo-600/5 text-indigo-955 border-indigo-600/35',
      categoryBadge: 'Canais'
    },
    {
      id: 'magnetismo-natural',
      name: 'Magnetismo Natural',
      description: 'Grande alcance eco-artesanal e relevância integrada.',
      requirement: 'Ter pelo menos 5 seguidores reais no seu canal de vendas.',
      progress: `${currentUser.followersCount}/5`,
      active: currentUser.followersCount >= 5,
      icon: Users,
      color: 'from-emerald-705/10 to-emerald-705/5 text-emerald-990 border-emerald-700/25',
      categoryBadge: 'Seguidores'
    },
    {
      id: 'comunidade-viva',
      name: 'Comunidade Viva',
      description: 'Apoiando ativamente os outros criadores do ecossistema nacional.',
      requirement: 'Seguir pelo menos 3 outros artesãos recicladores.',
      progress: `${currentUser.followingCount}/3`,
      active: currentUser.followingCount >= 3,
      icon: Compass,
      color: 'from-green-700/10 to-green-700/5 text-green-950 border-green-700/25',
      categoryBadge: 'Apoio'
    },
    {
      id: 'identidade-verde',
      name: 'Identidade Própria',
      description: 'Personalização do ambiente de vitrine para dar credibilidade de marca.',
      requirement: 'Alterar a foto de perfil e o banner para arquivos próprios (não usar os presets padrão).',
      progress: (currentUser.avatar !== 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&h=150&q=80' && currentUser.banner !== 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&h=400&q=80') ? 'Alterado' : 'Preset Ativo',
      active: (currentUser.avatar !== 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&h=150&q=80' && currentUser.banner !== 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&h=400&q=80'),
      icon: ShieldAlert,
      color: 'from-yellow-700/10 to-yellow-700/5 text-yellow-950 border-yellow-600/30',
      categoryBadge: 'Identidade'
    },
    {
      id: 'multi-eco',
      name: 'Multi-Talento Eco',
      description: 'Flexibilidade técnica criando móveis, decorações e vasos.',
      requirement: 'Publicar itens em 3 ou mais categorias variadas da plataforma.',
      progress: `${uniqueCategoriesUsed}/3`,
      active: uniqueCategoriesUsed >= 3,
      icon: Compass,
      color: 'from-blue-650/10 to-blue-650/5 text-blue-990 border-blue-600/25',
      categoryBadge: 'Habilidade'
    },
    {
      id: 'marca-oficial',
      name: 'Ateliê Profissional',
      description: 'Identidade de marca clara estabelecendo postura profissional.',
      requirement: 'Nome do seu perfil incluir os termos Ateliê, Oficina, Eco, Decora ou Arte.',
      progress: brandNameMatch ? 'Comprovado' : 'Comum',
      active: brandNameMatch,
      icon: Trophy,
      color: 'from-amber-500/10 to-amber-500/5 text-amber-950 border-amber-500/25',
      categoryBadge: 'Identidade'
    },
    {
      id: 'eco-explorador',
      name: 'Eco-Explorador',
      description: 'Mapeando, curtindo e salvando obras de arte recicladas da rede.',
      requirement: 'Curtir ou Salvar pelo menos 3 produtos de outros artesãos.',
      progress: `${totalInteractions}/3`,
      active: totalInteractions >= 3,
      icon: Bookmark,
      color: 'from-eco-sage/15 to-eco-sage/5 text-eco-forest border-eco-sage/35',
      categoryBadge: 'Interações'
    },
    {
      id: 'guardiao-florestal',
      name: 'Guardião Florestal',
      description: 'Dedicação sublime à preservação ambiental ao catalogar dezenas de peças restauradas.',
      requirement: 'Ter pelo menos 15 anúncios ativos de economia circular.',
      progress: `${Math.min(myPublications.length, 15)}/15`,
      active: myPublications.length >= 15,
      icon: Trophy,
      color: 'from-emerald-800/10 to-emerald-800/5 text-emerald-950 border-emerald-800/35',
      categoryBadge: 'Vitrine'
    },
    {
      id: 'divulgador-whatsapp',
      name: 'Elo Divulgador',
      description: 'Fornece contato de WhatsApp para um atendimento ágil e confiável.',
      requirement: 'Ter o contato de WhatsApp preenchido nos detalhes de perfil.',
      progress: currentUser.contactWhatsapp ? 'Preenchido' : 'Pendente',
      active: !!currentUser.contactWhatsapp,
      icon: MessageCircle,
      color: 'from-green-600/10 to-green-600/5 text-green-900 border-green-600/35',
      categoryBadge: 'Contato'
    },
    {
      id: 'atendimento-ouro',
      name: 'Atendimento Ouro',
      description: 'Excepcional engajamento gerando interesse entre os ecocompradores.',
      requirement: 'Obter 5 ou mais intenções de interesse em suas publicações.',
      progress: `${totalExpressionOfInterests}/5`,
      active: totalExpressionOfInterests >= 5,
      icon: Users,
      color: 'from-amber-600/10 to-amber-600/5 text-amber-900 border-amber-600/35',
      categoryBadge: 'Impacto'
    },
    {
      id: 'garimpeiro-azul',
      name: 'Garimpeiro Azul',
      description: 'Valoriza e apoia o trabalho sustentável de outros artesãos curtindo suas criações.',
      requirement: 'Ter curtido pelo menos 5 produtos de criadores parceiros.',
      progress: `${Math.min(likedProductIds.length, 5)}/5`,
      active: likedProductIds.length >= 5,
      icon: Heart,
      color: 'from-blue-600/10 to-blue-600/5 text-blue-900 border-blue-600/35',
      categoryBadge: 'Apoio'
    },
    {
      id: 'curador-de-tesouros',
      name: 'Curador de Tesouros',
      description: 'Criação de uma coleção rica de desejos salvando produtos ecocriativos da rede.',
      requirement: 'Ter salvo pelo menos 5 produtos ecocriativos da rede.',
      progress: `${Math.min(savedProductIds.length, 5)}/5`,
      active: savedProductIds.length >= 5,
      icon: Bookmark,
      color: 'from-cyan-600/10 to-cyan-600/5 text-cyan-900 border-cyan-150/35',
      categoryBadge: 'Interações'
    },
    {
      id: 'eco-detalhista',
      name: 'Eco-Detalhista',
      description: 'Riqueza visual excepcional que transmite máxima confiança e fidelidade.',
      requirement: 'Adicionar pelo menos 3 fotos a um mesmo produto cadastrado.',
      progress: myPublications.some(p => (p.images?.length || 0) >= 3) ? 'Conquistado' : 'Abaixo do minimo',
      active: myPublications.some(p => (p.images?.length || 0) >= 3),
      icon: Camera,
      color: 'from-rose-600/10 to-rose-600/5 text-rose-900 border-rose-650/35',
      categoryBadge: 'Visual'
    },
    {
      id: 'palavra-de-honra',
      name: 'Palavra de Honra',
      description: 'Descrições ricas de produtos para educar e inspirar o público.',
      requirement: 'Ter pelo menos um anúncio com descrição de 120 ou mais caracteres.',
      progress: myPublications.some(p => (p.description?.length || 0) >= 120) ? 'Concluído' : 'Abaixo do tamanho',
      active: myPublications.some(p => (p.description?.length || 0) >= 120),
      icon: Edit,
      color: 'from-stone-600/10 to-stone-600/5 text-stone-900 border-stone-150/35',
      categoryBadge: 'Qualidade'
    },
    {
      id: 'mestre-do-ferro',
      name: 'Ferreiro do Upcycling',
      description: 'Combina canos de ferro, ferragens antigas ou metal com madeira.',
      requirement: 'Produto com o termo "ferro", "metal" ou "industrial" no título ou descrição.',
      progress: myPublications.some(p => p.title.toLowerCase().includes('ferro') || p.title.toLowerCase().includes('metal') || p.description.toLowerCase().includes('ferro') || p.description.toLowerCase().includes('metal')) ? 'Identificado' : 'Não possui',
      active: myPublications.some(p => p.title.toLowerCase().includes('ferro') || p.title.toLowerCase().includes('metal') || p.description.toLowerCase().includes('ferro') || p.description.toLowerCase().includes('metal')),
      icon: Hammer,
      color: 'from-indigo-600/10 to-indigo-600/5 text-indigo-905 border-indigo-650/35',
      categoryBadge: 'Estilo'
    },
    {
      id: 'orador-ecologico',
      name: 'Orador Ecológico',
      description: 'Interage de forma ativa enviando comentários para a comunidade.',
      requirement: 'Receber ou escrever pelo menos 1 comentário sustentável.',
      progress: allMyComments.length >= 1 ? '1/1' : '0/1',
      active: allMyComments.length >= 1,
      icon: MessageCircle,
      color: 'from-sky-600/10 to-sky-600/5 text-sky-900 border-sky-600/35',
      categoryBadge: 'Engajamento'
    },
    {
      id: 'semente-do-amanha',
      name: 'Semente do Amanhã',
      description: 'Projetos educativos ou infantis focados em reaproveitamento sustentável.',
      requirement: 'Incluir "educativo", "oficina", "infantil" ou "semente" no título/descrição.',
      progress: myPublications.some(p => ['educativo', 'oficina', 'infantil', 'semente'].some(w => p.title.toLowerCase().includes(w) || p.description.toLowerCase().includes(w))) ? 'Cadastrado' : 'Incompleto',
      active: myPublications.some(p => ['educativo', 'oficina', 'infantil', 'semente'].some(w => p.title.toLowerCase().includes(w) || p.description.toLowerCase().includes(w))),
      icon: Sparkles,
      color: 'from-lime-600/10 to-lime-600/5 text-lime-900 border-lime-600/35',
      categoryBadge: 'Educação'
    },
    {
      id: 'eco-luxo',
      name: 'Eco-Luxo Sustentável',
      description: 'Elevando a reciclagem criativa a obras sofisticadas de alto valor.',
      requirement: 'Possuir pelo menos um anúncio com preço superior a R$ 500 catalogado.',
      progress: myPublications.some(p => (p.price || 0) >= 500) ? 'Elegível' : 'Não alcançado',
      active: myPublications.some(p => (p.price || 0) >= 500),
      icon: Zap,
      color: 'from-violet-600/10 to-violet-600/5 text-violet-905 border-violet-650/35',
      categoryBadge: 'Valor'
    },
    {
      id: 'desbravador-de-redes',
      name: 'Desbravador de Redes',
      description: 'Conectividade total ampliando o ecossistema local ao expor canais sociais.',
      requirement: 'Cadastrar pelo menos o link para o seu perfil do Instagram.',
      progress: currentUser.contactInstagram ? 'Disponível' : 'Pendente',
      active: !!currentUser.contactInstagram,
      icon: Compass,
      color: 'from-fuchsia-600/10 to-fuchsia-600/5 text-fuchsia-950 border-fuchsia-600/35',
      categoryBadge: 'Canais'
    },
    {
      id: 'defensor-da-fauna',
      name: 'Amigo dos Animais',
      description: 'Desenvolve comedouros, casinhas ou suportes pet reciclados.',
      requirement: 'Anúncio com os termos "pet", "gato", "cachorro", "passarinho" ou "animal".',
      progress: myPublications.some(p => ['pet', 'gato', 'cachorro', 'passarinho', 'animal'].some(w => p.title.toLowerCase().includes(w) || p.description.toLowerCase().includes(w))) ? 'Sim' : 'Pendente',
      active: myPublications.some(p => ['pet', 'gato', 'cachorro', 'passarinho', 'animal'].some(w => p.title.toLowerCase().includes(w) || p.description.toLowerCase().includes(w))),
      icon: Star,
      color: 'from-amber-700/10 to-amber-700/5 text-amber-955 border-amber-700/35',
      categoryBadge: 'Fauna'
    },
    {
      id: 'mestre-das-paletas',
      name: 'Mestre do Pallet',
      description: 'Especialista absoluto em desmontar e criar obras artísticas com paletes.',
      requirement: 'Possuir pelo menos uma publicação cujo título ou descrição inclua "pallet".',
      progress: myPublications.some(p => p.title.toLowerCase().includes('pallet') || p.description.toLowerCase().includes('pallet')) ? 'Sim' : 'Pendente',
      active: myPublications.some(p => p.title.toLowerCase().includes('pallet') || p.description.toLowerCase().includes('pallet')),
      icon: Layers,
      color: 'from-orange-700/10 to-orange-700/5 text-orange-950 border-orange-700/35',
      categoryBadge: 'Pallet'
    },
    {
      id: 'zero-descarte',
      name: 'Zero Descarte',
      description: 'Domina frentes de sustentabilidade variadas publicando de forma diversificada.',
      requirement: 'Publicar itens em 4 ou mais categorias variadas.',
      progress: `${uniqueCategoriesUsed}/4`,
      active: uniqueCategoriesUsed >= 4,
      icon: Award,
      color: 'from-teal-600/10 to-teal-600/5 text-teal-950 border-teal-600/35',
      categoryBadge: 'Habilidade'
    },
    {
      id: 'imperador-circular',
      name: 'Imperador Circular (HARDCORE)',
      description: 'Dedicação lendária ao manter uma fábrica viva de reciclagem e fartura.',
      requirement: 'Ter 25 ou mais anúncios ativos de economia circular cadastrados.',
      progress: `${Math.min(myPublications.length, 25)}/25`,
      active: myPublications.length >= 25,
      icon: Trophy,
      color: 'from-purple-900/15 via-indigo-950/5 to-purple-900/10 text-purple-950 border-purple-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    },
    {
      id: 'reputacao-impecavel',
      name: 'Estrela Cósmica 5.0 (HARDCORE)',
      description: 'Prestígio impecável com dezenas de avaliações perfeitas de 5 estrelas do público sustentável.',
      requirement: 'Obter pelo menos 5 avaliações com nota máxima de 5.0 estrelas.',
      progress: `${perfectFiveStarReviews}/5 Valorações`,
      active: perfectFiveStarReviews >= 5,
      icon: Star,
      color: 'from-amber-400/15 via-yellow-400/5 to-orange-400/10 text-amber-950 border-yellow-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    },
    {
      id: 'patrimonio-verde',
      name: 'Patrimônio Ecológico (HARDCORE)',
      description: 'Um acervo valioso esculpido inteiramente a partir do descarte qualificado de resíduos.',
      requirement: 'Soma total dos preços de suas criações publicadas ultrapassar R$ 5.000,00.',
      progress: `R$ ${totalSumPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / R$ 5.000,00`,
      active: totalSumPrice >= 5000,
      icon: Zap,
      color: 'from-emerald-700/15 via-teal-950/5 to-emerald-700/10 text-emerald-950 border-emerald-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    },
    {
      id: 'magnetismo-lendario',
      name: 'Magnetismo Absoluto (HARDCORE)',
      description: 'Suas criações sustentáveis arrastam multidões e inspiram profundamente toda a rede EcoFlow.',
      requirement: 'Acumular um total de 50 ou mais curtidas recebidas em suas publicações.',
      progress: `${totalLikesOnCreations}/50 Curtidas`,
      active: totalLikesOnCreations >= 50,
      icon: Flame,
      color: 'from-rose-650/15 via-red-950/5 to-rose-650/10 text-rose-950 border-rose-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    },
    {
      id: 'exposicao-suprema',
      name: 'Soberano das Lentes (HARDCORE)',
      description: 'Vitrine exuberante com riqueza extrema de detalhes visuais e transparência técnica total.',
      requirement: 'Adicionar pelo menos 45 fotos em todo o histórico de suas postagens.',
      progress: `${totalUploadedImages}/45 Fotos`,
      active: totalUploadedImages >= 45,
      icon: Camera,
      color: 'from-cyan-600/15 via-sky-950/5 to-cyan-650/10 text-cyan-950 border-cyan-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    },
    {
      id: 'rede-total',
      name: 'Guardião de Redes (HARDCORE)',
      description: 'Perfil profissional totalmente completo com conexões de WhatsApp, Instagram e Facebook ativas.',
      requirement: 'Preencher obrigatoriamente WhatsApp, Instagram e Facebook nos contatos.',
      progress: (currentUser.contactWhatsapp && currentUser.contactInstagram && currentUser.contactFacebook) ? 'Configurado' : 'Pendente',
      active: !!(currentUser.contactWhatsapp && currentUser.contactInstagram && currentUser.contactFacebook),
      icon: ShieldCheck,
      color: 'from-indigo-600/15 via-blue-950/5 to-indigo-650/10 text-indigo-950 border-blue-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    },
    {
      id: 'alquimista-supremo',
      name: 'Alquimista Supremo (HARDCORE)',
      description: 'Mestre supremo na engenharia de reaproveitamento cobrindo todo o espectro do descarte.',
      requirement: 'Publicar itens qualificados em 6 ou mais categorias diferentes existentes no catálogo.',
      progress: `${uniqueCategoriesUsed}/6 Categorias`,
      active: uniqueCategoriesUsed >= 6,
      icon: Palette,
      color: 'from-fuchsia-600/15 via-pink-950/5 to-fuchsia-650/10 text-fuchsia-950 border-fuchsia-500/60 shadow-md',
      categoryBadge: 'Elite Hardcore'
    }
  ];

  const earnedBadgesCount = ecoBadgesList.filter(b => b.active).length;

  const myLikedProducts = products.filter((p) => likedProductIds.includes(p.id));
  const mySavedProducts = products.filter((p) => savedProductIds.includes(p.id));

  const itemsToShow =
    activeTab === 'posts'
      ? myPublications
      : activeTab === 'likes'
      ? myLikedProducts
      : mySavedProducts;

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link do seu perfil copiado!', 'success');
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      addToast('O nome não pode ficar vazio.', 'error');
      return;
    }
    updateUser({
      name: editName,
      city: editCity,
      state: editState,
      avatar: editAvatar,
      banner: editBanner,
      bio: editBio,
      contactWhatsapp: editWhatsapp,
      contactInstagram: editInstagram,
      contactFacebook: editFacebook,
    });
    setIsEditing(false);
    addToast('Perfil atualizado com sucesso!', 'success');
  };

  return (
    <div id="user-profile-page" className="space-y-8 select-none">
      
      {/* Profile banner & Avatar Card Header */}
      <section className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-sm relative">
        {/* Banner container */}
        <div className="h-44 sm:h-64 bg-stone-900 overflow-hidden relative">
          <img
            src={isEditing ? (editBanner || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80') : (currentUser.banner || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80')}
            alt="Eco Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
          {isEditing && (
            <div className="absolute top-4 right-4 bg-[#336141]/90 backdrop-blur-xs text-white text-[9.5px] font-bold px-3 py-1.5 rounded-xl border border-white/25 select-none font-mono uppercase tracking-wider shadow-sm z-30 animate-pulse">
              ★ Modo de Edição Ativo
            </div>
          )}
        </div>

        {/* Profile Details area */}
        {isEditing ? (
          <div className="px-6 py-6 border-t border-stone-150/70 bg-stone-50/50 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-eco-forest rounded-full" />
                <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">Editar Ateliê & Contatos de Vendedor</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-600 block text-[10.5px]">Nome do Perfil / Ateliê *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none text-stone-800 font-bold text-xs"
                  placeholder="Nome público"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-stone-600 block text-[10.5px]">Cidade</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none text-stone-800 text-xs"
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-600 block text-[10.5px]">Estado (UF)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={editState}
                    onChange={(e) => setEditState(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none text-stone-800 uppercase text-xs"
                    placeholder="PR"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-650 block text-[10.5px]">Apresentação / Bio do Criador</label>
              <textarea
                value={editBio}
                rows={3}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none text-stone-700 text-xs leading-relaxed font-sans"
                placeholder="Conte sobre sua história sustentável e ateliê..."
              />
            </div>

            {/* Dual Upload Section: Avatar and Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-stone-200/60 pt-4">
              
              {/* Avatar Selector and Upload */}
              <div className="space-y-3">
                <label className="font-bold text-stone-700 block text-[11px] uppercase tracking-wide font-mono">Foto de Perfil</label>
                
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingAvatar(true); }}
                  onDragLeave={() => setIsDraggingAvatar(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingAvatar(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        addToast('Por favor, envie apenas arquivos de imagem.', 'error');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        if (evt.target?.result) {
                          setEditAvatar(evt.target.result as string);
                          addToast('Foto de perfil importada!', 'success');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`p-4 border-2 border-dashed rounded-2xl text-center transition-all ${
                    isDraggingAvatar 
                      ? 'border-eco-forest bg-eco-forest/5' 
                      : 'border-stone-200 hover:border-eco-sage bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img
                        src={editAvatar}
                        alt="Avatar Preview"
                        className="w-12 h-12 rounded-full object-cover border border-eco-sage bg-stone-50 shrink-0 shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';
                        }}
                      />
                      <label htmlFor="perfil-avatar-file" className="absolute bottom-0 right-0 p-1 bg-eco-forest hover:bg-eco-leaf text-white rounded-full cursor-pointer shadow-md transition-colors">
                        <Camera className="w-3 h-3" />
                        <input
                          id="perfil-avatar-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setEditAvatar(evt.target.result as string);
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
                    
                    <p className="text-[10px] text-stone-600 font-bold leading-none mt-1">
                      Arraste sua foto ou <span className="text-eco-forest underline cursor-pointer">clique aqui</span>
                    </p>
                    <p className="text-[8px] text-stone-400 font-medium">JPEG, PNG ou WEBP.</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 font-bold block">Ou escolha um dos presets de natureza:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {avatarChoices.map((choice) => (
                      <button
                        key={choice.name}
                        type="button"
                        onClick={() => setEditAvatar(choice.url)}
                        className={`relative p-1 rounded-xl border bg-white overflow-hidden transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                          editAvatar === choice.url
                            ? 'border-eco-forest ring-1 ring-eco-sage shadow-xs'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={choice.url}
                          className="w-6 h-6 rounded-full object-cover"
                          alt={choice.name}
                        />
                        <span className="text-[7px] font-bold text-stone-500 truncate w-full">{choice.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full px-2.5 py-1.5 mt-1 bg-stone-50 border border-stone-200 text-[9px] rounded-lg text-stone-605 focus:outline-none"
                    placeholder="Link personalizado da foto (URL)..."
                  />
                  
                  {/* Engagement prompt */}
                  <div className="mt-2.5 bg-eco-forest/10 border border-eco-sage/30 rounded-xl p-2.5 text-eco-forest">
                    <p className="text-[9px] font-bold leading-normal">
                      💡 <strong>Dica de Vendedor:</strong> Usar uma <strong>foto sua real</strong> ou a <strong>logo oficial</strong> da sua empresa/ateliê transmite muito mais confiança, cria um laço humano autêntico com quem apoia projetos reciclados e impulsiona seu volume de compras e contatos!
                    </p>
                  </div>
                </div>
              </div>

              {/* Banner Selector and Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-700 block text-[11px] uppercase tracking-wide font-mono">Banner do Ateliê</label>
                  {editBanner && (
                    <button
                      type="button"
                      onClick={() => setEditBanner('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80')}
                      className="text-[9px] text-rose-600 font-bold hover:underline"
                    >
                      Restaurar padrão
                    </button>
                  )}
                </div>
                
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingBanner(true); }}
                  onDragLeave={() => setIsDraggingBanner(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingBanner(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        addToast('Por favor, envie apenas arquivos de imagem.', 'error');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        if (evt.target?.result) {
                          setEditBanner(evt.target.result as string);
                          addToast('Banner de perfil importado!', 'success');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`p-4 border-2 border-dashed rounded-2xl text-center transition-all ${
                    isDraggingBanner 
                      ? 'border-eco-forest bg-eco-forest/5' 
                      : 'border-stone-200 hover:border-eco-sage bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className="w-16 h-8 rounded-lg overflow-hidden border border-eco-sage bg-stone-50 shrink-0 shadow-xs relative mx-auto">
                        <img
                          src={editBanner}
                          alt="Banner Preview Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                      </div>
                      <label htmlFor="perfil-banner-file" className="absolute -bottom-1.5 -right-1.5 p-1 bg-eco-forest hover:bg-eco-leaf text-white rounded-full cursor-pointer shadow-md transition-colors">
                        <Camera className="w-3 h-3" />
                        <input
                          id="perfil-banner-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setEditBanner(evt.target.result as string);
                                  addToast('Banner de perfil carregado!', 'success');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <p className="text-[10px] text-stone-600 font-bold leading-none mt-1">
                      Arraste o banner ou <span className="text-eco-forest underline cursor-pointer">clique aqui</span>
                    </p>
                    <p className="text-[8px] text-stone-400 font-medium">JPEG, PNG ou WEBP.</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-stone-400 font-bold block">Ou escolha um banner artesanal pré-definido:</span>
                  <div className="grid grid-cols-5 gap-1">
                    {bannerChoices.map((choice) => (
                      <button
                        key={choice.name}
                        type="button"
                        onClick={() => setEditBanner(choice.url)}
                        className={`relative p-0.5 rounded-lg border bg-white overflow-hidden transition-all text-center flex flex-col items-center cursor-pointer ${
                          editBanner === choice.url
                            ? 'border-eco-forest ring-1 ring-eco-sage shadow-xs'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                        title={choice.name}
                      >
                        <img
                          src={choice.url}
                          className="w-full h-5 rounded-md object-cover"
                          alt={choice.name}
                        />
                        <span className="text-[6px] font-bold text-stone-500 truncate w-full mt-0.5">{choice.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={editBanner}
                    onChange={(e) => setEditBanner(e.target.value)}
                    className="w-full px-2.5 py-1.5 mt-1 bg-stone-50 border border-stone-200 text-[9px] rounded-lg text-stone-605 focus:outline-none"
                    placeholder="Link personalizado do banner (URL)..."
                  />
                </div>
              </div>

            </div>

            {/* Seller Contact Methods Section */}
            <div className="space-y-3 pt-3 border-t border-stone-200/60">
              <h3 className="font-bold text-stone-700 text-[11px] uppercase tracking-wide">Canais de Contato de Vendas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-550 block text-[10px]">WhatsApp (com DDD)</label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none"
                    placeholder="Ex: 5541999999999"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-550 block text-[10px] font-mono">Instagram (Sem @)</label>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value.replace(/^@/, ''))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none"
                    placeholder="Ex: atelie_madeiras"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-550 block text-[10px] font-mono">Facebook</label>
                  <input
                    type="text"
                    value={editFacebook}
                    onChange={(e) => setEditFacebook(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none"
                    placeholder="Ex: paginadosenhor"
                  />
                </div>
              </div>
            </div>

            {/* Form actions triggers */}
            <div className="flex gap-2 justify-end pt-3 border-t border-stone-200/60">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-stone-200 hover:bg-stone-100 rounded-xl font-bold text-stone-500 text-xs cursor-pointer transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Perfil</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-1 flex flex-col md:flex-row gap-5 md:gap-7 items-start relative">
            
            {/* Circular avatar hanging off banner */}
            <div className="-mt-16 sm:-mt-24 relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-eco-sage/20 relative z-10"
              />
            </div>

            <div className="flex-1 space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-none">
                    {currentUser.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-eco-wood" />
                      <span>{currentUser.city || 'Curitiba'}, {currentUser.state || 'PR'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-eco-sage" />
                      <span className="text-eco-forest font-semibold text-[10px] uppercase font-mono tracking-wider">
                        {currentUser.isCreator ? 'Artesão Certificado' : 'Eco Consumidor'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons sharing and editing profile */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditName(currentUser.name || '');
                      setEditCity(currentUser.city || '');
                      setEditState(currentUser.state || '');
                      setEditAvatar(currentUser.avatar || '');
                      setEditBanner(currentUser.banner || '');
                      setEditBio(currentUser.bio || '');
                      setEditWhatsapp(currentUser.contactWhatsapp || '');
                      setEditInstagram(currentUser.contactInstagram || '');
                      setEditFacebook(currentUser.contactFacebook || '');
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-eco-forest hover:bg-eco-leaf text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar Perfil</span>
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 text-stone-605 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>

              {/* Profile Bio */}
              <p className="text-xs text-stone-605 max-w-2xl leading-relaxed">
                {currentUser.bio || 'Criando caminhos circulares para reaproveitamento de madeiras de demolição, galhos e pallets velhos. Conectando o orgânico ao funcional.'}
              </p>

              {/* Computed Real-time Eco-Badges (Low-DB Dynamic Gamification) */}
              <div className="pt-5 border-t border-stone-150/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
                    <div>
                      <h3 className="text-xs font-extrabold text-stone-905 uppercase tracking-wide font-mono flex items-center gap-1.5">
                        Eco-Selo Desafios de Vendedor
                        <span className="text-[10px] px-2 py-0.5 bg-eco-forest/10 text-eco-forest rounded-full font-bold">
                          {earnedBadgesCount}/{ecoBadgesList.length} Selos
                        </span>
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-0.5">Sua reputação sustentável calculada dinamicamente através de suas ações no app.</p>
                    </div>
                  </div>
                  
                  {/* Badge filters buttons */}
                  <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 p-1 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setBadgeFilter('all')}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                        badgeFilter === 'all' 
                          ? 'bg-eco-forest text-white shadow-xs' 
                          : 'text-stone-500 hover:text-stone-850'
                      }`}
                    >
                      Todos ({ecoBadgesList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeFilter('earned')}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                        badgeFilter === 'earned' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-stone-500 hover:text-stone-850'
                      }`}
                    >
                      Conquistados ({earnedBadgesCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeFilter('locked')}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                        badgeFilter === 'locked' 
                          ? 'bg-stone-500 text-white shadow-xs' 
                          : 'text-stone-500 hover:text-stone-850'
                      }`}
                    >
                      Bloqueados ({ecoBadgesList.length - earnedBadgesCount})
                    </button>
                  </div>
                </div>

                {/* Progress bar rank */}
                <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-stone-700 font-mono">Nível de Afinidade Ambiental</span>
                    <span className="font-extrabold text-eco-forest font-mono">
                      {earnedBadgesCount === ecoBadgesList.length 
                        ? 'Guardião Absoluto do Planeta 🌟' 
                        : earnedBadgesCount >= 30 
                        ? 'Ecopropagador Lendário 🏆' 
                        : earnedBadgesCount >= 20 
                        ? 'Eco-Artesão Guardião do Amanhã 🪵' 
                        : earnedBadgesCount >= 10 
                        ? 'Artesão Protetor Avançado 🌱' 
                        : earnedBadgesCount >= 5 
                        ? 'Iniciador Sustentável Ativo 🌿' 
                        : 'Reciclador Aprendiz 🪵'
                      }
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-eco-forest to-blue-600 transition-all duration-700" 
                      style={{ width: `${(earnedBadgesCount / ecoBadgesList.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-[9.5px] text-stone-550 leading-relaxed">
                    Sua pontuação ambiental cresce à medida que você cadastra materiais de madeira upcycled, recebe curtidas, acumula boas conexões de WhatsApp e mantém o perfil completo.
                  </p>
                </div>

                {/* Compact badges grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                  {(() => {
                    const filteredBadgesToShow = ecoBadgesList.filter(b => {
                      if (badgeFilter === 'earned') return b.active;
                      if (badgeFilter === 'locked') return !b.active;
                      return true; // 'all'
                    });

                    const sortedBadges = [...filteredBadgesToShow].sort((a, b) => {
                      if (a.active && !b.active) return -1;
                      if (!a.active && b.active) return 1;
                      return 0;
                    });

                    if (sortedBadges.length === 0) {
                      return (
                        <div className="col-span-full py-10 text-center text-stone-400 text-[10px] italic">
                          Nenhum selo correspondente encontrado nesta categoria.
                        </div>
                      );
                    }

                    return sortedBadges.map((badge) => {
                      const IconComponent = badge.icon;
                      return (
                        <div 
                          key={badge.id}
                          className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                            badge.active 
                              ? `bg-gradient-to-br ${badge.color} shadow-xs border-emerald-500/25 hover:scale-[1.01]` 
                              : 'bg-stone-50/50 border-stone-150 opacity-60 hover:opacity-85'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className={`p-1.5 rounded-xl ${
                                badge.active ? 'bg-white/90 text-stone-900 shadow-xs' : 'bg-stone-150 text-stone-400'
                              }`}>
                                <IconComponent className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex gap-1 items-center">
                                <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 bg-stone-200/50 text-stone-605 rounded-md uppercase">
                                  {badge.categoryBadge}
                                </span>
                                {badge.active ? (
                                  <span className="text-[8.5px] px-1.5 py-0.2 bg-emerald-600 text-white rounded font-bold font-mono">ATIVO</span>
                                ) : (
                                  <span className="text-[8px] px-1.5 py-0.2 bg-stone-200 text-stone-500 rounded font-bold font-mono">INATIVO</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-[11px] text-stone-900 leading-tight">
                                {badge.name}
                              </h4>
                              <p className="text-[9.5px] text-stone-550 font-medium leading-tight">
                                {badge.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2.5 mt-2.5 border-t border-stone-200/40 flex flex-col gap-1.5">
                            <p className="text-[9px] text-stone-500 leading-tight">
                              <strong>Requisito:</strong> {badge.requirement}
                            </p>
                            <div className="flex items-center justify-between text-[9px] font-mono">
                              <span className="text-stone-450">Progresso atual:</span>
                              <span className={`font-bold ${badge.active ? 'text-emerald-700' : 'text-stone-600'}`}>
                                {badge.progress}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Active Channels Contacts Strip */}
              {(currentUser.contactWhatsapp || currentUser.contactInstagram || currentUser.contactFacebook) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 pb-1 border-t border-stone-100/60">
                  <span className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wide">Contatos Ativos:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.contactWhatsapp && (
                      <a
                        href={`https://wa.me/${currentUser.contactWhatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-700 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all"
                        title="Chamar no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {currentUser.contactInstagram && (
                      <a
                        href={`https://instagram.com/${currentUser.contactInstagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all"
                        title="Ver Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        <span>@{currentUser.contactInstagram}</span>
                      </a>
                    )}

                    {currentUser.contactFacebook && (
                      <a
                        href={`https://facebook.com/${currentUser.contactFacebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all"
                        title="Ver Facebook"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                        <span>Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Metrics parameters list (followers, following, publications) */}
              <div className="flex gap-6 sm:gap-10 pt-2.5 text-xs border-t border-stone-100">
                <div className="flex gap-1">
                  <span className="font-extrabold text-stone-900">
                    {activeTab === 'posts' ? myPublications.length : currentUser.postsCount || myPublications.length}
                  </span>
                  <span className="text-stone-500">publicações</span>
                </div>
                <div className="flex gap-1 cursor-pointer hover:text-eco-forest">
                  <span className="font-extrabold text-stone-900">
                    {(currentUser.followersCount ?? 0).toLocaleString('pt-BR')}
                  </span>
                  <span className="text-stone-500">seguidores</span>
                </div>
                <div className="flex gap-1 cursor-pointer hover:text-eco-forest">
                  <span className="font-extrabold text-stone-900">
                    {currentUser.followingCount ?? 0}
                  </span>
                  <span className="text-stone-500">seguindo</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Grid Tabs: Instagram Style */}
      <section className="space-y-6">
        <div className="flex justify-center border-b border-stone-200">
          <div className="flex gap-6 sm:gap-14 -mb-[1px]">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'posts'
                  ? 'border-eco-forest text-eco-forest'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Minhas Peças ({myPublications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('likes')}
              className={`flex items-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'likes'
                  ? 'border-eco-forest text-eco-forest'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Curtidas ({myLikedProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('saves')}
              className={`flex items-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'saves'
                  ? 'border-eco-forest text-eco-forest'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Salvas ({mySavedProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-eco-forest text-eco-forest'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Personalização</span>
            </button>
          </div>
        </div>

        {/* Tab content listings */}
        <div>
          {activeTab === 'settings' ? (
            <div className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-10 space-y-8 shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-eco-sage" />
                  <span>Configurações de Fontes & Acessibilidade</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Personalize as fontes de leitura e os tamanhos das letras para otimizar sua visualização do catálogo e as interações na rede orgânica do EcoFlow. Suas preferências dão um novo estilo instantaneamente em todo o site.
                </p>
              </div>

              {/* Font Family Selection */}
              <div className="space-y-3">
                <span className="text-[11px] font-black tracking-wider text-stone-500 uppercase font-mono">
                  1. Estilo da Fonte (Font-Family):
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFontFamily('sans');
                      addToast('Fonte alterada para Inter (Sans-serif)!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fontFamily === 'sans'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold">Padrão Moderno (Inter)</p>
                    <p className="text-[9.5px] text-stone-450 mt-1">Visualização geométrica, limpa e ideal para telas.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontFamily('outfit');
                      addToast('Fonte alterada para Outfit!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fontFamily === 'outfit'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold" style={{ fontFamily: '"Outfit", sans-serif' }}>Suave Arredondada (Outfit)</p>
                    <p className="text-[9.5px] text-stone-450 mt-1">Visual moderno, convidativo e de altíssimo refinamento.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontFamily('space');
                      addToast('Fonte alterada para Space Grotesk!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fontFamily === 'space'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Ecológica Moderna (Grotesk)</p>
                    <p className="text-[9.5px] text-stone-450 mt-1">Estilo de vanguarda contemporânea de design circular.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontFamily('serif');
                      addToast('Fonte alterada para Lora (Serif)!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fontFamily === 'serif'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold" style={{ fontFamily: '"Lora", serif' }}>Artesanal / Literatura (Lora)</p>
                    <p className="text-[9.5px] text-stone-450 mt-1">Visual de revista, editorial rico e artesanal.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontFamily('playfair');
                      addToast('Fonte alterada para Playfair Display!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fontFamily === 'playfair'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>Luxo Editorial (Playfair)</p>
                    <p className="text-[9.5px] text-stone-450 mt-1">Visual elegante de grifes sustentáveis de luxo.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontFamily('mono');
                      addToast('Fonte alterada para JetBrains Mono!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      fontFamily === 'mono'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold font-mono">Técnico / Industrial (Mono)</p>
                    <p className="text-[9.5px] text-stone-450 mt-1 font-mono">Pegada limpa e industrial de especificações de estúdio.</p>
                  </button>
                </div>
              </div>

              {/* Font Size Selection */}
              <div className="space-y-3">
                <span className="text-[11px] font-black tracking-wider text-stone-550 uppercase font-mono">
                  2. Tamanho das Letras (Font-Size):
                </span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFontSize('compact');
                      addToast('Tamanho dos textos redefinido para Compacto!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fontSize === 'compact'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold">Compacto (Letra Fina)</p>
                    <p className="text-[9px] text-stone-450 mt-1">Ideal para telas menores (14px).</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontSize('normal');
                      addToast('Tamanho dos textos redefinido para o Padrão!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fontSize === 'normal'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold">Padrão da Rede</p>
                    <p className="text-[9px] text-stone-450 mt-1">Escala original equilibrada (16px).</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontSize('medium');
                      addToast('Tamanho de texto configurado para Confortável!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fontSize === 'medium'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold">Médio Confortável</p>
                    <p className="text-[9px] text-stone-450 mt-1">Aumentado para leitura sem cansaço (18.5px).</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontSize('large');
                      addToast('Tamanho de texto configurado para Letra Grande!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fontSize === 'large'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold">Leitura Ampliada</p>
                    <p className="text-[9px] text-stone-450 mt-1">Excelente nitidez e visibilidade (21px).</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFontSize('extralarge');
                      addToast('Acessibilidade máxima ativada!', 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fontSize === 'extralarge'
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest font-bold ring-2 ring-eco-forest/15'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold">Acessibilidade Máxima</p>
                    <p className="text-[9px] text-stone-450 mt-1">Tamanho super ampliado para baixa visão (23.5px).</p>
                  </button>
                </div>
              </div>

              {/* Live Preview Display Box */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-150 space-y-2 mt-4 select-none">
                <span className="text-[9px] font-mono uppercase tracking-widest text-eco-sage font-extrabold block">Amostra do Visual em Tempo Real:</span>
                <p className="text-[10px] font-bold font-mono text-eco-wood uppercase tracking-wider">UPCYCLING RESIDUÁRIO & DESCARTE CONSCIENTE</p>
                <h4 className="text-xl font-bold text-stone-900 leading-tight">Móveis e Utensílios de Altíssima Engenharia Ecológica</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Esta caixa simula a aparência exata dos nossos feeds. O EcoFlow é uma comunidade 100% orgânica onde você entra em contato direto com o vendedor pelo WhatsApp ou Instagram sem commissions ou taxas surpresas.
                </p>
              </div>
            </div>
          ) : itemsToShow.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/60 p-6">
              {activeTab === 'posts' && (
                <>
                  <Grid className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-stone-850">Ainda nenhuma publicação de produto</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-4">
                    Compartilhe hoje seu primeiro item sofisticado de madeira reaproveitada com os consumidores.
                  </p>
                  <button
                    onClick={() => window.location.hash = '/publicar'}
                    className="px-4 py-2 bg-eco-forest hover:bg-eco-leaf text-white font-bold text-xs rounded-full shadow-md"
                  >
                    Fazer Primeira Publicação
                  </button>
                </>
              )}
              {activeTab === 'likes' && (
                <>
                  <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-stone-850">Nenhum produto curtido</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                    Explore o feed ecológico e deixe seu like de carinho nos trabalhos dos demais produtores.
                  </p>
                </>
              )}
              {activeTab === 'saves' && (
                <>
                  <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-stone-850">Nenhuma peça salva</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                    Guarde referências de móveis premium para ver os detalhes de dimensões mais tarde.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToShow.map((item) => (
                <div key={item.id}>
                  <CardProduto product={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
