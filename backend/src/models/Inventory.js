import { supabase } from '../config/supabase.js';

export class Inventory {
  // Registrar entrada de estoque
  static async addStock(tenantId, productId, quantity, notes = '') {
    try {
      // Atualizar quantidade
      const { data: product } = await supabase
        .from('products')
        .select('quantity')
        .eq('tenant_id', tenantId)
        .eq('id', productId)
        .single();

      const newQuantity = (product?.quantity || 0) + quantity;

      await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('tenant_id', tenantId)
        .eq('id', productId);

      // Registrar movimento
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert([
          {
            tenant_id: tenantId,
            product_id: productId,
            movement_type: 'entrada',
            quantity: quantity,
            notes: notes,
            before_quantity: product?.quantity || 0,
            after_quantity: newQuantity
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, movement: data[0] };
    } catch (err) {
      console.error('Erro ao adicionar estoque:', err);
      return { success: false, error: err.message };
    }
  }

  // Registrar saída de estoque (venda)
  static async removeStock(tenantId, productId, quantity, notes = '') {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('quantity')
        .eq('tenant_id', tenantId)
        .eq('id', productId)
        .single();

      const currentQuantity = product?.quantity || 0;

      if (currentQuantity < quantity) {
        return { success: false, error: 'Quantidade insuficiente em estoque' };
      }

      const newQuantity = currentQuantity - quantity;

      await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('tenant_id', tenantId)
        .eq('id', productId);

      // Registrar movimento
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert([
          {
            tenant_id: tenantId,
            product_id: productId,
            movement_type: 'saida',
            quantity: quantity,
            notes: notes,
            before_quantity: currentQuantity,
            after_quantity: newQuantity
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, movement: data[0] };
    } catch (err) {
      console.error('Erro ao remover estoque:', err);
      return { success: false, error: err.message };
    }
  }

  // Buscar histórico de movimentações
  static async getMovementHistory(tenantId, productId = null, limit = 50) {
    try {
      let query = supabase
        .from('inventory_movements')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, movements: data };
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      return { success: false, error: err.message };
    }
  }

  // Verificar produtos com estoque baixo
  static async getLowStockProducts(tenantId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .lte('quantity', supabase.rpc('get_minimum_quantity', { tenant_id: tenantId }));

      if (error) throw error;
      return { success: true, products: data };
    } catch (err) {
      // Fallback: buscar manualmente
      const { data, error: err2 } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('quantity', { ascending: true });

      if (err2) throw err2;
      const lowStock = data.filter(p => p.quantity <= (p.minimum_quantity || 5));
      return { success: true, products: lowStock };
    }
  }
}
