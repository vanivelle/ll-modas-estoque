'use client';

import { useState, useRef, useEffect } from 'react';
import { Home, ShoppingCart, Package, BarChart3, Plus, Minus, Barcode, X, Camera } from 'lucide-react';
import { getProducts, addStock, removeStock } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  quantity: number;
  sku?: string;
}

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'vender' | 'comprar' | 'estoque'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedSku, setScannedSku] = useState('');
  const scannerInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadProducts();
    
    // Cleanup: parar câmera ao desmontar
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
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

  // Iniciar câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Câmera traseira em mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      alert('Erro ao acessar a câmera. Verifique as permissões.');
      console.error('Camera error:', error);
    }
  };

  // Parar câmera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  // Capturar foto e processar
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Desenhar vídeo no canvas
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Simular leitura de código (em produção, usar biblioteca de QR/Barcode)
    // Por enquanto, mostrar feedback visual
    alert('Câmera ativada! Em produção, você pode integrar uma biblioteca de leitura de código de barras.\nAtualmente use o scanner USB ou digite o SKU manualmente.');
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
      setShowModal(false);
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
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao remover estoque:', error);
    }
  };

  const lowStockProducts = products.filter(p => p.quantity < 5);
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">LL MODAS</h1>
              <p className="text-sm text-blue-100">Controle de Estoque</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-600 rounded-lg p-4 text-white text-center">
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-xs text-blue-100">Produtos</p>
              </div>
              <div className="bg-cyan-600 rounded-lg p-4 text-white text-center">
                <p className="text-2xl font-bold">{totalQuantity}</p>
                <p className="text-xs text-cyan-100">Quantidade</p>
              </div>
              <div className="bg-orange-600 rounded-lg p-4 text-white text-center">
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
                <p className="text-xs text-orange-100">Baixo Estoque</p>
              </div>
              <div className="bg-green-600 rounded-lg p-4 text-white text-center">
                <p className="text-2xl font-bold">{Math.round((products.filter(p => p.quantity > 10).length / (totalProducts || 1)) * 100)}%</p>
                <p className="text-xs text-green-100">Saudável</p>
              </div>
            </div>

            {/* Scanner Input */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-xs font-semibold text-gray-300">
                  <Barcode className="mr-2" size={16} />
                  Scanner USB
                </label>
                <span className="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded font-semibold">
                  🟢 Ativo
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
              
              {/* Visual Feedback - Scanner is ready */}
              <div className="bg-slate-700/50 border border-dashed border-green-500/50 rounded-lg p-4 text-center mb-3">
                <p className="text-sm text-gray-300 mb-2">
                  📱 Scanner pronto para leitura
                </p>
                <p className="text-xs text-gray-400">
                  Aponte o scanner para um código de barras
                </p>
              </div>
              
              {/* Botão de Câmera */}
              <button
                onClick={() => setShowCameraScanner(!showCameraScanner)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Camera size={16} />
                {showCameraScanner ? 'Fechar Câmera' : 'Usar Câmera'}
              </button>
            </div>

            {/* Camera Scanner Modal */}
            {showCameraScanner && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-gray-300 mb-3">Câmera para leitura de código de barras</p>
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    >
                      Iniciar Câmera
                    </button>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded mb-3 bg-black"
                        style={{ maxHeight: '200px' }}
                      />
                      <canvas ref={canvasRef} className="hidden" width={640} height={480} />
                      
                      <div className="flex gap-2">
                        <button
                          onClick={captureAndScan}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm"
                        >
                          Capturar
                        </button>
                        <button
                          onClick={() => {
                            stopCamera();
                            setShowCameraScanner(false);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded text-sm"
                        >
                          Fechar
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Dica: Use o scanner USB (mais rápido) ou digiteManualmente o SKU acima
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Últimos Produtos</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded text-sm">
                    <span className="text-white">{p.name}</span>
                    <span className={`font-semibold ${p.quantity < 5 ? 'text-red-400' : p.quantity < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {p.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vender Tab */}
        {activeTab === 'vender' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold text-white">Saída de Estoque</h2>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Produto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-semibold flex items-center justify-center"
                >
                  <Minus size={16} /> Menos
                </button>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold flex items-center justify-center"
                >
                  <Plus size={16} /> Mais
                </button>
              </div>

              <div className="text-center py-3 bg-slate-700 rounded">
                <p className="text-xs text-gray-400">Quantidade</p>
                <p className="text-3xl font-bold text-white">{quantity}</p>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Motivo (opcional)"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none resize-none"
                rows={2}
              />

              <button
                onClick={handleRemoveStock}
                disabled={!selectedProduct}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded"
              >
                <Minus className="inline mr-2" size={18} />
                Confirmar Saída
              </button>
            </div>
          </div>
        )}

        {/* Comprar Tab */}
        {activeTab === 'comprar' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold text-white">Entrada de Estoque</h2>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Produto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-semibold flex items-center justify-center"
                >
                  <Minus size={16} /> Menos
                </button>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold flex items-center justify-center"
                >
                  <Plus size={16} /> Mais
                </button>
              </div>

              <div className="text-center py-3 bg-slate-700 rounded">
                <p className="text-xs text-gray-400">Quantidade</p>
                <p className="text-3xl font-bold text-white">{quantity}</p>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fornecedor, NF... (opcional)"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none resize-none"
                rows={2}
              />

              <button
                onClick={handleAddStock}
                disabled={!selectedProduct}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded"
              >
                <Plus className="inline mr-2" size={18} />
                Confirmar Entrada
              </button>
            </div>
          </div>
        )}

        {/* Estoque Tab */}
        {activeTab === 'estoque' && (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Saldo de Estoque</h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-white flex-1">{p.name}</h3>
                    <span className={`text-lg font-bold ${p.quantity < 5 ? 'text-red-400' : p.quantity < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {p.quantity}
                    </span>
                  </div>
                  {p.sku && <p className="text-xs text-gray-400">SKU: {p.sku}</p>}
                  <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        p.quantity < 5 ? 'bg-red-500' : p.quantity < 10 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((p.quantity / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex items-center justify-around p-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition flex-1 ${
            activeTab === 'home' ? 'text-cyan-400 bg-slate-700' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Início</span>
        </button>

        <button
          onClick={() => setActiveTab('vender')}
          className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition flex-1 ${
            activeTab === 'vender' ? 'text-cyan-400 bg-slate-700' : 'text-gray-400'
          }`}
        >
          <ShoppingCart size={24} />
          <span className="text-xs">Vender</span>
        </button>

        <button
          onClick={() => setActiveTab('comprar')}
          className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition flex-1 ${
            activeTab === 'comprar' ? 'text-cyan-400 bg-slate-700' : 'text-gray-400'
          }`}
        >
          <Package size={24} />
          <span className="text-xs">Comprar</span>
        </button>

        <button
          onClick={() => setActiveTab('estoque')}
          className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition flex-1 ${
            activeTab === 'estoque' ? 'text-cyan-400 bg-slate-700' : 'text-gray-400'
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-xs">Estoque</span>
        </button>
      </div>
    </div>
  );
}
