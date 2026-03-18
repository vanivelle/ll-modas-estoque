'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LogOut,
  Plus,
  Minus,
  Barcode,
  Menu,
  Package,
} from 'lucide-react';
import { EntradaForm } from '../entrada-form';

export default function DesktopDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saida' | 'entrada' | 'estoque' | 'relatorios'>('entrada');

  // Dados removidos - sem API localhost

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'saida' as const, label: 'Saída', icon: Minus },
    { id: 'entrada' as const, label: 'Entrada', icon: Plus },
    { id: 'estoque' as const, label: 'Estoque', icon: Package },
    { id: 'relatorios' as const, label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-800 to-slate-950 border-r border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-xl font-bold text-cyan-400">LL MODAS</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded transition"
            >
              <Menu size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20 transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 bg-slate-900">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <div className="text-center py-12">
                  <Package className="mx-auto mb-4 text-gray-500" size={48} />
                  <p className="text-gray-400 text-lg">Dashboard em desenvolvimento</p>
                  <p className="text-gray-500 text-sm mt-2">Vá para &quot;Entrada&quot; para adicionar produtos ao estoque</p>
                </div>
              </div>
            </div>
          )}

          {/* Entrada Tab - USA O COMPONENTE EntradaForm */}
          {activeTab === 'entrada' && (
            <div>
              <EntradaForm />
            </div>
          )}

          {/* Saída Tab */}
          {activeTab === 'saida' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Saída de Estoque</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <p className="text-gray-400">Saída em desenvolvimento - será conectada ao banco de dados</p>
              </div>
            </div>
          )}

          {/* Estoque Tab */}
          {activeTab === 'estoque' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Consulta de Estoque</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <p className="text-gray-400">Estoque em desenvolvimento - será conectada ao banco de dados</p>
              </div>
            </div>
          )}

          {/* Relatórios Tab */}
          {activeTab === 'relatorios' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Relatórios</h1>
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <p className="text-gray-400">Relatórios em desenvolvimento...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
