'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LogOut,
  ChevronDown,
  Plus,
  Minus,
  Barcode,
  Menu,
} from 'lucide-react';
import { getProducts, addStock, removeStock, seedProducts, type Product } from '@/lib/api';

export default function DesktopDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saida' | 'entrada' | 'estoque' | 'relatorios'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const scannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
    // Scanner USB input always focused
    if (scannerInputRef.current) {
      scannerInputRef.current.focus();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erro carregando produtos:', error);
      setProducts([]);
    }
  };

  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const sku = (e.target as HTMLInputElement).value;
      const product = products.find(p => p.sku === sku);
      if (product) {
        setSelectedProduct(product.id);
        (e.target as HTMLInputElement).value = '';
      }
      (e.target as HTMLInputElement).focus();
    }
  };

  const handleAddStock = async () => {
    if (!selectedProduct) return;
    try {
      await addStock(selectedProduct, quantity, notes);
      loadProducts();
      setQuantity(1);
      setNotes('');
      setSelectedProduct('');
      scannerInputRef.current?.focus();
    } catch (error) {
      console.error('Erro ao adicionar estoque:', error);
    }
  };

  const handleRemoveStock = async () => {
    if (!selectedProduct) return;
    try {
      await removeStock(selectedProduct, quantity, notes);
      loadProducts();
      setQuantity(1);
      setNotes('');
      setSelectedProduct('');
      scannerInputRef.current?.focus();
    } catch (error) {
      console.error('Erro ao remover estoque:', error);
    }
  };

  const lowStockProducts = products.filter(p => (p.quantity ?? 0) < 5);
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity ?? 0), 0);
  const healthPercentage = products.length > 0 ? Math.round((products.filter(p => (p.quantity ?? 0) > 10).length / totalProducts) * 100) : 0;

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'saida' as const, label: 'Saída', icon: LogOut },
    { id: 'entrada' as const, label: 'Entrada', icon: Plus },
    { id: 'estoque' as const, label: 'Estoque', icon: Barcode },
    { id: 'relatorios' as const, label: 'Relatórios', icon: ChevronDown },
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
              
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-blue-100">Total de Produtos</p>
                  <p className="text-4xl font-bold">{totalProducts}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-cyan-100">Quantidade Total</p>
                  <p className="text-4xl font-bold">{totalQuantity}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-orange-100">Baixo Estoque</p>
                  <p className="text-4xl font-bold">{lowStockProducts.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white">
                  <p className="text-sm text-green-100">Saúde do Estoque</p>
                  <p className="text-4xl font-bold">{healthPercentage}%</p>
                </div>
              </div>

              {/* Scanner Input */}
              <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center text-sm font-semibold text-gray-300">
                    <Barcode className="mr-2" size={18} />
                    Scanner USB
                  </label>
                  <span className="text-xs px-3 py-1 bg-green-900/30 text-green-300 rounded font-semibold">
                    🟢 Ativo & Escutando
                  </span>
                </div>
                
                {/* Hidden Input - Always listening for scanner input */}
                <input
                  ref={scannerInputRef}
                  type="text"
                  onKeyDown={handleScannerInput}
                  autoFocus
                  className="absolute -left-96 opacity-0"
                  style={{ position: 'absolute', left: '-9999px' }}
                />
                
                {/* Visual Status - Scanner is ready */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-dashed border-green-500/40 rounded-lg p-6 text-center">
                  <div className="inline-block mb-3">
                    <div className="animate-pulse">
                      <Barcode size={32} className="text-green-400" />
                    </div>
                  </div>
                  <p className="text-base text-gray-200 font-semibold mb-1">
                    Scanner Pronto
                  </p>
                  <p className="text-sm text-gray-400">
                    Aponte o scanner para um código de barras ou use as abas de entrada/saída acima
                  </p>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700 border-b border-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-300">Produto</th>
                      <th className="px-4 py-3 text-left text-gray-300">SKU</th>
                      <th className="px-4 py-3 text-right text-gray-300">Quantidade</th>
                      <th className="px-4 py-3 text-center text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-white">{product.name}</td>
                        <td className="px-4 py-3 text-gray-400">{product.sku || '-'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-white">{product.quantity ?? 0}</td>
                        <td className="px-4 py-3 text-center">
                          {(product.quantity ?? 0) < 5 ? (
                            <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs font-semibold">Crítico</span>
                          ) : (product.quantity ?? 0) < 10 ? (
                            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-xs font-semibold">Baixo</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs font-semibold">OK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Entrada Tab */}
          {activeTab === 'entrada' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Entrada de Estoque</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 max-w-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Produto</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - R$ {p.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Notas</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Fornecedor XYZ, NF 12345..."
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleAddStock}
                    disabled={!selectedProduct}
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Adicionar Estoque
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saída Tab */}
          {activeTab === 'saida' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Saída de Estoque</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 max-w-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Produto</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - R$ {p.price.toFixed(2)} - Estoque: {p.quantity ?? 0}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Motivo</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Danos, Venda, Ajuste..."
                      className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleRemoveStock}
                    disabled={!selectedProduct}
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    <Minus className="inline mr-2" size={18} />
                    Remover Estoque
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Estoque Tab */}
          {activeTab === 'estoque' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Consulta de Estoque</h1>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Pesquisar Produto</h3>
                  <input type="text" placeholder="Digite o nome do produto..." className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none mb-4" />
                </div>
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none">
                    <option>Todos</option>
                    <option>Baixo Estoque</option>
                    <option>Crítico</option>
                  </select>
                </div>
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
