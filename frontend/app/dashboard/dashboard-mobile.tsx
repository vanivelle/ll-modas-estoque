'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Plus,
  TrendingDown,
  AlertTriangle,
  Home,
  LogOut,
  Barcode,
} from 'lucide-react';
import { getProducts, addStock, removeStock } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  quantity: number;
  minimum_quantity: number;
}

type TabOption = 'home' | 'saida' | 'entrada' | 'estoque';

export default function DashboardMobile() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<TabOption>('home');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [scanInput, setScanInput] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success) {
      setProducts(result.data as Product[]);
    }
    setLoading(false);
  };

  const handleScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setSelectedProduct(product.id);
      setScanInput('');
    } else {
      alert('Produto não encontrado!');
      setScanInput('');
    }
  };

  const handleRemoveStock = async () => {
    if (!selectedProduct || !quantity) {
      alert('Selecione produto e quantidade');
      return;
    }
    setLoading(true);
    const result = await removeStock(selectedProduct, parseInt(quantity), notes);
    if (result.success) {
      alert('✅ Saída registrada!');
      setSelectedProduct('');
      setQuantity('');
      setNotes('');
      setScanInput('');
      loadProducts();
    } else {
      alert('❌ Erro: ' + result.error);
    }
    setLoading(false);
  };

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity) {
      alert('Selecione produto e quantidade');
      return;
    }
    setLoading(true);
    const result = await addStock(selectedProduct, parseInt(quantity), notes);
    if (result.success) {
      alert('✅ Entrada registrada!');
      setSelectedProduct('');
      setQuantity('');
      setNotes('');
      setScanInput('');
      loadProducts();
    } else {
      alert('❌ Erro: ' + result.error);
    }
    setLoading(false);
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.minimum_quantity);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-slate-800/80 to-blue-800/80 border-b border-blue-700/30 backdrop-blur-sm sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              LL MODAS
            </h1>
            <p className="text-xs text-gray-400">Estoque Móvel</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Lázaro</p>
            <button className="text-gray-400 hover:text-red-400 transition-colors mt-1">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* HOME / DASHBOARD */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                <Package className="text-blue-400 mb-2" size={24} />
                <p className="text-xs text-blue-300 font-medium">Produtos</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
                <BarChart3 className="text-cyan-400 mb-2" size={24} />
                <p className="text-xs text-cyan-300 font-medium">Total Qtd</p>
                <p className="text-2xl font-bold">{totalQuantity}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
                <AlertTriangle className="text-yellow-400 mb-2" size={24} />
                <p className="text-xs text-yellow-300 font-medium">Baixo</p>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
                <BarChart3 className="text-emerald-400 mb-2" size={24} />
                <p className="text-xs text-emerald-300 font-medium">Saúde</p>
                <p className="text-2xl font-bold">
                  {Math.round(((products.length - lowStockProducts.length) / Math.max(products.length, 1)) * 100)}%
                </p>
              </div>
            </div>

            {/* Alertas de Estoque Baixo */}
            {lowStockProducts.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border border-yellow-500/20 rounded-lg p-4 backdrop-blur-sm mt-4">
                <h3 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Estoque Baixo
                </h3>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map(p => (
                    <div key={p.id} className="bg-slate-800/50 rounded p-2 text-xs">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-yellow-300">
                        {p.quantity} / {p.minimum_quantity} mín
                      </p>
                    </div>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <p className="text-xs text-gray-400 pt-2">
                      +{lowStockProducts.length - 3} produtos com estoque baixo
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setActiveTab('saida')}
                className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
              >
                <TrendingDown size={32} />
                <span className="text-sm font-semibold">Vender</span>
              </button>
              <button
                onClick={() => setActiveTab('entrada')}
                className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus size={32} />
                <span className="text-sm font-semibold">Comprar</span>
              </button>
            </div>
          </div>
        )}

        {/* SAÍDA (VENDA) */}
        {activeTab === 'saida' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingDown className="text-red-400" />
                Vender Produto
              </h2>

              {/* Scanner */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">
                  Código de Barras
                </label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && scanInput) {
                        handleScan(scanInput);
                      }
                    }}
                    placeholder="Aproxime o código..."
                    className="w-full bg-slate-900/50 border border-blue-500/30 rounded py-3 px-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Produto */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">Produto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                >
                  <option value="">Selecione...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">Quantidade</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(0, parseInt(quantity || '1') - 1).toString())}
                    className="bg-slate-700 hover:bg-slate-600 rounded px-4 py-2 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-blue-500/30 rounded py-3 px-3 text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-lg"
                  />
                  <button
                    onClick={() => setQuantity((parseInt(quantity || '0') + 1).toString())}
                    className="bg-slate-700 hover:bg-slate-600 rounded px-4 py-2 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">Cliente (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded py-3 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
              </div>

              {/* Botão */}
              <button
                onClick={handleRemoveStock}
                disabled={loading || !selectedProduct || !quantity}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                <TrendingDown size={20} />
                {loading ? 'Processando...' : 'Confirmar Venda'}
              </button>
            </div>
          </div>
        )}

        {/* ENTRADA */}
        {activeTab === 'entrada' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus className="text-emerald-400" />
                Entrada de Estoque
              </h2>

              {/* Produto */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">Produto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                >
                  <option value="">Selecione...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (atual: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">Quantidade</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(0, parseInt(quantity || '1') - 1).toString())}
                    className="bg-slate-700 hover:bg-slate-600 rounded px-4 py-2 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-blue-500/30 rounded py-3 px-3 text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-lg"
                  />
                  <button
                    onClick={() => setQuantity((parseInt(quantity || '0') + 1).toString())}
                    className="bg-slate-700 hover:bg-slate-600 rounded px-4 py-2 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Nota Fiscal */}
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-2">Nota Fiscal</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: NF 123456"
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded py-3 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
              </div>

              {/* Botão */}
              <button
                onClick={handleAddStock}
                disabled={loading || !selectedProduct || !quantity}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                <Plus size={20} />
                {loading ? 'Processando...' : 'Confirmar Entrada'}
              </button>
            </div>
          </div>
        )}

        {/* ESTOQUE */}
        {activeTab === 'estoque' && (
          <div className="p-4 space-y-3">
            {products.map(product => (
              <div
                key={product.id}
                className={`bg-gradient-to-br border rounded-lg p-4 backdrop-blur-sm ${
                  product.quantity <= product.minimum_quantity
                    ? 'from-yellow-600/10 to-yellow-800/10 border-yellow-500/20'
                    : 'from-slate-800/50 to-blue-800/20 border-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sku}</p>
                  </div>
                  {product.quantity <= product.minimum_quantity && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-semibold">
                      BAIXO
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Estoque</p>
                    <p className="font-bold text-base">{product.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Mínimo</p>
                    <p className="font-bold">{product.minimum_quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Preço</p>
                    <p className="font-bold">R$ {product.price.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* BOTTOM TAB NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent border-t border-blue-700/30 backdrop-blur-md flex justify-around items-center">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'saida', label: 'Vender', icon: TrendingDown },
          { id: 'entrada', label: 'Comprar', icon: Plus },
          { id: 'estoque', label: 'Estoque', icon: Package },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabOption);
                setSelectedProduct('');
                setScanInput('');
                setQuantity('');
                setNotes('');
              }}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-gray-400 border-t-2 border-transparent'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
