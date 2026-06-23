/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { LogIn, Mail, Lock, KeyRound, Undo, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login: React.FC = () => {
  const { login, currentUser, addToast } = useEco();
  const navigate = useNavigate();

  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password Recovery State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleLoginSubmit = async (
  e: React.FormEvent
) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      addToast('Preencha os campos de e-mail e senha.', 'error');
      return;
    }

    const success = await login(email, password);
    if (success) {
      const lower = email.trim().toLowerCase();
      if (lower === 'ecoflowadmin@eco.com' || lower === 'ecoflowadimin@eco.com') {
        navigate('/admin');
      } else {
        navigate('/feed');
      }
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      addToast('Preencha o e-mail de recuperação.', 'error');
      return;
    }

    addToast(`Instruções de redefinição de senha enviadas para ${recoveryEmail}`, 'success');
    setIsForgotPassword(false);
    setRecoveryEmail('');
  };

  const handleFillUser = (emailVal: string, nameVal: string) => {
    setEmail(emailVal);
    setPassword('123456');
    addToast(`Dados de ${nameVal} preenchidos!`, 'info');
  };

  return (
    <div id="login-page" className="max-w-md mx-auto py-12">
      <AnimatePresence mode="wait">
        {!isForgotPassword ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-md space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-eco-forest/10 flex items-center justify-center text-eco-forest mx-auto">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Entrar no EcoFlow</h1>
              <p className="text-xs text-stone-550 max-w-xs mx-auto leading-normal">
                Faça login para gerenciar seus anúncios de móveis e projetos de upcycling.
                <span className="text-eco-forest font-bold block mt-1 col-span-2">Compradores e visitantes NÃO precisam de login ou conta para navegar e contatar vendedores!</span>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* E-mail */}
              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">Seu E-mail Cadastrado</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu E-mail Aqui"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-stone-600">Senha de Acesso</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] font-bold text-eco-wood hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-750"
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl transition-all shadow-md mt-6 cursor-pointer text-xs"
              >
                Entrar na Rede
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-stone-500 font-medium">
                Ainda não faz parte?{' '}
                <Link to="/cadastro" className="text-eco-forest font-bold hover:underline">
                  Cadastrar grátis
                </Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="recovery"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-md space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-eco-wood mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">Recuperar Senha</h1>
              <p className="text-xs text-stone-550 max-w-xs mx-auto leading-normal">
                Insira o seu e-mail cadastrado para enviarmos instruções seguras de redefinição de credenciais.
              </p>
            </div>

            <form onSubmit={handleRecoverySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-600 block">E-mail de Cadastro</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="Seu E-mail Aqui"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-stone-755"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-eco-wood hover:bg-eco-bark text-white font-bold rounded-xl transition-all shadow-md mt-6 cursor-pointer text-xs"
              >
                Enviar Link de Redefinição
              </button>
            </form>

            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-center text-[10px] font-bold text-stone-500 hover:text-stone-750 flex items-center justify-center gap-1.5 w-full cursor-pointer"
            >
              <Undo className="w-4 h-4" />
              <span>Voltar ao Login</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
