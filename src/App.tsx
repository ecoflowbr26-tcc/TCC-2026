/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EcoProvider } from './contexts/EcoContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Import Pages
import { Home } from './pages/Home';
import { Feed } from './pages/Feed';
import { Explorar } from './pages/Explorar';
import { Perfil } from './pages/Perfil';
import { Cadastro } from './pages/Cadastro';
import { Login } from './pages/Login';
import { PublicarProduto } from './pages/PublicarProduto';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { Personalizar } from './pages/Personalizar';

export default function App() {
  return (
    <EcoProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-eco-cream text-stone-900 selection:bg-eco-moss selection:text-white">
          
          {/* Fixed Glassmorphic Navigation Bar */}
          <Navbar />

          {/* Core Content Layout Viewport Offset (Navbar height margin) */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/publicar" element={<PublicarProduto />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/personalizar" element={<Personalizar />} />
              <Route path="*" element={<Home />} /> {/* Route fallback to assure zero broken links */}
            </Routes>
          </main>

          {/* Floating alert notification system */}
          <ToastContainer />

          {/* Detailed circular footer branding info */}
          <Footer />

        </div>
      </Router>
    </EcoProvider>
  );
}
