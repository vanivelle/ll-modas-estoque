import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnqiicsiuyokexrwtrrg.supabase.co';
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

export interface Sale {
  id?: string;
  product_id?: string;
  product_name: string;
  barcode: string;
  unit_price: number;
  quantity_sold: number;
  total_value: number;
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

// Funções para saídas/vendas
export const saidaApi = {
  // Buscar produto pelo barcode
  async findByBarcode(barcode: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .single();
      
      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('📛 Erro ao buscar produto:', error);
      return null;
    }
  },

  // Registrar saída (venda)
  async registerSale(product: Product, quantitySold: number, notes?: string): Promise<Sale | null> {
    try {
      // Validar disponibilidade
      if (!product.quantity || product.quantity < quantitySold) {
        throw new Error('❌ Quantidade insuficiente em estoque');
      }

      // Calcular nova quantidade
      const newQuantity = product.quantity - quantitySold;

      // Atualizar produto
      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Registrar movimento (se tabela existir)
      try {
        await supabase
          .from('inventory_movements')
          .insert([{
            product_id: product.id,
            movement_type: 'saida',
            quantity: quantitySold,
            before_quantity: product.quantity,
            after_quantity: newQuantity,
            notes: notes || 'Venda registrada',
          }]);
      } catch (e) {
        console.warn('⚠️ Tabela de movimentos não disponível:', e);
      }

      console.log('✅ Venda registrada com sucesso!');
      
      // Retornar dados da venda
      return {
        product_name: product.name,
        barcode: product.barcode,
        unit_price: product.price || 0,
        quantity_sold: quantitySold,
        total_value: (product.price || 0) * quantitySold,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('📛 Erro ao registrar saída:', error);
      return null;
    }
  },

  // Buscar todas as vendas (histórico)
  async getAllSales(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .eq('movement_type', 'saida')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('📛 Erro ao buscar vendas:', error);
      return [];
    }
  },
};
