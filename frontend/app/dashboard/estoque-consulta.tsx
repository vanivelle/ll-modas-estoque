'use client';

import { useState, useEffect } from 'react';
import { Package, Search, AlertTriangle } from 'lucide-react';
import { productsApi, Product } from '@/lib/supabase';

export function EstoqueConsulta() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'baixo' | 'vazio'>('todos');

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    setLoading(true);
    const data = await productsApi.getAll();
    setProdutos(data);
    setLoading(false);
  };

  const produtosFiltrados = produtos.filter((p) => {
    // Filtro por nome/código
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por status
    const qtd = p.quantity || 0;
    let matchStatus = true;
    if (filterStatus === 'baixo') matchStatus = qtd > 0 && qtd <= 5;
    if (filterStatus === 'vazio') matchStatus = qtd === 0;

    return matchSearch && matchStatus;
  });

  const totalProdutos = produtos.length;
  const totalQuantidade = produtos.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const produtosBaixo = produtos.filter((p) => (p.quantity || 0) <= 5 && (p.quantity || 0) > 0).length;
  const produtosVazios = produtos.filter((p) => (p.quantity || 0) === 0).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <Package className="text-blue-400" />
        📦 Consulta de Estoque
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-white">
          <p className="text-sm text-blue-100">Total de Produtos</p>
          <p className="text-3xl font-bold">{totalProdutos}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg p-4 text-white">
          <p className="text-sm text-cyan-100">Quantidade Total</p>
          <p className="text-3xl font-bold">{totalQuantidade}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-4 text-white">
          <p className="text-sm text-yellow-100">Estoque Baixo</p>
          <p className="text-3xl font-bold text-yellow-300">{produtosBaixo}</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4 text-white">
          <p className="text-sm text-red-100">Sem Estoque</p>
          <p className="text-3xl font-bold text-red-300">{produtosVazios}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">
            🔍 Buscar (Nome ou Código)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Bermuda, 7998765432104..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Status</label>
          <div className="flex gap-3">
            {[
              { value: 'todos' as const, label: 'Todos' },
              { value: 'baixo' as const, label: '⚠️ Estoque Baixo' },
              { value: 'vazio' as const, label: '❌ Sem Estoque' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filterStatus === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold">Produto</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold">Código</th>
              <th className="px-6 py-4 text-right text-gray-300 font-semibold">Preço</th>
              <th className="px-6 py-4 text-right text-gray-300 font-semibold">Quantidade</th>
              <th className="px-6 py-4 text-center text-gray-300 font-semibold">Status</th>
              <th className="px-6 py-4 text-right text-gray-300 font-semibold">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  ⏳ Carregando produtos...
                </td>
              </tr>
            ) : produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              produtosFiltrados.map((produto) => {
                const qtd = produto.quantity || 0;
                const status =
                  qtd === 0 ? 'vazio' : qtd <= 5 ? 'baixo' : 'ok';
                const statusColor =
                  status === 'vazio'
                    ? 'bg-red-900/30 text-red-300'
                    : status === 'baixo'
                    ? 'bg-yellow-900/30 text-yellow-300'
                    : 'bg-emerald-900/30 text-emerald-300';
                const statusLabel =
                  status === 'vazio'
                    ? '❌ Sem Estoque'
                    : status === 'baixo'
                    ? '⚠️ Baixo'
                    : '✅ OK';

                return (
                  <tr
                    key={produto.id}
                    className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                  >
                    <td className="px-6 py-4 text-white font-medium">{produto.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{produto.barcode}</td>
                    <td className="px-6 py-4 text-right text-white">R$ {(produto.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-white">{qtd} un</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-semibold">
                      R$ {((produto.price || 0) * qtd).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">📊 Resumo</h3>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-400">Produtos Exibidos</p>
            <p className="text-2xl font-bold text-cyan-400">{produtosFiltrados.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Total em Estoque</p>
            <p className="text-2xl font-bold text-emerald-400">
              {produtosFiltrados.reduce((sum, p) => sum + (p.quantity || 0), 0)} un
            </p>
          </div>
          <div>
            <p className="text-gray-400">Valor Total do Estoque</p>
            <p className="text-2xl font-bold text-blue-400">
              R$ {produtosFiltrados
                .reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
