'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import Quagga from '@ericblade/quagga2';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function BarcodeScanner({ onDetected, isOpen, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastCode, setLastCode] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const startScanning = async () => {
      try {
        console.log('🔴 Iniciando Quagga...');
        
        await Quagga.init(
          {
            inputStream: {
              type: 'LiveStream',
              constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: 'environment',
              },
              target: videoRef.current,
            },
            decoder: {
              readers: ['ean_reader', 'ean_8_reader', 'code_128_reader'],
              debug: {
                showPattern: true,
                showCanvas: true,
                showLog: true,
              },
            },
            locate: true,
            frequency: 10,
            multiple: false,
          },
          (err) => {
            if (err) {
              console.error('❌ Erro ao inicializar Quagga:', err);
              alert('❌ Erro ao acessar câmera. Verifique permissões.');
              return;
            }
            console.log('✅ Quagga inicializado');
            Quagga.start();
            setIsScanning(true);
          }
        );

        Quagga.onDetected((result) => {
          if (result && result.codeResult) {
            const code = result.codeResult.code;
            console.log('📊 Código detectado:', code);
            
            // Evitar detectar o mesmo código várias vezes rapidamente
            if (code && code !== lastCode) {
              setLastCode(code);
              onDetected(code);
              
              // Parar scanner após detectar
              Quagga.stop();
              setIsScanning(false);
              console.log('✅ Scanner parado após detecção');
            }
          }
        });
      } catch (err) {
        console.error('❌ Erro ao iniciar scanner:', err);
        alert('❌ Erro ao iniciar scanner');
      }
    };

    startScanning();

    return () => {
      if (isScanning) {
        try {
          Quagga.stop();
          console.log('🛑 Quagga parado');
        } catch (e) {
          console.error('Erro ao parar Quagga:', e);
        }
      }
    };
  }, [isOpen, onDetected, lastCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-blue-500/30 rounded-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="text-yellow-300" size={24} />
            <h3 className="text-xl font-bold text-white">📸 Leitor de Código de Barras</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black p-0 overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div ref={videoRef} className="w-full h-full">
            {/* Quagga renderiza aqui */}
          </div>

          {/* Overlay - Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-yellow-400 rounded-lg bg-gradient-to-b from-yellow-400/10 to-transparent"></div>
          </div>

          {/* Status */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-2 rounded text-sm">
            {isScanning ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                🔴 Escaneando...
              </span>
            ) : (
              <span>⏸️ Iniciando...</span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 p-4 text-center">
          <p className="text-yellow-300 text-sm font-semibold">
            ↓ Aponte a câmera para o código de barras do produto
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Suporta: EAN-13, EAN-8, Code-128
          </p>
        </div>
      </div>
    </div>
  );
}
