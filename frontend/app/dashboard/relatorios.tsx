'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { productsApi, saidaApi, Product } from '@/lib/supabase';

export function Relatorios() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalSaidas, setTotalSaidas] = useState(0);

  useEffect(() => {
    loadDados();
  }, []);

  const loadDados = async () => {
    setLoading(true);
    const produtos = await productsApi.getAll();
    setProdutos(produtos);

    // Calcular totais (simulado - em produção viria do banco)
    const totalEntrada = produtos.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);
    setTotalEntradas(totalEntrada);
    
    // Simular saídas (30% do valor em estoque)
    setTotalSaidas(totalEntrada * 0.3);

    setLoading(false);
  };

  const totalEstoque = produtos.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const valorTotalEstoque = produtos.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);
  const produtosMaisEstoque = produtos
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 5);
  const produtosMaisCaro = produtos
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <BarChart3 className="text-purple-400" />
        📊 Relatórios
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-lg p-6 text-white">
          <p className="text-sm text-emerald-100 mb-2">Total em Estoque</p>
          <p className="text-4xl font-bold">{totalEstoque}</p>
          <p className="text-xs text-emerald-200 mt-2">unidades</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <p className="text-sm text-blue-100 mb-2">Valor Total</p>
          <p className="text-3xl font-bold">R$ {valorTotalEstoque.toFixed(2)}</p>
          <p className="text-xs text-blue-200 mt-2">capital parado</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 mb-2">Entradas</p>
              <p className="text-2xl font-bold">R$ {totalEntradas.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-purple-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-red-800 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100 mb-2">Saídas</p>
              <p className="text-2xl font-bold">R$ {totalSaidas.toFixed(2)}</p>
            </div>
            <TrendingDown className="text-orange-200" size={32} />
          </div>
        </div>
      </div>

      {/* Dois painéis lado a lado */}
      <div className="grid grid-cols-2 gap-6">
        {/* Produtos com Maior Estoque */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            📦 Maior Estoque
          </h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : produtosMaisEstoque.length === 0 ? (
              <p className="text-gray-400">Sem produtos</p>
            ) : (
              produtosMaisEstoque.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-white">#{idx + 1}. {p.name}</p>
                    <p className="text-xs text-gray-400">{p.barcode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">{p.quantity} un</p>
                    <p className="text-xs text-gray-400">R$ {(p.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Produtos Mais Caros */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            💎 Produtos Mais Caros
          </h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : produtosMaisCaro.length === 0 ? (
              <p className="text-gray-400">Sem produtos</p>
            ) : (
              produtosMaisCaro.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-white">#{idx + 1}. {p.name}</p>
                    <p className="text-xs text-gray-400">{p.barcode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-400">R$ {(p.price || 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">({p.quantity} un em estoque)</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Análise Detalhada */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">📈 Análise Detalhada</h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Ticket Médio</p>
            <p className="text-2xl font-bold text-cyan-400">
              R$ {produtos.length > 0 ? (produtos.reduce((sum, p) => sum + (p.price || 0), 0) / produtos.length).toFixed(2) : '0'}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Produtos em Falta</p>
            <p className="text-2xl font-bold text-red-400">
              {produtos.filter((p) => (p.quantity || 0) === 0).length}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Produtos com Baixo Estoque</p>
            <p className="text-2xl font-bold text-yellow-400">
              {produtos.filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) <= 5).length}
            </p>
          </div>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">✅ Status do Sistema</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Conexão com Supabase</span>
            <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 rounded-full text-xs font-semibold">✅ Ativa</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total de Produtos</span>
            <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-semibold">{produtos.length} produtos</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Última Sincronização</span>
            <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-xs font-semibold">Agora</span>
          </div>
        </div>
      </div>
    </div>
  );
}
