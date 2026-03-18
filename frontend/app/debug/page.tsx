'use client';

import { useState, useEffect } from 'react';

export default function DebugDropdown() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 DEBUG: Iniciando carregamento de produtos...');
    
    fetch('/produtos.json')
      .then(res => {
        console.log('🔵 DEBUG: Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('🔵 DEBUG: Dados carregados:', data);
        console.log('🔵 DEBUG: Quantidade de produtos:', data.length);
        setProdutos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ DEBUG: Erro ao carregar JSON:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🔧 DEBUG DROPDOWN</h1>
      
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <p className="mb-2">Status: {loading ? '⏳ Carregando...' : '✅ Pronto'}</p>
        <p className="mb-2">Total de produtos: <strong>{produtos.length}</strong></p>
        <p className="mb-2">ID Selecionado: <strong>{selectedId}</strong></p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <label className="block text-sm font-bold mb-3">Dropdown com {produtos.length} itens:</label>
        <select
          id="debug-select"
          value={selectedId}
          onChange={(e) => {
            console.log('🔵 DEBUG: Dropdown mudou para:', e.target.value);
            setSelectedId(e.target.value);
          }}
          className="w-full bg-slate-700 border border-blue-500 rounded p-3 text-white"
        >
          <option value="">-- Selecione --</option>
          {produtos && produtos.length > 0 ? (
            produtos.map((p) => {
              console.log('🔵 DEBUG: Renderizando opção:', p.id, p.name);
              return (
                <option key={p.id} value={p.id}>
                  {p.name} - R$ {p.price}
                </option>
              );
            })
          ) : (
            <option disabled>Nenhum produto disponível</option>
          )}
        </select>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">📋 JSON Carregado:</h3>
        <pre className="bg-slate-900 p-4 rounded overflow-auto max-h-96 text-xs">
          {JSON.stringify(produtos, null, 2)}
        </pre>
      </div>
    </div>
  );
}
