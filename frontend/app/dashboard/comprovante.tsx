'use client';

import { useRef } from 'react';
import { Printer, X } from 'lucide-react';

interface ComprovanteProps {
  isOpen: boolean;
  onClose: () => void;
  produto: {
    nome: string;
    barcode: string;
    preco: number;
    quantidade: number;
  };
}

export function Comprovante({ isOpen, onClose, produto }: ComprovanteProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Comprovante de Entrada</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              background: #fff;
            }
            .receipt {
              width: 58mm;
              margin: 0 auto;
              padding: 8mm;
              background: white;
              color: black;
              font-size: 10pt;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 8mm;
              margin-bottom: 8mm;
              font-weight: bold;
            }
            .section {
              margin-bottom: 6mm;
              border-bottom: 1px dashed #000;
              padding-bottom: 6mm;
            }
            .section:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              margin-top: 3mm;
              margin-bottom: 1mm;
            }
            .value {
              word-break: break-word;
            }
            .price-section {
              text-align: right;
              margin: 6mm 0;
            }
            .total {
              font-size: 12pt;
              font-weight: bold;
              text-align: right;
              border-top: 2px solid #000;
              padding-top: 4mm;
              margin-top: 4mm;
            }
            .footer {
              text-align: center;
              font-size: 8pt;
              margin-top: 8mm;
              color: #666;
            }
            .datetime {
              text-align: center;
              font-size: 9pt;
              color: #333;
              margin-top: 4mm;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .receipt {
                width: 58mm;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              📦 LL MODAS<br>
              COMPROVANTE DE ENTRADA
            </div>

            <div class="section">
              <div class="label">PRODUTO:</div>
              <div class="value">${produto.nome}</div>
            </div>

            <div class="section">
              <div class="label">CÓDIGO:</div>
              <div class="value">${produto.barcode}</div>
            </div>

            <div class="section">
              <div class="label">PREÇO UNITÁRIO:</div>
              <div class="price-section">R$ ${produto.preco.toFixed(2)}</div>
            </div>

            <div class="section">
              <div class="label">QUANTIDADE:</div>
              <div class="value">${produto.quantidade} un</div>
            </div>

            <div class="section">
              <div class="label">TOTAL:</div>
              <div class="total">R$ ${(produto.preco * produto.quantidade).toFixed(2)}</div>
            </div>

            <div class="datetime">
              ${new Date().toLocaleDateString('pt-BR')}<br>
              ${new Date().toLocaleTimeString('pt-BR')}
            </div>

            <div class="footer">
              ✓ Entrada Registrada no Sistema
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-blue-500/30 rounded-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Printer className="text-white" size={24} />
            <h3 className="text-xl font-bold text-white">Comprovante</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Preview */}
        <div className="p-6">
          {/* Simulação de recibo térmico 58mm */}
          <div
            ref={printRef}
            className="bg-white text-black p-4 rounded-lg font-mono text-xs border border-gray-300"
            style={{ width: '200px', margin: '0 auto' }}
          >
            <div className="text-center border-b pb-2 mb-2 font-bold">
              📦 LL MODAS<br />
              COMPROVANTE
            </div>

            <div className="mb-2 pb-2 border-b">
              <div className="font-bold text-xs">PRODUTO:</div>
              <div className="text-xs break-words">{produto.nome}</div>
            </div>

            <div className="mb-2 pb-2 border-b">
              <div className="font-bold text-xs">CÓDIGO:</div>
              <div className="text-xs">{produto.barcode}</div>
            </div>

            <div className="mb-2 pb-2 border-b">
              <div className="font-bold text-xs">PREÇO UNIT.:</div>
              <div className="text-right font-bold">R$ {produto.preco.toFixed(2)}</div>
            </div>

            <div className="mb-2 pb-2 border-b">
              <div className="font-bold text-xs">QUANTIDADE:</div>
              <div className="text-xs">{produto.quantidade} un</div>
            </div>

            <div className="mb-2 pb-2 border-b-2 border-black">
              <div className="font-bold text-xs">TOTAL:</div>
              <div className="text-right font-bold text-sm">
                R$ {(produto.preco * produto.quantidade).toFixed(2)}
              </div>
            </div>

            <div className="text-center text-xs mb-2 text-gray-600">
              {new Date().toLocaleDateString('pt-BR')}
              <br />
              {new Date().toLocaleTimeString('pt-BR')}
            </div>

            <div className="text-center text-xs">✓ Entrada Registrada</div>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-400 text-center mt-4">
            📄 Comprovante 58mm (impressora térmica)<br />
            Compatível com impressoras comuns também
          </p>
        </div>

        {/* Buttons */}
        <div className="bg-slate-800/50 p-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Printer size={16} />
            🖨️ Imprimir
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
