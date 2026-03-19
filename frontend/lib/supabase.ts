import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnqiicsiyoykexrwtrg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucWlpY3NpdXlva2V4cnd0cnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTc3NDEsImV4cCI6MjA4OTIzMzc0MX0.hSZxpZn35StoNJYuv1z6hpcoe8TTECCqgviCcb_fzwI';

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
