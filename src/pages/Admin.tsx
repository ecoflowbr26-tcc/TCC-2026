import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { ShieldCheck, ArrowLeft, Trash2, CheckCircle, Users, Package, AlertTriangle, ScrollText, ExternalLink, Calendar, Search, Star, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export const Admin: React.FC = () => {
  const { currentUser, products, users, reports, deleteProduct, deleteReport, toggleUserActivation, updateProduct, clearAllProducts, resetAllSystemData, addToast } = useEco();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reports' | 'products' | 'users' | 'comments'>('reports');
  const [searchTerm, setSearchTerm] = useState('');

  // Safeguard: Check if user is Admin
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-red-650 mx-auto">
          <AlertTriangle className="w-8 h-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Acesso Restrito</h1>
          <p className="text-xs text-stone-550 leading-relaxed">
            Esta página é restrita apenas aos administradores credenciados do portal EcoFlow. Por favor, autentique-se com credenciais válidas.
          </p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-eco-forest hover:bg-eco-leaf text-white font-bold rounded-xl transition-all text-xs cursor-pointer inline-flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fazer Login Administrador</span>
        </button>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalReportsCount = reports.length;
  const totalEcosystemValue = products.reduce((sum, p) => sum + p.price, 0);

  // Get all comments with product metadata
  const allComments = products.flatMap(p => 
    (p.comments || []).map(c => ({
      ...c,
      productId: p.id,
      productTitle: p.title
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter lists based on search
  const filteredReports = reports.filter(r => 
    r.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reporterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.city && u.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredComments = allComments.filter(c =>
    c.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionDeleteProduct = (productId: string, reportId?: string) => {
    if (window.confirm('Tem certeza de que deseja banir e remover este produto permanentemente? Esta ação é irreversível.')) {
      deleteProduct(productId);
      if (reportId) {
        deleteReport(reportId);
      }
      addToast('Produto excluído do catálogo público com sucesso!', 'success');
    }
  };

  const handleConfirmArchiveReport = (reportId: string) => {
    deleteReport(reportId);
    addToast('Denúncia arquivada e desconsiderada.', 'info');
  };

  const handleDeleteComment = (productId: string, commentId: string) => {
    if (window.confirm('Tem certeza de que deseja moderar e remover esta avaliação definitivamente?')) {
      const product = products.find(p => p.id === productId);
      if (product) {
        const updatedComments = product.comments.filter(c => c.id !== commentId);
        updateProduct(productId, { comments: updatedComments });
        addToast('Avaliação/comentário removido com sucesso!', 'success');
      }
    }
  };

  return (
    <div id="admin-panel" className="space-y-8 py-6">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Soberania de Administração</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Painel Moderador Geral</h1>
          <p className="text-xs text-stone-550 leading-relaxed mt-0.5">
            Bem-vindo de volta! Gerencie anúncios relatados ou denúncias de abuso feitas pelos usuários da plataforma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('ATENÇÃO: Deseja ZERAR TOTALMENTE o portal EcoFlow? Isso excluirá TODOS os vendedores, produtos cadastrados, curtidas, comentários e denúncias, restaurando o banco ao estado inicial limpo e mantendo apenas seu cadastro de administrador.')) {
                resetAllSystemData();
              }
            }}
            className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <AlertTriangle className="w-4 h-4 text-red-100" />
            <span>Zerar Totalmente o Site</span>
          </button>

          {products.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('ATENÇÃO: Tem certeza de que quer limpar TODOS os anúncios cadastrados no EcoFlow? Isso apagará todas as publicações de todos os usuários definitivamente.')) {
                  clearAllProducts();
                }
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 font-bold rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Todos os Produtos</span>
            </button>
          )}

          <button
            onClick={() => navigate('/feed')}
            className="px-4 py-2 bg-white border border-stone-250 hover:bg-stone-50 text-stone-700 font-bold rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </button>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-stone-200/70 p-4.5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">Denúncias Ativas</span>
            <span className="text-lg font-black text-stone-900 font-mono leading-none mt-0.5 block">{totalReportsCount}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-stone-200/70 p-4.5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">Anúncios Totais</span>
            <span className="text-lg font-black text-stone-900 font-mono leading-none mt-0.5 block">{totalProducts}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-stone-200/70 p-4.5 rounded-2xl shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">Ecomembros</span>
            <span className="text-lg font-black text-stone-900 font-mono leading-none mt-0.5 block">{totalUsers}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-stone-200/70 p-4.5 rounded-2xl shadow-2xs flex items-center gap-4 font-sans">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <ScrollText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">Valor Estimado</span>
            <span className="text-sm font-extrabold text-stone-900 font-mono leading-none mt-1 block truncate">
              {totalEcosystemValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </section>

      {/* Control Tabs & Search Bar */}
      <section className="bg-white border border-stone-200/75 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl self-start gap-1">
            <button
              onClick={() => { setActiveTab('reports'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reports' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-750'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Denúncias ({reports.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('products'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-750'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Anúncios ({products.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'users' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-750'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Membros ({users.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('comments'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'comments' ? 'bg-white text-stone-900 shadow-3xs' : 'text-stone-500 hover:text-stone-750'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              <span>Avaliações ({allComments.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder={`Pesquisar em ${activeTab === 'reports' ? 'denúncias' : activeTab === 'products' ? 'anúncios' : activeTab === 'users' ? 'membros' : 'avaliações'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-eco-sage text-xs text-stone-750"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Tab view contents */}
        <div className="pt-2 text-xs">
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  <p className="font-bold text-stone-700">Limpo e Seguro!</p>
                  <p className="text-[10px] text-stone-450 mt-1">Nenhuma denúncia de infração nos registros correspondentes.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredReports.map((report) => {
                    const linkedProduct = products.find(p => p.id === report.productId);
                    return (
                      <div
                        key={report.id}
                        className="bg-red-50/20 border border-red-100 rounded-2xl p-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-3xs hover:border-red-200 transition-colors"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 bg-red-600/10 text-red-750 rounded text-[9px] font-bold font-mono uppercase">EM REVISÃO</span>
                            <span className="text-[10px] text-stone-400 font-mono">ID: {report.id}</span>
                          </div>
                          
                          <h3 className="text-stone-900 font-bold text-sm leading-snug">
                            {report.productTitle}
                          </h3>

                          <div className="bg-white/80 p-3 rounded-xl border border-stone-105">
                            <p className="text-stone-600 text-[11px] leading-relaxed italic">
                              &ldquo;{report.reason}&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-[10px] text-stone-500 font-bold">
                            <span>Denunciado por: <span className="text-stone-750">{report.reporterName}</span></span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(report.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Moderator Actions */}
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-stone-200">
                          {linkedProduct && (
                            <button
                              onClick={() => {
                                // Simulate click on the product card to launch detail view
                                const element = document.getElementById(`prod-card-${linkedProduct.id}`);
                                if (element) {
                                  element.click();
                                } else {
                                  addToast('Este produto não pôde ser pré-visualizado no momento.', 'error');
                                }
                              }}
                              className="px-3 py-1.5 border border-stone-250 hover:bg-stone-50 text-stone-700 bg-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center justify-center gap-1 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Pré-visualizar</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleConfirmArchiveReport(report.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <CheckCircle className="w-3" />
                            <span>Arquivar/Ignorar</span>
                          </button>
                          <button
                            onClick={() => handleActionDeleteProduct(report.productId, report.id)}
                            className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            <Trash2 className="w-3" />
                            <span>Banir Produto</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] text-[11px]">
                <thead>
                  <tr className="border-b border-stone-250 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pb-3 font-mono">Produto</th>
                    <th className="py-2 pb-3 font-mono">Categoria</th>
                    <th className="py-2 pb-3 font-mono">Criador</th>
                    <th className="py-2 pb-3 font-mono">Preço</th>
                    <th className="py-2 pb-3 font-mono text-center">Interações</th>
                    <th className="py-2 pb-3 font-mono text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-105 font-medium">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover bg-stone-100" />
                          <div>
                            <span className="font-bold text-stone-900 block leading-tight">{prod.title}</span>
                            <span className="text-[10px] text-stone-400 font-mono">ID: {prod.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-stone-550">{prod.category}</td>
                      <td className="py-3 font-bold text-stone-700">{prod.creatorName}</td>
                      <td className="py-3 font-mono text-stone-850 font-bold">{prod.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="py-3 text-center text-stone-500 font-bold font-mono">
                        {prod.likesCount} Curtidas / {prod.comments.length} Avaliações
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleActionDeleteProduct(prod.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-650 transition-colors cursor-pointer"
                          title="Remover produto definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-stone-400 italic">Pesquisa vazia ou nenhum produto cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] text-[11px]">
                <thead>
                  <tr className="border-b border-stone-250 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2 pb-3 font-mono">Membro</th>
                    <th className="py-2 pb-3 font-mono">E-mail de Cadastro</th>
                    <th className="py-2 pb-3 font-mono">Localização</th>
                    <th className="py-2 pb-3 font-mono text-center">Tipo de Perfil</th>
                    <th className="py-2 pb-3 font-mono text-right">Cadastrados</th>
                    <th className="py-2 pb-3 font-mono text-center">Status</th>
                    <th className="py-2 pb-3 font-mono text-right">Ação Moderador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-105 font-medium">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={`hover:bg-stone-50/50 ${user.isInactive ? 'opacity-65 bg-stone-50/20' : ''}`}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-100 shadow-2xs" />
                          <div>
                            <span className="font-bold text-stone-900 block">{user.name}</span>
                            {user.isInactive && <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider font-mono">CONTA SUSPENSA</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-stone-550 font-mono">{user.email}</td>
                      <td className="py-3 text-stone-605">{user.city || 'São Paulo'}, {user.state || 'SP'}</td>
                      <td className="py-3 text-center">
                        {user.isAdmin ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-750 font-bold text-[9px] rounded font-mono">MODERADOR</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-850 font-bold text-[9px] rounded font-mono">ECOPRODUTOR</span>
                        )}
                      </td>
                      <td className="py-3 text-right text-stone-500 font-mono font-bold">
                        {user.postsCount || 0} anúncios
                      </td>
                      <td className="py-3 text-center">
                        {user.isInactive ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-750 font-black text-[9px] rounded font-mono uppercase tracking-wider">🚫 INATIVO</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-850 font-black text-[9px] rounded font-mono uppercase tracking-wider">✅ ATIVO</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {user.isAdmin ? (
                          <span className="text-stone-400 text-[10px] italic">Imune</span>
                        ) : (
                          <button
                            onClick={() => {
                              toggleUserActivation(user.id);
                              addToast(
                                `Conta de ${user.name} foi ${!user.isInactive ? 'Inativada' : 'Ativada'} com sucesso!`,
                                'info'
                              );
                            }}
                            className={`px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer border ${
                              user.isInactive
                                ? 'bg-emerald-50 border-emerald-250 text-emerald-750 hover:bg-emerald-100'
                                : 'bg-red-50 border-red-205 text-red-650 hover:bg-red-100'
                            }`}
                          >
                            <span>{user.isInactive ? 'Reativar Conta' : 'Inativar Conta'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {filteredComments.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400">
                  <ScrollText className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                  <p className="font-bold text-stone-700">Nenhum feedback</p>
                  <p className="text-[10px] text-stone-450 mt-1">Nenhuma avaliação ou comentário correspondente foi encontrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4.5 flex flex-col justify-between gap-4 shadow-3xs hover:border-stone-300 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-eco-forest/10 flex items-center justify-center font-bold text-eco-forest text-xs uppercase font-mono">
                              {comment.authorName ? comment.authorName.substring(0, 2) : 'EM'}
                            </span>
                            <div>
                              <p className="font-bold text-stone-950 text-xs">{comment.authorName}</p>
                              <p className="text-[9.5px] text-eco-forest font-semibold">Produto: {comment.productTitle}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < comment.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-105">
                          <p className="text-stone-750 text-[11px] leading-relaxed italic">
                            &ldquo;{comment.text}&rdquo;
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 mt-1.5">
                        <span className="text-[9.5px] text-stone-400 font-mono">
                          {new Date(comment.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                        </span>

                        <button
                          onClick={() => handleDeleteComment(comment.productId, comment.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-bold rounded-lg text-[9.5px] inline-flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Banir Avaliação</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
