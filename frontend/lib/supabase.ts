import { createClient } from '@supabase/supabase-js';

// Keys públicas - seguro expor no frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkftluxwzpzcgjvwvjol.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZnRsdXh3enB6Y2dqdnd2am9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3OTQzMjgsImV4cCI6MjAyNjM5NDMyOH0.8vkQk6R4-dK4QJqZ0pY8zN5xLmP9aB2kC8dL6eF7gHI';

console.log('🔐 SUPABASE URL:', supabaseUrl);
console.log('🔐 SUPABASE KEY:', supabaseAnonKey ? '✅ CONFIGURADA' : '❌ FALTANDO');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Supabase URL ou Anon Key não configuradas!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos
export interface Product {
  id: string;
  name: string;
  barcode: string;
  price?: number;
  quantity?: number;
  created_at?: string;
}

// Funções para produtos
export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('📛 Erro ao buscar produtos:', error);
      return [];
    }
  },

  async create(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product]);
      
      if (error) throw error;
      console.log('✅ Produto inserido com sucesso!');
      return { id: '', ...product, created_at: new Date().toISOString() };
    } catch (error) {
      console.error('📛 Erro ao criar produto:', error);
      return null;
    }
  },

  async updateQuantity(id: string, quantity: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity })
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ Quantidade atualizada');
      return true;
    } catch (error) {
      console.error('📛 Erro ao atualizar quantidade:', error);
      return false;
    }
  },
};
