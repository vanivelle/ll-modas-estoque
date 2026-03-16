import { supabase } from '../config/supabase.js';

export class Product {
  // Criar novo produto
  static async create(tenantId, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            tenant_id: tenantId,
            name: productData.name,
            sku: productData.sku,
            barcode: productData.barcode,
            price: productData.price,
            minimum_quantity: productData.minimum_quantity || 5
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, product: data[0] };
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      return { success: false, error: err.message };
    }
  }

  // Buscar todos os produtos do tenant
  static async getAll(tenantId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, products: data };
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      return { success: false, error: err.message };
    }
  }

  // Buscar um produto específico
  static async getById(tenantId, productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return { success: true, product: data };
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      return { success: false, error: err.message };
    }
  }

  // Buscar por código de barras
  static async getByBarcode(tenantId, barcode) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('barcode', barcode)
        .single();

      if (error) throw error;
      return { success: true, product: data };
    } catch (err) {
      console.error('Erro ao buscar por barcode:', err);
      return { success: false, error: err.message };
    }
  }

  // Atualizar produto
  static async update(tenantId, productId, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('tenant_id', tenantId)
        .eq('id', productId)
        .select();

      if (error) throw error;
      return { success: true, product: data[0] };
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      return { success: false, error: err.message };
    }
  }

  // Deletar produto
  static async delete(tenantId, productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('tenant_id', tenantId)
        .eq('id', productId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      return { success: false, error: err.message };
    }
  }
}
