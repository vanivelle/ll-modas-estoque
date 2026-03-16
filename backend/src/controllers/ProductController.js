import { Product } from '../models/Product.js';

const DEFAULT_TENANT_ID = '6ef5702d-0e8d-4a17-b1fd-73352c9e849d'; // L&L Modas

export class ProductController {
  // Criar produto
  static async create(req, res) {
    try {
      const { name, sku, barcode, price, minimum_quantity } = req.body;

      if (!name || !price) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: name, price' 
        });
      }

      const result = await Product.create(DEFAULT_TENANT_ID, {
        name,
        sku: sku || '',
        barcode: barcode || '',
        price,
        minimum_quantity: minimum_quantity || 5
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.status(201).json(result.product);
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar todos os produtos
  static async getAll(req, res) {
    try {
      const result = await Product.getAll(DEFAULT_TENANT_ID);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json(result.products);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar um produto
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const result = await Product.getById(DEFAULT_TENANT_ID, id);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json(result.product);
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar por código de barras
  static async getByBarcode(req, res) {
    try {
      const { barcode } = req.params;

      const result = await Product.getByBarcode(DEFAULT_TENANT_ID, barcode);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json(result.product);
    } catch (err) {
      console.error('Erro ao buscar por barcode:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Atualizar produto
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const result = await Product.update(DEFAULT_TENANT_ID, id, updates);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json(result.product);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Deletar produto
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await Product.delete(DEFAULT_TENANT_ID, id);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      res.status(500).json({ error: err.message });
    }
  }
}
