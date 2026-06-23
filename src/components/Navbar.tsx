/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { Leaf, Search, PlusCircle, LayoutDashboard, User as UserIcon, LogOut, LogIn, Menu, X, Heart, Bookmark, ShieldCheck, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useEco();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchVal, setSearchVal] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav id="app-navbar" className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-stone-200/50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div id="navbar-logo-mark" className="relative w-9 h-9 rounded-xl bg-eco-forest flex items-center justify-center text-white transition-all duration-300 group-hover:bg-eco-leaf shadow-xs">
              <Leaf className="w-5 h-5 text-eco-cream transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              {/* Subtle top-right organic pip indicator */}
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-eco-moss" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-eco-forest leading-none">
                EcoFlow
              </span>
              <span className="text-[8px] uppercase tracking-wider text-eco-sage font-mono font-bold -mt-0.5">
                Design Circular
              </span>
            </div>
          </Link>

          {/* Middle: Search bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Pesquisar produtos, criadores..."
                className="w-full pl-10 pr-4 py-2 border border-stone-200 bg-stone-50/50 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-eco-sage focus:border-eco-sage transition-all text-stone-700"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
            </div>
          </form>

          {/* Right: Actions Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
                isActive('/') ? 'text-eco-forest border-b-2 border-eco-forest pb-1 -mb-1' : 'text-stone-500 hover:text-eco-forest'
              }`}
            >
              Início
            </Link>

            <Link
              to="/feed"
              className={`text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
                isActive('/feed') ? 'text-eco-forest border-b-2 border-eco-forest pb-1 -mb-1' : 'text-stone-500 hover:text-eco-forest'
              }`}
            >
              Feed de Projetos
            </Link>
            
            <Link
              to="/explorar"
              className={`text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
                isActive('/explorar') ? 'text-eco-forest border-b-2 border-eco-forest pb-1 -mb-1' : 'text-stone-500 hover:text-eco-forest'
              }`}
            >
              Explorar
            </Link>

            <Link
              to="/personalizar"
              className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1 transition-colors ${
                isActive('/personalizar') ? 'text-eco-forest border-b-2 border-eco-forest pb-1 -mb-1' : 'text-stone-500 hover:text-eco-forest'
              }`}
              title="Personalizar fontes e tamanho"
            >
              <Palette className="w-4.5 h-4.5 text-eco-sage" />
              <span>Personalizar</span>
            </Link>

            {currentUser && currentUser.isAdmin && (
              <Link
                to="/admin"
                className={`text-xs font-black uppercase tracking-wider font-mono text-red-650 hover:text-red-700 flex items-center gap-1 transition-colors ${
                  isActive('/admin') ? 'border-b-2 border-red-650 pb-1 -mb-1' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Moderador</span>
              </Link>
            )}

            {currentUser ? (
              <>
                <Link
                  to="/publicar"
                  className="flex items-center gap-1.5 px-4 py-2 bg-eco-forest hover:bg-eco-leaf text-white transition-all text-xs font-semibold rounded-xl shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Anunciar</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`p-2 rounded-full relative transition-colors ${
                    isActive('/dashboard') ? 'bg-stone-100 text-eco-forest' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-750'
                  }`}
                  title="Meu Painel de Criador"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>

                {/* Profile dropdown trigger */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 focus:outline-none"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-eco-sage ring-2 ring-eco-sand"
                    />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileDropdownOpen(false)}
                        />
                        <motion.div
                          id="profile-dropdown-menu"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-stone-200/80 shadow-xl z-50 p-1.5 flex flex-col gap-0.5"
                        >
                          <div className="px-3.5 py-3 border-b border-stone-100 mb-1">
                            <p className="text-xs font-semibold text-stone-900 truncate">{currentUser.name}</p>
                            <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                          </div>
                          
                          <Link
                            to="/perfil"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-eco-cream transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-eco-sage" />
                            <span>Meu Eco Perfil</span>
                          </Link>

                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-eco-cream transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-eco-sage" />
                            <span>Minha Produção (Stats)</span>
                          </Link>

                          {currentUser.isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-655 hover:text-white rounded-lg hover:bg-red-500 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 shrink-0" />
                              <span>Painel do Administrador</span>
                            </Link>
                          )}

                          <div className="h-[1px] bg-stone-100 my-1" />

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-stone-250 hover:bg-stone-50 text-stone-700 transition-all text-xs font-medium rounded-full"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-2 bg-eco-forest text-white hover:bg-eco-leaf transition-all text-xs font-medium rounded-full"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Toggle Mobile Menu */}
          <div className="flex md:hidden items-center gap-3">
            {currentUser && (
              <Link to="/publicar" className="p-2 text-eco-leaf hover:bg-stone-100 rounded-full">
                <PlusCircle className="w-5 h-5" />
              </Link>
            )}
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-all"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="navbar-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-stone-200 bg-white overflow-hidden py-4 px-4 flex flex-col gap-4"
          >
            {/* Search (Mobile) */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2 border border-stone-200 bg-stone-50 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-eco-sage focus:bg-white"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
            </form>

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-bold ${isActive('/') ? 'text-eco-forest font-black' : 'text-stone-600'}`}
            >
              Início
            </Link>

            <Link
              to="/feed"
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-bold ${isActive('/feed') ? 'text-eco-forest font-black' : 'text-stone-600'}`}
            >
              Feed de Projetos
            </Link>

            <Link
              to="/explorar"
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-medium ${isActive('/explorar') ? 'text-eco-forest font-bold' : 'text-stone-600'}`}
            >
              Explorar Produtos
            </Link>

            <Link
              to="/personalizar"
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-bold flex items-center gap-1.5 transition-colors ${
                isActive('/personalizar') ? 'text-eco-forest' : 'text-stone-600 hover:text-eco-forest'
              }`}
            >
              <Palette className="w-4.5 h-4.5 text-eco-sage" />
              <span>Personalizar Visual</span>
            </Link>

            {currentUser && currentUser.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={`py-2 text-sm font-bold flex items-center gap-1.5 ${isActive('/admin') ? 'text-red-600' : 'text-red-500'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Moderação do Portal (Admin)</span>
              </Link>
            )}

            {currentUser ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setMenuOpen(false)}
                  className={`py-2 text-sm font-medium flex items-center gap-2 ${isActive('/perfil') ? 'text-eco-forest font-bold' : 'text-stone-600'}`}
                >
                  <img src={currentUser.avatar} className="w-6 h-6 rounded-full object-cover" />
                  <span>Perfil do Criador ({currentUser.name})</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`py-2 text-sm font-medium ${isActive('/dashboard') ? 'text-eco-forest font-bold' : 'text-stone-600'}`}
                >
                  Minha Produção (Dashboard)
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-left text-sm font-medium text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-stone-100">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-2 border border-stone-250 text-center text-stone-700 font-medium text-xs rounded-full"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-2 bg-eco-forest text-center text-white font-medium text-xs rounded-full"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
