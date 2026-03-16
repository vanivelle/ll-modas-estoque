'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    </div>
  );
}
