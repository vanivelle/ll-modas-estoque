'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Package,
  Plus,
  TrendingDown,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Barcode,
  Menu,
} from 'lucide-react';
import { getProducts, addStock, removeStock, seedProducts, Product, createProductWithStock } from '@/lib/api';

type MenuOption = 'dashboard' | 'entrada' | 'saida' | 'produtos' | 'estoque' | 'relatorios';

export default function DashboardDesktop() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState<MenuOption>('dashboard');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [scanInput, setScanInput] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    loadProducts();
    // Focar no scanner quando carregar
    const input = document.getElementById('scanner-input') as HTMLInputElement;
    if (input) input.focus();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success && result.data) {
      setProducts(result.data as Product[]);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  const handleScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setSelectedProduct(product.id);
      setScanInput('');
      // Auto-focar quantity
      setTimeout(() => {
        const qtyInput = document.getElementById('quantity-input') as HTMLInputElement;
        if (qtyInput) qtyInput.focus();
      }, 100);
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
      // Re-focar scanner
      const input = document.getElementById('scanner-input') as HTMLInputElement;
      if (input) input.focus();
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
      const input = document.getElementById('scanner-input') as HTMLInputElement;
      if (input) input.focus();
    } else {
      alert('❌ Erro: ' + result.error);
    }
    setLoading(false);
  };

  const handleAddProductWithStock = async () => {
    if (!productName || !productPrice || !quantity) {
      alert('Preencha: Nome do produto, Preço e Quantidade');
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price) || price <= 0) {
      alert('Preço inválido');
      return;
    }

    setLoading(true);
    const result = await createProductWithStock({
      name: productName,
      price: price,
      quantity: parseInt(quantity),
      minimum_quantity: 1,
      notes: notes,
    });

    if (result.success) {
      alert('✅ Produto criado e estoque adicionado!');
      setProductName('');
      setProductPrice('');
      setQuantity('');
      setNotes('');
      loadProducts();
    } else {
      alert('❌ Erro: ' + result.error);
    }
    setLoading(false);
  };

  const lowStockProducts = products.filter(p => (p.quantity ?? 0) <= p.minimum_quantity);
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity ?? 0), 0);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 border-r border-blue-800/50 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-800/30">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-slate-950">
                LL
              </div>
              {sidebarOpen && <span className="font-bold text-lg">MODAS</span>}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'saida', label: 'Venda (Saída)', icon: TrendingDown },
            { id: 'entrada', label: 'Compra (Entrada)', icon: Plus },
            { id: 'estoque', label: 'Estoque Completo', icon: Package },
            { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id as MenuOption);
                  setSelectedProduct('');
                  setScanInput('');
                  setQuantity('');
                  setNotes('');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-blue-800/30'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {sidebarOpen && activeMenu === item.id && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-blue-800/30 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-800/30 rounded-lg transition-all">
            <Settings size={20} />
            {sidebarOpen && <span className="text-sm">Configurações</span>}
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-800/20 rounded-lg transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Sair</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-blue-800/30 hover:bg-blue-800/20 transition-all"
        >
          <Menu size={20} />
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-800/50 to-blue-800/50 border-b border-blue-700/30 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                {activeMenu === 'dashboard' && 'Dashboard'}
                {activeMenu === 'saida' && 'Venda de Produtos'}
                {activeMenu === 'entrada' && 'Entrada de Estoque'}
                {activeMenu === 'estoque' && 'Estoque Completo'}
                {activeMenu === 'relatorios' && 'Relatórios'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">Controle de Estoque • LL MODAS</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Usuário</p>
              <p className="font-semibold">Lázaro</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-blue-300 text-sm font-medium">Total de Produtos</p>
                    <Package className="text-blue-400" size={24} />
                  </div>
                  <p className="text-4xl font-bold">{products.length}</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-cyan-300 text-sm font-medium">Quantidade Total</p>
                    <BarChart3 className="text-cyan-400" size={24} />
                  </div>
                  <p className="text-4xl font-bold">{totalQuantity}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-yellow-300 text-sm font-medium">Estoque Baixo</p>
                    <AlertTriangle className="text-yellow-400" size={24} />
                  </div>
                  <p className="text-4xl font-bold">{lowStockProducts.length}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-emerald-300 text-sm font-medium">Taxa Saúde</p>
                    <BarChart3 className="text-emerald-400" size={24} />
                  </div>
                  <p className="text-4xl font-bold">
                    {Math.round(((products.length - lowStockProducts.length) / Math.max(products.length, 1)) * 100)}%
                  </p>
                </div>
              </div>

              {/* Produtos com Estoque Baixo */}
              {lowStockProducts.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Produtos com Estoque Baixo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lowStockProducts.map(product => (
                      <div
                        key={product.id}
                        className="bg-slate-800/50 border border-yellow-500/20 rounded-lg p-4"
                      >
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-yellow-300 text-sm">
                          {product.quantity ?? 0} un. (Mín: {product.minimum_quantity})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Últimas Movimentações */}
              <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4">Últimas Movimentações</h3>
                <p className="text-gray-400 text-sm">Histórico em desenvolvimento...</p>
              </div>
            </div>
          )}

          {/* SAÍDA (VENDA) */}
          {activeMenu === 'saida' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Barcode className="text-cyan-400" />
                  Venda de Produtos
                </h2>

                {/* Scanner Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-300 mb-3">
                    Código de Barras (Scanner)
                  </label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      id="scanner-input"
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && scanInput) {
                          handleScan(scanInput);
                        }
                      }}
                      placeholder="Aproxime o código de barras..."
                      className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Produto Selecionado */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-300 mb-3">Produto</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="">Selecione um produto...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - R$ {p.price.toFixed(2)} - Estoque: {p.quantity ?? 0}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantidade */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-blue-300 mb-3">Quantidade</label>
                    <input
                      id="quantity-input"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-300 mb-3">Observações</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Cliente João"
                      className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Botão */}
                <button
                  onClick={handleRemoveStock}
                  disabled={loading || !selectedProduct || !quantity}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <TrendingDown size={20} />
                  {loading ? 'Processando...' : 'Confirmar Venda'}
                </button>
              </div>
            </div>
          )}

          {/* ENTRADA */}
          {activeMenu === 'entrada' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="text-emerald-400" />
                  Nova Entrada de Produto
                </h2>

                {/* Nome do Produto */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-300 mb-3">Nome do Produto</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Camisa Branca"
                    className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                {/* Preço e Quantidade */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-blue-300 mb-3">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-300 mb-3">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Nota Fiscal */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-300 mb-3">Nota Fiscal / Observações</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: NF 123456"
                    className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                {/* Botão */}
                <button
                  onClick={handleAddProductWithStock}
                  disabled={loading || !productName || !productPrice || !quantity}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  {loading ? 'Processando...' : 'Confirmar Entrada'}
                </button>
              </div>
            </div>
          )}

          {/* ESTOQUE COMPLETO */}
          {activeMenu === 'estoque' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6">Estoque Completo</h2>
                
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 text-lg">Nenhum produto cadastrado ainda</p>
                    <p className="text-gray-500 text-sm mt-2">Vá para "Compra (Entrada)" para adicionar produtos</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-500/20">
                          <th className="text-left py-4 px-4 text-blue-300 font-semibold">Produto</th>
                          <th className="text-left py-4 px-4 text-blue-300 font-semibold">SKU</th>
                          <th className="text-right py-4 px-4 text-blue-300 font-semibold">Estoque</th>
                          <th className="text-right py-4 px-4 text-blue-300 font-semibold">Mínimo</th>
                          <th className="text-right py-4 px-4 text-blue-300 font-semibold">Preço</th>
                          <th className="text-center py-4 px-4 text-blue-300 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr
                            key={product.id}
                            className={`border-b border-blue-500/10 hover:bg-blue-800/20 transition-colors ${
                              (product.quantity ?? 0) <= product.minimum_quantity ? 'bg-yellow-900/10' : ''
                            }`}
                          >
                            <td className="py-4 px-4 font-medium">{product.name}</td>
                            <td className="py-4 px-4 text-gray-400">{product.sku}</td>
                            <td className="py-4 px-4 text-right font-semibold">{product.quantity ?? 0}</td>
                            <td className="py-4 px-4 text-right text-gray-400">{product.minimum_quantity}</td>
                            <td className="py-4 px-4 text-right">R$ {product.price.toFixed(2)}</td>
                            <td className="py-4 px-4 text-center">
                              {(product.quantity ?? 0) > product.minimum_quantity ? (
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
                                  OK
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                                  BAIXO
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RELATÓRIOS */}
          {activeMenu === 'relatorios' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="text-blue-400" />
                  Relatório de Movimentações
                </h2>

                {/* Filtro de Busca */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        placeholder="Buscar por nome do produto..."
                        className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Tabela de Movimentações */}
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 text-lg">Nenhuma movimentação registrada</p>
                    <p className="text-gray-500 text-sm mt-2">Adicione produtos e registre entradas/saídas para ver o histórico</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-500/20">
                          <th className="text-left py-4 px-4 text-blue-300 font-semibold">Produto</th>
                          <th className="text-center py-4 px-4 text-blue-300 font-semibold">Tipo</th>
                          <th className="text-right py-4 px-4 text-blue-300 font-semibold">Quantidade</th>
                          <th className="text-left py-4 px-4 text-blue-300 font-semibold">Observações</th>
                          <th className="text-left py-4 px-4 text-blue-300 font-semibold">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-blue-500/10">
                          <td colSpan={5} className="py-8 px-4 text-center text-gray-400">
                            Histórico de movimentações aparecerá aqui
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
