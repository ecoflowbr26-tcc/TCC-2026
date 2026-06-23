import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../contexts/EcoContext';
import { 
  ArrowLeft, 
  Check, 
  Palette, 
  Sparkles, 
  Type, 
  Info, 
  Maximize2,
  Heart,
  Eye,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';

export const Personalizar: React.FC = () => {
  const { fontFamily, setFontFamily, fontSize, setFontSize, darkMode, setDarkMode, addToast } = useEco();
  const navigate = useNavigate();

  const fontOptions = [
    { id: 'sans', label: 'Padrão Moderno (Inter)', desc: 'Visualização clássica, limpa e ideal para leitura dinâmica de telas.', family: '"Inter", sans-serif' },
    { id: 'outfit', label: 'Suave Arredondado (Outfit)', desc: 'Sensação moderna arredondada e extremamente agradável aos olhos.', family: '"Outfit", sans-serif' },
    { id: 'space', label: 'Moderna Industrial (Grotesk)', desc: 'Espaço contemporâneo, design contemporâneo de vanguarda circular.', family: '"Space Grotesk", sans-serif' },
    { id: 'serif', label: 'Literatura Artesanal (Lora)', desc: 'Visual elegante de revista literária e catálogos impressos tradicionais.', family: '"Lora", serif' },
    { id: 'playfair', label: 'Editorial de Luxo (Playfair)', desc: 'Visual sofisticado, remetendo a estúdio de alta-costura e grifes finas.', family: '"Playfair Display", serif' },
    { id: 'mono', label: 'Técnico de Estúdio (JetBrains)', desc: 'Fonte monoespaçada precisa para entusiastas em dados industriais.', family: '"JetBrains Mono", monospace' }
  ];

  const sizeOptions = [
    { id: 'compact', label: 'Compacto', spec: 'Letras pequenas (14px)', desc: 'Máxima densidade de itens por tela.' },
    { id: 'normal', label: 'Padrão da Rede', spec: 'Otimizado (16px)', desc: 'Escala equilibrada recomendada.' },
    { id: 'medium', label: 'Médio Conforto', spec: 'Descansado (18.5px)', desc: 'Excelente para quem prefere leitura fluida.' },
    { id: 'large', label: 'Ampliado', spec: 'Grande (21px)', desc: 'Destaca títulos e legendas com facilidade.' },
    { id: 'extralarge', label: 'Acessível', spec: 'Super Amplo (23.5px)', desc: 'Acessibilidade total otimizada para baixa visão.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
      id="page-personalizar"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-eco-forest/10 text-eco-forest rounded-xl">
              <Palette className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold font-mono tracking-widest text-eco-sage uppercase">Estúdio de Estilo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight">
            Personalizar Acessibilidade & Tipografia
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed max-w-2xl">
            Ajuste as preferências de fontes e dimensões de texto do EcoFlow para a melhor experiência literária e mercadológica. Suas escolhas se aplicam instantaneamente por todo o ecossistema.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="self-start md:self-center px-4 py-2 bg-white border border-stone-250 hover:bg-stone-50 text-stone-700 font-bold rounded-2xl transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Grid Layout of Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Selection Area (2 Columns on main view) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tipologia */}
          <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Type className="w-5 h-5 text-eco-forest" />
              <h3 className="font-extrabold text-stone-850 font-mono text-xs uppercase tracking-wider">
                1. Selecione a Família Tipográfica
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {fontOptions.map((f) => {
                const isActive = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFontFamily(f.id);
                      addToast(`Fonte configurada para ${f.label}!`, 'success');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                      isActive
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest ring-1 ring-eco-forest/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50/60 text-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <p className="text-sm font-extrabold" style={{ fontFamily: f.family }}>
                        {f.label}
                      </p>
                      {isActive && (
                        <span className="p-0.5 bg-eco-forest text-white rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-450 mt-2 leading-snug group-hover:text-stone-605">
                      {f.desc}
                    </p>
                    <div className="mt-3 pt-2 border-t border-stone-100 border-dashed text-xs font-mono font-semibold text-stone-400" style={{ fontFamily: f.family }}>
                      EcoFlow Orgânico Aa Bb Cc 123
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tamanho de Textos */}
          <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Maximize2 className="w-5 h-5 text-eco-forest" />
              <h3 className="font-extrabold text-stone-850 font-mono text-xs uppercase tracking-wider">
                2. Selecione a Escala das Letras
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {sizeOptions.map((s) => {
                const isActive = fontSize === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setFontSize(s.id);
                      addToast(`Escala ajustada para ${s.label}!`, 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'border-eco-forest bg-eco-forest/5 text-eco-forest ring-1 ring-eco-forest/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50/60 text-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <p className="text-xs font-extrabold break-words leading-tight">{s.label}</p>
                      {isActive && <Check className="w-3 text-eco-forest shrink-0 ml-1" />}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-[9px] font-mono font-bold text-eco-sage">{s.spec}</p>
                      <p className="text-[8.5px] text-stone-450 leading-snug">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modo Escuro */}
          <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Moon className="w-5 h-5 text-eco-forest" />
              <h3 className="font-extrabold text-stone-850 font-mono text-xs uppercase tracking-wider">
                3. Escolha o Modo de Cores (Tema do Site)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setDarkMode(false);
                  addToast('Modo Claro ativado!', 'success');
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative flex items-center gap-3.5 cursor-pointer ${
                  !darkMode
                    ? 'border-eco-forest bg-eco-forest/5 text-eco-forest ring-1 ring-eco-forest/20 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50/60 text-stone-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold flex items-center justify-between">
                    <span>Modo Claro Orgânico</span>
                    {!darkMode && <Check className="w-4 h-4 text-eco-forest shrink-0" />}
                  </p>
                  <p className="text-[11px] text-stone-450 mt-0.5 leading-snug">
                    Fundo claro de tons creme suave para uso diurno confortável.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDarkMode(true);
                  addToast('Modo Escuro ativado com sucesso!', 'success');
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative flex items-center gap-3.5 cursor-pointer ${
                  darkMode
                    ? 'border-eco-forest bg-eco-forest/5 text-eco-forest ring-1 ring-eco-forest/20 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50/60 text-stone-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold flex items-center justify-between">
                    <span>Modo Escuro Floresta</span>
                    {darkMode && <Check className="w-4 h-4 text-eco-forest shrink-0" />}
                  </p>
                  <p className="text-[11px] text-stone-450 mt-0.5 leading-snug">
                    Ardósia escurecida com contraste verde eco para descanso visual.
                  </p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Live Preview Display Card (1 Column on main view) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-150 shadow-xs sticky top-28 space-y-4">
            
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Eye className="w-4 h-4 text-eco-forest" />
              <h3 className="font-extrabold text-stone-800 font-mono text-xs uppercase tracking-wider">
                Visualização em Tempo Real
              </h3>
            </div>

            {/* Simulative Interactive Card */}
            <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-200">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" 
                  alt="Amostra"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 right-2.5 bg-eco-forest text-stone-50 text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                  Pallets Criativos
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-extrabold text-base leading-snug text-stone-900 tracking-tight">
                    Mesa de Centro Rústica em Madeira Maciça
                  </h4>
                  <span className="text-sm font-black text-eco-forest shrink-0">
                    R$ 380,00
                  </span>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed">
                  Esta elegante mesa é fabricada com pinus reciclado e tratamentos orgânicos sem aditivos químicos. Ideal para salas de estar com foco ecológico e minimalista contemporâneo.
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-150 text-[10px] font-mono font-medium text-stone-450">
                  <span>Material: Madeira de Demolição</span>
                  <span>•</span>
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            {/* Simulated interactive feedback buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => addToast('Curtido na demonstração!', 'info')}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl transition-all text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-red-500" />
                Interesse Demonstrado
              </button>
            </div>

            {/* Accessibility Note */}
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex gap-2.5 text-[11px] text-stone-550 leading-relaxed">
              <Info className="w-4 h-4 text-eco-sage shrink-0 mt-0.5" />
              <span>
                As configurações de fontes e acessibilidade são gravadas localmente em seu navegador. Seus olhos e cansaço visual agradecem!
              </span>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};
