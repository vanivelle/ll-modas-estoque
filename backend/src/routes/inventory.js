import express from 'express';
import { InventoryController } from '../controllers/InventoryController.js';

const router = express.Router();

// Movimentações de estoque
router.post('/add', InventoryController.addStock);       // Entrada
router.post('/remove', InventoryController.removeStock); // Saída (venda)
router.get('/history', InventoryController.getHistory);  // Histórico
router.get('/low-stock', InventoryController.getLowStock); // Estoque baixo

export default router;
