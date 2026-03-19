'use client';

import { useState } from 'react';
import { ShoppingCart, Camera, AlertCircle } from 'lucide-react';
import { saidaApi, Product, Sale } from '@/lib/supabase';
import { BarcodeScanner } from './barcode-scanner';
import { ComprovanteVenda } from './comprovante-venda';

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

export function SaidaForm() {
  console.log('🛒 SAIDA-FORM LOADED');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [produtoCarregado, setProdutoCarregado] = useState<Product | null>(null);
  const [erro, setErro] = useState('');
  const [ultimaVenda, setUltimaVenda] = useState<Sale | null>(null);
  const [isComprovanteOpen, setIsComprovanteOpen] = useState(false);

  const handleProductSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    setErro('');
    setQuantidade('');

    if (!prodId) {
      setProdutoCarregado(null);
      return;
    }

    // Buscar produto do Supabase
    try {
      setLoading(true);
      const produto = await saidaApi.findByBarcode(
        PRODUTOS.find(p => p.id === prodId)?.barcode || ''
      );
      
      if (produto) {
        console.log('✅ Produto carregado:', produto.name);
        setProdutoCarregado(produto);
      } else {
        setErro('❌ Erro ao carregar dados do estoque');
        setProdutoCarregado(null);
      }
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setErro('⚠️ Erro ao conectar');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeDetected = async (detectedCode: string) => {
    console.log('📱 Código detectado:', detectedCode);
    setIsScannerOpen(false);

    const found = PRODUTOS.find(p => p.barcode === detectedCode);
    if (found) {
      setSelectedProductId(found.id);
      await handleProductSelect({
        target: { value: found.id },
      } as any);
    } else {
      setErro(`❌ Produto com código ${detectedCode} não encontrado!`);
    }
  };

  const handleConfirm = async () => {
    if (!produtoCarregado || !quantidade) {
      setErro('⚠️ Preencha quantidade!');
      return;
    }

    const qtd = parseInt(quantidade);
    if (qtd <= 0) {
      setErro('⚠️ Quantidade deve ser maior que zero!');
      return;
    }

    if (produtoCarregado.quantity && produtoCarregado.quantity < qtd) {
      setErro(`❌ Estoque insuficiente! Disponível: ${produtoCarregado.quantity} un`);
      return;
    }

    setLoading(true);
    try {
      const venda = await saidaApi.registerSale(produtoCarregado, qtd);

      if (venda) {
        setUltimaVenda(venda);
        
        // Mostrar comprovante
        setTimeout(() => {
          setIsComprovanteOpen(true);
        }, 500);

        alert(`✅ ${venda.product_name} x ${qtd} un vendido!`);
        
        // Limpar campos
        setSelectedProductId('');
        setQuantidade('');
        setProdutoCarregado(null);
        setErro('');
      } else {
        setErro('❌ Erro ao registrar venda');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('❌ Erro ao processar venda');
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

      {ultimaVenda && (
        <ComprovanteVenda
          isOpen={isComprovanteOpen}
          onClose={() => setIsComprovanteOpen(false)}
          venda={ultimaVenda}
        />
      )}

      <div className="bg-gradient-to-br from-orange-800/50 to-red-800/20 border border-orange-500/20 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="text-yellow-400" />
          🛒 SAÍDA ESTOQUE - VENDAS
        </h2>

        {/* Selecionar Produto */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="sel-saida-produto" className="block text-sm font-semibold text-orange-300">
              Produto ({PRODUTOS.length} disponíveis)
            </label>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 text-cyan-300 px-3 py-1 rounded-lg text-sm font-semibold transition"
            >
              <Camera size={16} />
              Ou Escanear
            </button>
          </div>
          <select
            id="sel-saida-produto"
            value={selectedProductId}
            onChange={handleProductSelect}
            disabled={loading}
            className="w-full bg-slate-900/50 border border-orange-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <option value="">Selecione um produto...</option>
            {PRODUTOS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-xs text-yellow-400 mt-2">⏳ Carregando dados do estoque...</p>
          )}
        </div>

        {/* Erro */}
        {erro && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
            <p className="text-red-300 text-sm">{erro}</p>
          </div>
        )}

        {/* Produto Carregado */}
        {produtoCarregado && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-orange-500/30 rounded-lg p-6 space-y-4">
              {/* Info Produto */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-orange-300 uppercase">Produto</label>
                  <p className="text-lg font-bold text-white mt-1">{produtoCarregado.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-orange-300 uppercase">Preço Unitário</label>
                  <p className="text-lg font-bold text-emerald-400 mt-1">
                    R$ {(produtoCarregado.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Estoque Disponível */}
              <div className="bg-slate-900/50 rounded-lg p-3 flex items-center gap-3">
                <AlertCircle size={20} className="text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Estoque Disponível</p>
                  <p className="text-xl font-bold text-blue-300">
                    {produtoCarregado.quantity || 0} unidades
                  </p>
                </div>
              </div>

              {/* Quantidade a Vender */}
              <div>
                <label htmlFor="inp-qty-saida" className="block text-sm font-semibold text-orange-300 mb-2">
                  Quantidade a Vender
                </label>
                <input
                  id="inp-qty-saida"
                  type="number"
                  min="1"
                  max={produtoCarregado.quantity || 0}
                  value={quantidade}
                  onChange={(e) => {
                    setQuantidade(e.target.value);
                    setErro('');
                  }}
                  placeholder="0"
                  className="w-full bg-slate-900/50 border border-orange-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-500"
                />
              </div>

              {/* Total */}
              {quantidade && (
                <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-400">Quantidade</p>
                      <p className="text-lg font-bold text-white mt-1">{quantidade} un</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Unit.</p>
                      <p className="text-lg font-bold text-emerald-400 mt-1">
                        R$ {(produtoCarregado.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">TOTAL</p>
                      <p className="text-2xl font-bold text-emerald-300 mt-1">
                        R$ {((produtoCarregado.price || 0) * parseInt(quantidade)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Confirmar */}
            <button
              onClick={handleConfirm}
              disabled={!quantidade || loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingCart size={20} />
              {loading ? '⏳ Processando...' : '🛒 Confirmar Venda'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
