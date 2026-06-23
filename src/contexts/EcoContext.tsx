/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Comment, Category, ToastMessage, Report } from '../types';
import { EcoApi, isBackendConfigured } from '../services/api';

interface EcoContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  likedProductIds: string[];
  savedProductIds: string[];
  interestedProductIds: string[];
  toasts: ToastMessage[];
  reports: Report[];
  login: (email: string, pass: string) => boolean;
  register: (
    name: string,
    email: string,
    pass: string,
    avatar: string,
    city?: string,
    state?: string,
    contactWhatsapp?: string,
    contactInstagram?: string,
    contactFacebook?: string
  ) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Product Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'likesCount' | 'comments' | 'interestsCount' | 'creatorId' | 'creatorName' | 'creatorAvatar'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  toggleLike: (productId: string) => void;
  toggleSave: (productId: string) => void;
  expressInterest: (productId: string) => void;
  addComment: (productId: string, text: string, rating: number) => void;
  addReport: (productId: string, productTitle: string, reason: string, reporterName: string) => void;
  deleteReport: (id: string) => void;
  toggleUserActivation: (userId: string) => void;
  resetAllSystemData: () => void;

  // Site Customization Settings
  fontFamily: string;
  fontSize: string;
  setFontFamily: (font: string) => void;
  setFontSize: (size: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const EcoContext = createContext<EcoContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'admin_eco',
  name: 'Administrador EcoFlow',
  email: 'ecoflowbr26@gmail.com',
  avatar: 'https://images.pexels.com/photos/30596227/pexels-photo-30596227.png?_gl=1*9gu1r0*_ga*MTIwOTE4ODM5Ny4xNzgyMTI1Mjk0*_ga_8JE65Q40S6*czE3ODIxMjUyOTMkbzEkZzEkdDE3ODIxMjUzMTkkajM0JGwwJGgw',
  bio: 'Painel Central de Moderação e Administração do Portal EcoFlow.',
  city: 'Curitiba',
  state: 'PR',
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  isCreator: true,
  isAdmin: true,
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  contactWhatsapp: '',
  contactInstagram: '',
  contactFacebook: ''
};

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults with version reset check
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (!localStorage.getItem('ecoflow_clean_reset_v20_clean_final')) {
      localStorage.removeItem('ecoflow_products');
      localStorage.removeItem('ecoflow_liked_ids');
      localStorage.removeItem('ecoflow_saved_ids');
      localStorage.removeItem('ecoflow_current_user');
      localStorage.removeItem('ecoflow_users');
      localStorage.removeItem('ecoflow_interested_ids');
      localStorage.removeItem('ecoflow_reports');
      localStorage.setItem('ecoflow_clean_reset_v20_clean_final', 'true');
      return null;
    }
    const saved = localStorage.getItem('ecoflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ecoflow_users');
    return saved ? JSON.parse(saved) : [DEFAULT_USER];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ecoflow_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedProductIds, setLikedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecoflow_liked_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecoflow_saved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [interestedProductIds, setInterestedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecoflow_interested_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('ecoflow_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [fontFamily, setFontFamilyState] = useState<string>(() => {
    return localStorage.getItem('ecoflow_font_family') || 'sans';
  });

  const [fontSize, setFontSizeState] = useState<string>(() => {
    return localStorage.getItem('ecoflow_font_size') || 'normal';
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem('ecoflow_dark_mode') === 'true';
  });

  const setFontFamily = (font: string) => {
    setFontFamilyState(font);
    localStorage.setItem('ecoflow_font_family', font);
  };

  const setFontSize = (size: string) => {
    setFontSizeState(size);
    localStorage.setItem('ecoflow_font_size', size);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem('ecoflow_dark_mode', String(dark));
  };

  // Synchronize CSS custom properties directly on root
  useEffect(() => {
    const root = document.documentElement;

    // Dark Mode Sync
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Font Family Mapping
    let cssFont = '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif';
    let cssHeadingFont = '"Lora", "Playfair Display", Georgia, serif';

    if (fontFamily === 'serif') {
      cssFont = '"Lora", serif';
      cssHeadingFont = '"Lora", serif';
    } else if (fontFamily === 'playfair') {
      cssFont = '"Playfair Display", serif';
      cssHeadingFont = '"Playfair Display", serif';
    } else if (fontFamily === 'space') {
      cssFont = '"Space Grotesk", sans-serif';
      cssHeadingFont = '"Space Grotesk", sans-serif';
    } else if (fontFamily === 'outfit') {
      cssFont = '"Outfit", sans-serif';
      cssHeadingFont = '"Outfit", sans-serif';
    } else if (fontFamily === 'mono') {
      cssFont = '"JetBrains Mono", monospace';
      cssHeadingFont = '"JetBrains Mono", monospace';
    }

    root.style.setProperty('--site-font-family', cssFont);
    root.style.setProperty('--site-font-family-headings', cssHeadingFont);

    // Font Size Mapping
    let cssSize = '16px';
    let scaleVal = '1';
    if (fontSize === 'compact') {
      cssSize = '14px';
      scaleVal = (14 / 16).toString();
    } else if (fontSize === 'medium') {
      cssSize = '18.5px';
      scaleVal = (18.5 / 16).toString();
    } else if (fontSize === 'large') {
      cssSize = '21px';
      scaleVal = (21 / 16).toString();
    } else if (fontSize === 'extralarge') {
      cssSize = '23.5px';
      scaleVal = (23.5 / 16).toString();
    }

    root.style.setProperty('--site-font-size', cssSize);
    root.style.setProperty('--font-scale', scaleVal);
  }, [fontFamily, fontSize, darkMode]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('ecoflow_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ecoflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ecoflow_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ecoflow_liked_ids', JSON.stringify(likedProductIds));
  }, [likedProductIds]);

  useEffect(() => {
    localStorage.setItem('ecoflow_saved_ids', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  useEffect(() => {
    localStorage.setItem('ecoflow_interested_ids', JSON.stringify(interestedProductIds));
  }, [interestedProductIds]);

  useEffect(() => {
    localStorage.setItem('ecoflow_reports', JSON.stringify(reports));
  }, [reports]);

  // Load initial backend data if configured
  useEffect(() => {
    if (isBackendConfigured()) {
      const initBackend = async () => {
        try {
          const status = await EcoApi.checkHealth();
          console.log('EcoFlow API Status:', status);
          addToast('Servidor NodeJS Conectado!', 'success');
          
          const dbUsers = await EcoApi.getUsers();
          if (dbUsers && dbUsers.length > 0) {
            setUsers(dbUsers);
          }
          
          const dbProducts = await EcoApi.getProducts();
          if (dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts);
          }

          const dbReports = await EcoApi.getReports();
          if (dbReports) {
            setReports(dbReports);
          }
        } catch (error) {
          console.warn('Backend indisponível no momento. Executando em Modo Sandbox Local off-line.', error);
          addToast('Modo Sandbox Local Ativo (Off-line)', 'info');
        }
      };
      
      initBackend();
    }
  }, []);

  // Toast functions
  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
const login = async (
  email: string,
  pass: string
): Promise<boolean> => {
  try {
    const user = await EcoApi.login(email, pass);

    setCurrentUser(user);

    addToast('Login realizado com sucesso!', 'success');

    return true;
  } catch (error: any) {
    addToast(
      error.message || 'Usuário ou senha inválidos',
      'error'
    );

    return false;
  }
};

  const register = (
    name: string,
    email: string,
    pass: string,
    avatar: string,
    city?: string,
    state?: string,
    contactWhatsapp?: string,
    contactInstagram?: string,
    contactFacebook?: string
  ) => {
    const sanitizedEmail = email.toLowerCase().trim();
    if (users.some((u) => u.email.toLowerCase() === sanitizedEmail)) {
      addToast('Este e-mail já está sendo utilizado.', 'error');
      return;
    }

    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name,
      email: sanitizedEmail,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Novo criador de impacto na rede EcoFlow! 🌿💚',
      city: city || 'São Paulo',
      state: state || 'SP',
      followersCount: 0,
      followingCount: 5,
      postsCount: 0,
      isCreator: true,
      banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      contactWhatsapp,
      contactInstagram,
      contactFacebook
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast('Conta criada com sucesso! Boas eco-compras.', 'success');

    // Sync register with API if configured
    if (isBackendConfigured()) {
      EcoApi.register({
        id: newUser.id,
        name,
        email: sanitizedEmail,
        avatar: newUser.avatar,
        bio: newUser.bio,
        city: newUser.city,
        state: newUser.state,
        banner: newUser.banner,
        contactWhatsapp: newUser.contactWhatsapp,
        contactInstagram: newUser.contactInstagram,
        contactFacebook: newUser.contactFacebook,
        isCreator: true,
        pass
      }).catch(err => {
        console.error('Falha de sincronização de registro com o backend:', err);
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Você saiu da sua conta.', 'info');
  };

  const updateUser = (fields: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...fields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    addToast('Perfil atualizado com sucesso!', 'success');
  };

  // Product Operations
  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'likesCount' | 'comments' | 'interestsCount' | 'creatorId' | 'creatorName' | 'creatorAvatar'>
  ) => {
    if (!currentUser) {
      addToast('Faça login para publicar um produto.', 'error');
      return;
    }

    const newProduct: Product = {
      ...productData,
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      comments: [],
      interestsCount: 0,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorBio: currentUser.bio,
      contactWhatsapp: productData.contactWhatsapp || currentUser.contactWhatsapp,
      contactInstagram: productData.contactInstagram || currentUser.contactInstagram,
      contactFacebook: productData.contactFacebook || currentUser.contactFacebook,
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Increment profile post count
    const updatedUser = { ...currentUser, postsCount: (currentUser.postsCount || 0) + 1 };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    addToast('Eco-produto publicado com sucesso!', 'success');

    // Sync creation with backend if configured
    if (isBackendConfigured()) {
      EcoApi.createProduct(newProduct).catch(err => {
        console.error('Falha de sincronização de criação de produto:', err);
      });
    }
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updatedFields };
        }
        return p;
      })
    );
    addToast('Publicação editada com sucesso!', 'success');

    // Sync modification with backend if configured
    if (isBackendConfigured()) {
      EcoApi.updateProduct(id, updatedFields).catch(err => {
        console.error('Falha de sincronização de edição de produto:', err);
      });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    
    // Decrement post count for current user
    if (currentUser) {
      const updatedUser = { ...currentUser, postsCount: Math.max(0, (currentUser.postsCount || 1) - 1) };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
    
    addToast('Publicação removida com sucesso!', 'success');

    // Sync removal with backend if configured
    if (isBackendConfigured()) {
      EcoApi.deleteProduct(id).catch(err => {
        console.error('Falha de sincronização de remoção de produto:', err);
      });
    }
  };

  const clearAllProducts = () => {
    setProducts([]);
    setUsers((prev) => prev.map((u) => ({ ...u, postsCount: 0 })));
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, postsCount: 0 } : null);
    }
    setLikedProductIds([]);
    setSavedProductIds([]);
    setInterestedProductIds([]);
    setReports([]);
    
    localStorage.removeItem('ecoflow_products');
    localStorage.removeItem('ecoflow_liked_ids');
    localStorage.removeItem('ecoflow_saved_ids');
    localStorage.removeItem('ecoflow_interested_ids');
    localStorage.removeItem('ecoflow_reports');
    
    addToast('Todos os produtos do sistema foram limpos e redefinidos!', 'success');
  };

  const toggleLike = (productId: string) => {
    let isLiked = false;
    setLikedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        isLiked = true;
        return [...prev, productId];
      }
    });

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, likesCount: Math.max(0, p.likesCount + (isLiked ? 1 : -1)) };
        }
        return p;
      })
    );

    addToast(isLiked ? 'Produto curtido!' : 'Curtida removida.', 'info');

    // Sync write-through with backend if configured
    if (isBackendConfigured() && currentUser) {
      EcoApi.toggleLikeProduct(productId, currentUser.id).catch(err => {
        console.error('Falha de sincronização de curtida com o backend:', err);
      });
    }
  };

  const toggleSave = (productId: string) => {
    let isSaved = false;
    setSavedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        isSaved = true;
        return [...prev, productId];
      }
    });

    addToast(isSaved ? 'Produto guardado nos seus salvos!' : 'Produto removido dos salvos.', 'info');

    // Sync write-through with backend if configured
    if (isBackendConfigured() && currentUser) {
      EcoApi.toggleSaveProduct(productId, currentUser.id).catch(err => {
        console.error('Falha de sincronização de salvamento com o backend:', err);
      });
    }
  };

  const expressInterest = (productId: string) => {
    let isInterested = false;
    setInterestedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev; // Already interested, avoid duplicates
      } else {
        isInterested = true;
        return [...prev, productId];
      }
    });

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, interestsCount: p.interestsCount + (isInterested ? 1 : 0) };
        }
        return p;
      })
    );

    addToast('Interesse enviado ao produtor! Você receberá contato.', 'success');

    // Sync write-through with backend if configured
    if (isBackendConfigured() && currentUser) {
      EcoApi.expressInterestInProduct(productId, currentUser.id).catch(err => {
        console.error('Falha de sincronização de interesse com o backend:', err);
      });
    }
  };

  const addComment = (productId: string, text: string, rating: number) => {
    if (!currentUser) {
      addToast('Faça login para avaliar.', 'error');
      return;
    }

    const newComment: Comment = {
      id: 'comm_' + Math.random().toString(36).substr(2, 9),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    addToast('Sua avaliação foi publicada!', 'success');

    // Sync write-through with backend if configured
    if (isBackendConfigured()) {
      EcoApi.addComment(productId, {
        authorId: newComment.authorId,
        authorName: newComment.authorName,
        authorAvatar: newComment.authorAvatar,
        text: newComment.text,
        rating: newComment.rating
      }).catch(err => {
        console.error('Falha de sincronização de avaliação com o backend:', err);
      });
    }
  };

  const addReport = (productId: string, productTitle: string, reason: string, reporterName: string) => {
    const newReport: Report = {
      id: 'rep_' + Math.random().toString(36).substr(2, 9),
      productId,
      productTitle,
      reason,
      reporterName,
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    addToast('Denúncia recebida e registrada! O suporte irá analisar o conteúdo.', 'info');

    // Sync write-through with backend if configured
    if (isBackendConfigured()) {
      EcoApi.createReport(newReport).catch(err => {
        console.error('Falha de sincronização de denúncia com o backend:', err);
      });
    }
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    addToast('Denúncia arquivada com sucesso.', 'success');

    // Sync write-through with backend if configured
    if (isBackendConfigured()) {
      EcoApi.deleteReport(id).catch(err => {
        console.error('Falha de sincronização de exclusão de denúncia com o backend:', err);
      });
    }
  };

  const toggleUserActivation = (userId: string) => {
    let nextInactiveState = false;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          nextInactiveState = !u.isInactive;
          return { ...u, isInactive: nextInactiveState };
        }
        return u;
      })
    );

    // Automatically cascade to inactive state for all of this seller's products
    setProducts((prev) =>
      prev.map((p) => {
        if (p.creatorId === userId) {
          return { ...p, isInactive: nextInactiveState };
        }
        return p;
      })
    );

    addToast(
      `Soberania de Controle: Conta e todos os anúncios do vendedor foram ${nextInactiveState ? 'inativados 🙈' : 'reativados 👁️'} em lote!`,
      'info'
    );

    // Sync write-through with backend if configured
    if (isBackendConfigured()) {
      EcoApi.toggleUserActivation(userId).catch(err => {
        console.error('Falha de sincronização de ativação de vendedor com o backend:', err);
      });
    }
  };

  const resetAllSystemData = () => {
    // 1. Wipe all product lists
    setProducts([]);
    
    // 2. Clear out all user accounts except standard Admin
    const adminUser = DEFAULT_USER;
    setUsers([adminUser]);
    
    // 3. Keep the administrator session active so they aren't kicked out
    setCurrentUser(adminUser);
    
    // 4. Wipe secondary storage states
    setLikedProductIds([]);
    setSavedProductIds([]);
    setInterestedProductIds([]);
    setReports([]);

    // 5. Hard sync with localStorage immediately
    localStorage.setItem('ecoflow_products', JSON.stringify([]));
    localStorage.setItem('ecoflow_users', JSON.stringify([adminUser]));
    localStorage.setItem('ecoflow_current_user', JSON.stringify(adminUser));
    localStorage.setItem('ecoflow_liked_ids', JSON.stringify([]));
    localStorage.setItem('ecoflow_saved_ids', JSON.stringify([]));
    localStorage.setItem('ecoflow_interested_ids', JSON.stringify([]));
    localStorage.setItem('ecoflow_reports', JSON.stringify([]));
    localStorage.setItem('ecoflow_clean_reset_v15_final', 'true');

    addToast('O portal EcoFlow foi totalmente restaurado do zero!', 'success');

    // Sync write-through with backend if configured
    if (isBackendConfigured()) {
      EcoApi.resetAllSystemData().catch(err => {
        console.error('Falha de sincronização de redefinição de sistema com o backend:', err);
      });
    }
  };

  return (
    <EcoContext.Provider
      value={{
        currentUser,
        users,
        products,
        likedProductIds,
        savedProductIds,
        interestedProductIds,
        toasts,
        login,
        register,
        logout,
        updateUser,
        addToast,
        removeToast,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        toggleLike,
        toggleSave,
        expressInterest,
        addComment,
        reports,
        addReport,
        deleteReport,
        toggleUserActivation,
        resetAllSystemData,
        fontFamily,
        fontSize,
        setFontFamily,
        setFontSize,
        darkMode,
        setDarkMode
      }}
    >
      {children}
    </EcoContext.Provider>
  );
};

export const useEco = () => {
  const context = useContext(EcoContext);
  if (context === undefined) {
    throw new Error('useEco deve ser utilizado dentro de um EcoProvider');
  }
  return context;
};
