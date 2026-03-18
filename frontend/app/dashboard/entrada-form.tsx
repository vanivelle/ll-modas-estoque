'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product, addStock, createProductWithStock } from '@/lib/api';

const DROPDOWN_PRODUCTS: Product[] = [
  { id: 'local-1', name: 'Camisa Social', sku: 'CAM001', barcode: '7998765432101', price: 89.90, minimum_quantity: 5, quantity: 0 },
  { id: 'local-2', name: 'Camisa Casual', sku: 'CAM002', barcode: '7998765432102', price: 69.90, minimum_quantity: 5, quantity: 0 },
  { id: 'local-3', name: 'Blusa de Frio', sku: 'BLU001', barcode: '7998765432103', price: 79.90, minimum_quantity: 4, quantity: 0 },
  { id: 'local-4', name: 'Bermuda', sku: 'BER001', barcode: '7998765432104', price: 59.90, minimum_quantity: 5, quantity: 0 },
  { id: 'local-5', name: 'Calça Jeans', sku: 'CAL001', barcode: '7998765432105', price: 99.90, minimum_quantity: 3, quantity: 0 },
  { id: 'local-6', name: 'Vestido Festa', sku: 'VES001', barcode: '7998765432106', price: 149.90, minimum_quantity: 2, quantity: 0 },
  { id: 'local-7', name: 'Jaqueta', sku: 'JAC001', barcode: '7998765432107', price: 129.90, minimum_quantity: 2, quantity: 0 },
  { id: 'local-8', name: 'Relógio Analógico', sku: 'REL001', barcode: '7998765432108', price: 89.90, minimum_quantity: 3, quantity: 0 },
  { id: 'local-9', name: 'Óculos de Sol UV', sku: 'OCU001', barcode: '7998765432109', price: 149.90, minimum_quantity: 5, quantity: 0 },
  { id: 'local-10', name: 'Relógio Digital Led', sku: 'REL002', barcode: '7998765432110', price: 59.90, minimum_quantity: 4, quantity: 0 },
  { id: 'local-11', name: 'Óculos Estilo Wayfarer', sku: 'OCU002', barcode: '7998765432111', price: 129.90, minimum_quantity: 3, quantity: 0 },
  { id: 'local-12', name: 'Pulseira Relógio LED', sku: 'PUL001', barcode: '7998765432112', price: 45.90, minimum_quantity: 8, quantity: 0 },
  { id: 'local-13', name: 'Corrente de Aço Inox', sku: 'COR001', barcode: '7998765432113', price: 79.90, minimum_quantity: 5, quantity: 0 },
  { id: 'local-14', name: 'Anel Aço Inox', sku: 'ANE001', barcode: '7998765432114', price: 34.90, minimum_quantity: 10, quantity: 0 },
  { id: 'local-15', name: 'Bolsa Feminina', sku: 'BOL001', barcode: '7998765432115', price: 119.90, minimum_quantity: 2, quantity: 0 },
  { id: 'local-16', name: 'Sapato Feminino', sku: 'SAP001', barcode: '7998765432116', price: 139.90, minimum_quantity: 3, quantity: 0 },
  { id: 'local-17', name: 'Chinelo Masculino', sku: 'CHI001', barcode: '7998765432117', price: 39.90, minimum_quantity: 8, quantity: 0 },
  { id: 'local-18', name: 'Meia Social', sku: 'MEI001', barcode: '7998765432118', price: 12.90, minimum_quantity: 20, quantity: 0 },
  { id: 'local-19', name: 'Cinto Couro', sku: 'CIN001', barcode: '7998765432119', price: 69.90, minimum_quantity: 5, quantity: 0 },
  { id: 'local-20', name: 'Chapéu', sku: 'CHA001', barcode: '7998765432120', price: 49.90, minimum_quantity: 4, quantity: 0 },
];

export function EntradaForm() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [productName, setProductName] = useState('');
  const [productBarcode, setProductBarcode] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProduct(value);

    if (value === 'new') {
      setProductName('');
      setProductBarcode('');
      setProductPrice('');
    } else if (value) {
      const prod = DROPDOWN_PRODUCTS.find(p => p.id === value);
      if (prod) {
        setProductName(prod.name);
        setProductBarcode(prod.barcode);
        setProductPrice(prod.price.toString());
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !productPrice || !quantity || !productName) {
      alert('Preencha: Produto, Nome, Preço e Quantidade');
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price) || price <= 0) {
      alert('Preço inválido');
      return;
    }

    setLoading(true);
    try {
      if (selectedProduct === 'new') {
        const result = await createProductWithStock({
          name: productName,
          price: price,
          quantity: parseInt(quantity),
          minimum_quantity: 1,
          notes: notes,
        });
        if (result.success) {
          alert('✅ Produto criado!');
          resetForm();
        } else {
          alert('❌ Erro: ' + result.error);
        }
      } else {
        const result = await addStock(selectedProduct, parseInt(quantity), notes);
        if (result.success) {
          alert('✅ Entrada registrada!');
          resetForm();
        } else {
          alert('❌ Erro: ' + result.error);
        }
      }
    } catch (error: any) {
      alert('❌ Erro ao processar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct('');
    setProductName('');
    setProductBarcode('');
    setProductPrice('');
    setQuantity('');
    setNotes('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Plus className="text-emerald-400" />
          Entrada de Estoque
        </h2>

        {/* Produto Selecionado */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-blue-300 mb-3">
            Produto ({DROPDOWN_PRODUCTS.length} disponíveis)
          </label>
          <select
            value={selectedProduct}
            onChange={handleProductChange}
            className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="">Selecione um produto...</option>
            {DROPDOWN_PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="new">+ Novo Produto</option>
          </select>
        </div>

        {selectedProduct && (
          <>
            {/* Nome do Produto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-300 mb-3">Nome do Produto</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Camisa Branca"
                disabled={selectedProduct !== 'new'}
                className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>

            {/* Código de Barras */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-300 mb-3">Código de Barras</label>
              <input
                type="text"
                value={productBarcode}
                onChange={(e) => setProductBarcode(e.target.value)}
                placeholder="Ex: 7998765432101"
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
              <label className="block text-sm font-semibold text-blue-300 mb-3">Nota Fiscal</label>
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
              onClick={handleSubmit}
              disabled={loading || !selectedProduct || !productPrice || !quantity || !productName}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {loading ? 'Processando...' : 'Confirmar Entrada'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
