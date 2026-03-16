import { Inventory } from '../models/Inventory.js';

const DEFAULT_TENANT_ID = '6ef5702d-0e8d-4a17-b1fd-73352c9e849d'; // L&L Modas

export class InventoryController {
  // Adicionar estoque
  static async addStock(req, res) {
    try {
      const { productId, quantity, notes } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: productId, quantity' 
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({ 
          error: 'Quantidade deve ser maior que 0' 
        });
      }

      const result = await Inventory.addStock(DEFAULT_TENANT_ID, productId, quantity, notes);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.status(201).json(result.movement);
    } catch (err) {
      console.error('Erro ao adicionar estoque:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Remover estoque (venda)
  static async removeStock(req, res) {
    try {
      const { productId, quantity, notes } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: productId, quantity' 
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({ 
          error: 'Quantidade deve ser maior que 0' 
        });
      }

      const result = await Inventory.removeStock(DEFAULT_TENANT_ID, productId, quantity, notes);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.status(201).json(result.movement);
    } catch (err) {
      console.error('Erro ao remover estoque:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar histórico
  static async getHistory(req, res) {
    try {
      const { productId, limit } = req.query;

      const result = await Inventory.getMovementHistory(
        DEFAULT_TENANT_ID, 
        productId || null,
        limit ? parseInt(limit) : 50
      );

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json(result.movements);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar produtos com estoque baixo
  static async getLowStock(req, res) {
    try {
      const result = await Inventory.getLowStockProducts(DEFAULT_TENANT_ID);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json(result.products);
    } catch (err) {
      console.error('Erro ao buscar estoque baixo:', err);
      res.status(500).json({ error: err.message });
    }
  }
}
