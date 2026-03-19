'use client';

import { useState, useEffect } from 'react';
import { Home, ShoppingCart, Package, BarChart3 } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'entrada' | 'saida' | 'estoque'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [priceInput, setPriceInput] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro carregando produtos:', error);
    }
  };

  const handleEntrada = async () => {
    if (!selectedProductId || !quantity || !priceInput) {
      alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const product = products.find(p => p.id === selectedProductId);
      if (!product) return;

      await supabase.from('inventory_movements').insert([{
        product_id: selectedProductId,
        movement_type: 'entrada',
        quantity: quantity,
        notes: notes,
        created_at: new Date().toISOString()
      }]);

      const newQty = (product.quantity || 0) + quantity;
      await supabase
        .from('products')
        .update({ quantity: newQty, price: parseFloat(priceInput) })
        .eq('id', selectedProductId);

      alert('✅ Entrada registrada!');
      setSelectedProductId('');
      setQuantity(1);
      setPriceInput('');
      setNotes('');
      loadProducts();
    } catch (error) {
      alert('❌ Erro ao registrar entrada');
      console.error(error);
    }
    setLoading(false);
  };

  const handleSaida = async () => {
    if (!selectedProductId || !quantity) {
      alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const product = products.find(p => p.id === selectedProductId);
      if (!product) return;

      if ((product.quantity || 0) < quantity) {
        alert('❌ Quantidade insuficiente em estoque');
        setLoading(false);
        return;
      }

      await supabase.from('inventory_movements').insert([{
        product_id: selectedProductId,
        movement_type: 'saida',
        quantity: quantity,
        notes: notes,
        created_at: new Date().toISOString()
      }]);

      const newQty = (product.quantity || 0) - quantity;
      await supabase
        .from('products')
        .update({ quantity: newQty })
        .eq('id', selectedProductId);

      alert('✅ Saída registrada!');
      setSelectedProductId('');
      setQuantity(1);
      setNotes('');
      loadProducts();
    } catch (error) {
      alert('❌ Erro ao registrar saída');
      console.error(error);
    }
    setLoading(false);
  };

  const totalQty = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const lowStock = products.filter(p => (p.quantity || 0) < 5).length;
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white">
      <header className="sticky top-0 bg-gradient-to-r from-slate-800/90 to-blue-800/90 backdrop-blur p-4 border-b border-blue-700/30 z-40">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">LL MODAS</h1>
        <p className="text-xs text-gray-400">Estoque Móvel</p>
      </header>

      <main className="p-4 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-600/40 to-blue-800/40 border border-blue-500/30 rounded-lg p-4">
                <Package className="text-blue-400 mb-2" size={20} />
                <p className="text-xs text-blue-300">Produtos</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/40 to-cyan-800/40 border border-cyan-500/30 rounded-lg p-4">
                <BarChart3 className="text-cyan-400 mb-2" size={20} />
                <p className="text-xs text-cyan-300">Total Qtd</p>
                <p className="text-2xl font-bold">{totalQty}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/40 to-yellow-800/40 border border-yellow-500/30 rounded-lg p-4">
                <ShoppingCart className="text-yellow-400 mb-2" size={20} />
                <p className="text-xs text-yellow-300">Baixo Est.</p>
                <p className="text-2xl font-bold">{lowStock}</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/40 to-green-800/40 border border-green-500/30 rounded-lg p-4">
                <Home className="text-green-400 mb-2" size={20} />
                <p className="text-xs text-green-300">Status</p>
                <p className="text-2xl font-bold">✅</p>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-blue-600/30 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-200">📱 Use os botões abaixo para:</p>
              <p className="text-xs text-gray-400 mt-2">✅ Entrada - Receber mercadoria</p>
              <p className="text-xs text-gray-400">🛒 Saída - Vender produtos</p>
              <p className="text-xs text-gray-400">📦 Estoque - Consultar</p>
            </div>
          </div>
        )}

        {activeTab === 'entrada' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">➕ Entrada de Produtos</h2>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="">Selecione um produto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity || 0})</option>
              ))}
            </select>
            {selectedProduct && (
              <div className="bg-slate-800/50 border border-blue-600/30 rounded p-3 text-sm">
                <p><strong>Código:</strong> {selectedProduct.barcode}</p>
                <p><strong>Estoque:</strong> {selectedProduct.quantity || 0}</p>
              </div>
            )}
            <input type="number" placeholder="Preço unitário" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm" />
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm" placeholder="Quantidade" />
            <input type="text" placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm" />
            <button onClick={handleEntrada} disabled={loading || !selectedProductId} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-2 rounded font-semibold text-sm">{loading ? 'Salvando...' : '✅ Confirmar Entrada'}</button>
          </div>
        )}

        {activeTab === 'saida' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">🛒 Saída de Produtos</h2>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="">Selecione um produto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity || 0})</option>
              ))}
            </select>
            {selectedProduct && (
              <div className="bg-slate-800/50 border border-orange-600/30 rounded p-3 text-sm">
                <p><strong>Código:</strong> {selectedProduct.barcode}</p>
                <p><strong>Preço:</strong> R$ {selectedProduct.price?.toFixed(2) || '0.00'}</p>
                <p><strong>Disponível:</strong> {selectedProduct.quantity || 0}</p>
                <p><strong>Total:</strong> R$ {((selectedProduct.price || 0) * quantity).toFixed(2)}</p>
              </div>
            )}
            <input type="number" min="1" max={selectedProduct?.quantity || 1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm" placeholder="Quantidade" />
            <input type="text" placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm" />
            <button onClick={handleSaida} disabled={loading || !selectedProductId} className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 py-2 rounded font-semibold text-sm">{loading ? 'Salvando...' : '🛒 Confirmar Venda'}</button>
          </div>
        )}

        {activeTab === 'estoque' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold mb-4">📦 Consultar Estoque</h2>
            {products.map(p => (
              <div key={p.id} className="bg-slate-800/30 border border-slate-700 rounded p-3">
                <p className="font-semibold text-sm mb-1">{p.name}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <p>📄 {p.barcode}</p>
                  <p>💰 R$ {p.price?.toFixed(2) || '0.00'}</p>
                  <p>📦 {p.quantity || 0} un</p>
                  <p>{(p.quantity || 0) > 10 ? '✅ OK' : (p.quantity || 0) > 0 ? '⚠️ Baixo' : '❌ Fora'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-blue-700/30 grid grid-cols-4">
        <button onClick={() => setActiveTab('home')} className={`py-3 text-center text-xs font-semibold transition-all ${activeTab === 'home' ? 'text-blue-400 border-t-2 border-blue-400' : 'text-gray-400'}`}>📊 Home</button>
        <button onClick={() => setActiveTab('entrada')} className={`py-3 text-center text-xs font-semibold transition-all ${activeTab === 'entrada' ? 'text-green-400 border-t-2 border-green-400' : 'text-gray-400'}`}>➕ Entrada</button>
        <button onClick={() => setActiveTab('saida')} className={`py-3 text-center text-xs font-semibold transition-all ${activeTab === 'saida' ? 'text-orange-400 border-t-2 border-orange-400' : 'text-gray-400'}`}>🛒 Saída</button>
        <button onClick={() => setActiveTab('estoque')} className={`py-3 text-center text-xs font-semibold transition-all ${activeTab === 'estoque' ? 'text-cyan-400 border-t-2 border-cyan-400' : 'text-gray-400'}`}>📦 Estoque</button>
      </nav>
    </div>
  );
}
