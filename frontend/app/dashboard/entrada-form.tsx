'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

const PRODUTOS = [
  { id: 'local-1', name: 'Camisa Social', barcode: '7998765432101', price: 89.90 },
  { id: 'local-2', name: 'Camisa Casual', barcode: '7998765432102', price: 69.90 },
  { id: 'local-3', name: 'Blusa de Frio', barcode: '7998765432103', price: 79.90 },
  { id: 'local-4', name: 'Bermuda', barcode: '7998765432104', price: 59.90 },
  { id: 'local-5', name: 'Calça Jeans', barcode: '7998765432105', price: 99.90 },
  { id: 'local-6', name: 'Vestido Festa', barcode: '7998765432106', price: 149.90 },
  { id: 'local-7', name: 'Jaqueta', barcode: '7998765432107', price: 129.90 },
  { id: 'local-8', name: 'Relógio Analógico', barcode: '7998765432108', price: 89.90 },
  { id: 'local-9', name: 'Óculos de Sol UV', barcode: '7998765432109', price: 149.90 },
  { id: 'local-10', name: 'Relógio Digital Led', barcode: '7998765432110', price: 59.90 },
  { id: 'local-11', name: 'Óculos Estilo Wayfarer', barcode: '7998765432111', price: 129.90 },
  { id: 'local-12', name: 'Pulseira Relógio LED', barcode: '7998765432112', price: 45.90 },
  { id: 'local-13', name: 'Corrente de Aço Inox', barcode: '7998765432113', price: 79.90 },
  { id: 'local-14', name: 'Anel Aço Inox', barcode: '7998765432114', price: 34.90 },
  { id: 'local-15', name: 'Bolsa Feminina', barcode: '7998765432115', price: 119.90 },
  { id: 'local-16', name: 'Sapato Feminino', barcode: '7998765432116', price: 139.90 },
  { id: 'local-17', name: 'Chinelo Masculino', barcode: '7998765432117', price: 39.90 },
  { id: 'local-18', name: 'Meia Social', barcode: '7998765432118', price: 12.90 },
  { id: 'local-19', name: 'Cinto Couro', barcode: '7998765432119', price: 69.90 },
  { id: 'local-20', name: 'Chapéu', barcode: '7998765432120', price: 49.90 },
];

export function EntradaForm() {
  const [selectedId, setSelectedId] = useState('');
  const [nome, setNome] = useState('');
  const [barcode, setBarcode] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nota, setNota] = useState('');

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
        setPreco(prod.price.toString());
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-blue-800/20 border border-blue-500/20 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Plus className="text-emerald-400" />
          Entrada de Estoque
        </h2>

        <div className="mb-6">
          <label htmlFor="sel-produto" className="block text-sm font-semibold text-blue-300 mb-3">
            Produto ({PRODUTOS.length} disponíveis)
          </label>
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
                Nome
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
                  Preço
                </label>
                <input
                  id="inp-preco"
                  name="inp-preco"
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white"
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
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="inp-nota" className="block text-sm font-semibold text-blue-300 mb-3">
                Nota Fiscal
              </label>
              <input
                id="inp-nota"
                name="inp-nota"
                type="text"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full bg-slate-900/50 border border-blue-500/30 rounded-lg py-3 px-4 text-white"
              />
            </div>

            <button
              onClick={() => alert(`✅ ${nome} x ${quantidade}`)}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Confirmar Entrada
            </button>
          </>
        )}
      </div>
    </div>
  );
}
