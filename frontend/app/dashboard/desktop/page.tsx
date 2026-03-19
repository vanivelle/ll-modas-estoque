'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LogOut,
  Plus,
  Minus,
  Barcode,
  Menu,
  Package,
} from 'lucide-react';
import { EntradaForm } from '../entrada-form';
import { SaidaForm } from '../saida-form';
import { productsApi, type Product } from '@/lib/supabase';

export default function DesktopDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saida' | 'entrada' | 'estoque' | 'relatorios'>('entrada');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Carregar produtos do Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  // Recarregar quando volta ao dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadProducts();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const data = await productsApi.getAll();
    setProducts(data);
    setLoadingProducts(false);
  };

  // Dados removidos - sem API localhost

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'saida' as const, label: 'Saída', icon: Minus },
    { id: 'entrada' as const, label: 'Entrada', icon: Plus },
    { id: 'estoque' as const, label: 'Estoque', icon: Package },
    { id: 'relatorios' as const, label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-800 to-slate-950 border-r border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-xl font-bold text-cyan-400">LL MODAS</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded transition"
            >
              <Menu size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20 transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 bg-slate-900">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-blue-100">Total de Produtos</p>
                  <p className="text-4xl font-bold">{products.length}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-cyan-100">Quantidade Total</p>
                  <p className="text-4xl font-bold">{products.reduce((sum, p) => sum + (p.quantity || 0), 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-orange-100">Produtos Adicionados</p>
                  <p className="text-4xl font-bold">{products.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-green-100">Status</p>
                  <p className="text-2xl font-bold">✅ Online</p>
                </div>
              </div>

              {/* Tabela */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700 border-b border-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-300">Produto</th>
                      <th className="px-4 py-3 text-left text-gray-300">Código</th>
                      <th className="px-4 py-3 text-right text-gray-300">Preço</th>
                      <th className="px-4 py-3 text-right text-gray-300">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingProducts ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                          ⏳ Carregando produtos...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                          Nenhum produto ainda. Adicione na aba &quot;Entrada&quot;
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-white">{product.name}</td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">{product.barcode}</td>
                          <td className="px-4 py-3 text-right text-white">R$ {(product.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-white">{product.quantity || 0} un</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Entrada Tab - USA O COMPONENTE EntradaForm */}
          {activeTab === 'entrada' && (
            <div>
              <EntradaForm />
            </div>
          )}

          {/* Saída Tab */}
          {activeTab === 'saida' && (
            <div>
              <SaidaForm />
            </div>
          )}

          {/* Estoque Tab */}
          {activeTab === 'estoque' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Consulta de Estoque</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <p className="text-gray-400">Estoque em desenvolvimento - será conectada ao banco de dados</p>
              </div>
            </div>
          )}

          {/* Relatórios Tab */}
          {activeTab === 'relatorios' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Relatórios</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <p className="text-gray-400">Relatórios em desenvolvimento...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
