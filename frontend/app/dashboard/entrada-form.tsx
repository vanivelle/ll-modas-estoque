'use client';

import { useState } from 'react';
import { Plus, Camera } from 'lucide-react';
import { productsApi } from '@/lib/supabase';
import { BarcodeScanner } from './barcode-scanner';

const PRODUTOS = [
  { id: 'local-1', name: 'Camisa Social', barcode: '7998765432101' },
  { id: 'local-2', name: 'Camisa Casual', barcode: '7998765432102' },
  { id: 'local-3', name: 'Blusa de Frio', barcode: '7998765432103' },
  { id: 'local-4', name: 'Bermuda', barcode: '7998765432104' },
  { id: 'local-5', name: 'Calça Jeans', barcode: '7998765432105' },
  { id: 'local-6', name: 'Vestido Festa', barcode: '7998765432106' },
  { id: 'local-7', name: 'Jaqueta', barcode: '7998765432107' },
  { id: 'local-8', name: 'Relógio Analógico', barcode: '7998765432108' },
  { id: 'local-9', name: 'Óculos de Sol UV', barcode: '7998765432109' },
  { id: 'local-10', name: 'Relógio Digital Led', barcode: '7998765432110' },
  { id: 'local-11', name: 'Óculos Estilo Wayfarer', barcode: '7998765432111' },
  { id: 'local-12', name: 'Pulseira Relógio LED', barcode: '7998765432112' },
  { id: 'local-13', name: 'Corrente de Aço Inox', barcode: '7998765432113' },
  { id: 'local-14', name: 'Anel Aço Inox', barcode: '7998765432114' },
  { id: 'local-15', name: 'Bolsa Feminina', barcode: '7998765432115' },
  { id: 'local-16', name: 'Sapato Feminino', barcode: '7998765432116' },
  { id: 'local-17', name: 'Chinelo Masculino', barcode: '7998765432117' },
  { id: 'local-18', name: 'Meia Social', barcode: '7998765432118' },
  { id: 'local-19', name: 'Cinto Couro', barcode: '7998765432119' },
  { id: 'local-20', name: 'Chapéu', barcode: '7998765432120' },
];

export function EntradaForm() {
  console.log('🔵 ENTRADA-FORM LOADED - Produtos:', PRODUTOS.length);
  const [selectedId, setSelectedId] = useState('');
  const [nome, setNome] = useState('');
  const [barcode, setBarcode] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nota, setNota] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleBarcodeDetected = (detectedCode: string) => {
    console.log('📱 Código detectado:', detectedCode);
    
    // Procurar produto pelo código
    const foundProduct = PRODUTOS.find(p => p.barcode === detectedCode);
    
    if (foundProduct) {
      console.log('✅ Produto encontrado:', foundProduct.name);
      setSelectedId(foundProduct.id);
      setNome(foundProduct.name);
      setBarcode(foundProduct.barcode);
      setPreco(''); // Usuário digita o preço
      setIsScannerOpen(false);
      alert(`✅ Produto encontrado: ${foundProduct.name}`);
    } else {
      console.warn('❌ Produto não encontrado para código:', detectedCode);
      alert(`❌ Produto com código ${detectedCode} não encontrado no catálogo!`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedId(val);

    if (val === 'novo') {
      setNome('');
      setBarcode('');
      setPreco('');
    } else {
      const prod = PRODUTOS.find(p => p.id === val);
      if (prod) {
        setNome(prod.name);
        setBarcode(prod.barcode);
        setPreco(''); // SEMPRE vazio - usuário digita
      }
    }
  };

  const handleConfirm = async () => {
    if (!nome || !barcode || !preco || !quantidade) {
      alert('⚠️ Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      const result = await productsApi.create({
        name: nome,
        barcode: barcode,
        price: parseFloat(preco),
        quantity: parseInt(quantidade),
      });

      if (result) {
        alert(`✅ ${nome} x ${quantidade} un adicionado ao estoque!`);
        // Limpar campos
        setSelectedId('');
        setNome('');
        setBarcode('');
        setPreco('');
        setQuantidade('');
        setNota('');
      } else {
        alert('❌ Erro ao salvar no Supabase');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao conectar com banco de dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <BarcodeScanner 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDetected={handleBarcodeDetected}
      />

      <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Plus className="text-emerald-400" />
          📦 ENTRADA ESTOQUE - 20 PRODUTOS CARREGADOS
        </h2>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="sel-produto" className="block text-sm font-semibold text-blue-300">
              Produto ({PRODUTOS.length} disponíveis)
            </label>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 text-cyan-300 px-3 py-1 rounded-lg text-sm font-semibold transition"
              title="Abrir leitor de código de barras"
            >
              <Camera size={16} />
              Escanear
            </button>
          </div>
          <select
            id="sel-produto"
            name="sel-produto"
            value={selectedId}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="">Selecione um produto...</option>
            {PRODUTOS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="novo">+ Novo Produto</option>
          </select>
        </div>

        {selectedId && (
          <>
            <div className="mb-6">
              <label htmlFor="inp-nome" className="block text-sm font-semibold text-blue-300 mb-3">
                Nome do Produto
              </label>
              <input
                id="inp-nome"
                name="inp-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={selectedId !== 'novo'}
                className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white disabled:opacity-50"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="inp-barcode" className="block text-sm font-semibold text-blue-300 mb-3">
                Código de Barras
              </label>
              <input
                id="inp-barcode"
                name="inp-barcode"
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="inp-preco" className="block text-sm font-semibold text-blue-300 mb-3">
                  Preço Unitário (R$)
                </label>
                <input
                  id="inp-preco"
                  name="inp-preco"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Digite o valor"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label htmlFor="inp-qty" className="block text-sm font-semibold text-blue-300 mb-3">
                  Quantidade
                </label>
                <input
                  id="inp-qty"
                  name="inp-qty"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="inp-nota" className="block text-sm font-semibold text-blue-300 mb-3">
                Nota Fiscal / Observações
              </label>
              <input
                id="inp-nota"
                name="inp-nota"
                type="text"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Ex: NF 123456"
                className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-500"
              />
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedId || !nome || !preco || !quantidade || loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={20} />
              {loading ? '⏳ Salvando...' : '✅ Confirmar Entrada'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
