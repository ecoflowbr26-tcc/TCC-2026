/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  city?: string;
  state?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isCreator: boolean;
  banner?: string;
  contactWhatsapp?: string;
  contactInstagram?: string;
  contactFacebook?: string;
  isAdmin?: boolean;
  isInactive?: boolean;
}

export interface Report {
  id: string;
  productId: string;
  productTitle: string;
  reason: string;
  reporterName: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number; // 1 a 5 estrelas
  text: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  material: string;
  productType: string; // e.g., "Móvel", "Decoração", "Vaso", "Utilitário", "Roupa", "Acessório"
  price: number;
  images: string[]; // Upload múltiplo de imagens
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorBio?: string;
  likesCount: number;
  comments: Comment[];
  city: string;
  state: string;
  createdAt: string;
  interestsCount: number;
  contactWhatsapp?: string;
  contactInstagram?: string;
  contactFacebook?: string;
  isInactive?: boolean;
  isSold?: boolean;
  
  // Custom properties for "Madeira Sustentável"
  isPremiumWood?: boolean;
  woodType?: string; // e.g., "Demolição", "Pinho de Pallet", "Peroba Rosa", "Cedro Reaproveitado"
  woodOrigin?: string; // e.g., "Antigo Barracão Industrial", "Pallets descartados de logística", "Sobras de marcenaria local"
  isArtisanal?: boolean;
  dimensions?: string; // e.g., "120 x 80 x 75 cm"
  priceRange?: string; // e.g., "R$ 1.200 - 1.500"
  socialPostUrl?: string; // Link para a publicação do produto em redes sociais (Instagram, TikTok, etc.)
}

export type Category =
  | 'Decoração'
  | 'Arte'
  | 'Moda Sustentável'
  | 'Jardinagem'
  | 'Utilidades Domésticas'
  | 'Reciclados Criativos'
  | 'Madeira Sustentável'
  | 'Móveis Sustentáveis'
  | 'Produtos Premium';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}
