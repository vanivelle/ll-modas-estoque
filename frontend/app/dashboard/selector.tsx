'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Selector() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | null>(null);

  // Auto-detectar ao carregar
  useEffect(() => {
    const width = window.innerWidth;
    const detected = width < 768 ? 'mobile' : 'desktop';
    setDeviceType(detected);
  }, []);

  const handleSelect = (type: 'desktop' | 'mobile') => {
    setIsLoading(true);
    // Armazena escolha no localStorage
    localStorage.setItem('layoutMode', type);
    
    // Redireciona para dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Efeito de luz de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Container */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
            LL MODAS
          </h1>
          <p className="text-xl text-blue-200 font-light tracking-wide">
            Controle de Estoque Universal
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Subtítulo */}
        <div className="text-center mb-12">
          <p className="text-gray-300 text-lg mb-2">Escolha seu modo de acesso</p>
          <p className="text-gray-500 text-sm">
            {deviceType ? `(Detectado: ${deviceType === 'desktop' ? 'Desktop' : 'Mobile'})` : 'Carregando...'}
          </p>
        </div>

        {/* Botões */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Desktop Button */}
          <button
            onClick={() => handleSelect('desktop')}
            disabled={isLoading}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
              deviceType === 'desktop' ? 'ring-2 ring-blue-400' : ''
            } ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 transition-all duration-300 group-hover:from-blue-500 group-hover:to-cyan-700"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center space-y-4 text-white">
              <Monitor size={64} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300" />
              <h2 className="text-2xl font-bold">Desktop</h2>
              <p className="text-sm text-blue-100">Tela Grande • Menu Lateral • Produtivo</p>
              
              {deviceType === 'desktop' && (
                <div className="text-xs font-semibold mt-4 px-3 py-1 bg-white/20 rounded-full text-cyan-100">
                  ✓ Recomendado
                </div>
              )}
            </div>

            {/* Border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl border border-transparent group-hover:border-cyan-400/30"></div>
          </button>

          {/* Mobile Button */}
          <button
            onClick={() => handleSelect('mobile')}
            disabled={isLoading}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
              deviceType === 'mobile' ? 'ring-2 ring-cyan-400' : ''
            } ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-teal-800 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-emerald-700"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center space-y-4 text-white">
              <Smartphone size={64} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-300" />
              <h2 className="text-2xl font-bold">Mobile</h2>
              <p className="text-sm text-cyan-100">Tela Pequena • Abas • Rápido</p>
              
              {deviceType === 'mobile' && (
                <div className="text-xs font-semibold mt-4 px-3 py-1 bg-white/20 rounded-full text-blue-100">
                  ✓ Recomendado
                </div>
              )}
            </div>

            {/* Border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-cyan-400/20 to-teal-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl border border-transparent group-hover:border-cyan-400/30"></div>
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Seu modo será salvo para próximas visitas</p>
          <p className="mt-2 text-xs text-gray-500">Versão 2.0 • com Scanner USB • sem EXE</p>
        </div>
      </div>
    </div>
  );
}
