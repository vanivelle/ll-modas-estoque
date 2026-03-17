import express from 'express';
import { ProductController } from '../controllers/ProductController.js';

const router = express.Router();

// CRUD de produtos
router.post('/', ProductController.create);                           // Criar
router.get('/', ProductController.getAll);                            // Listar todos
router.get('/barcode/:barcode', ProductController.getByBarcode);      // Buscar por barcode (ANTES de /:id!)
router.get('/:id', ProductController.getById);                        // Buscar um
router.put('/:id', ProductController.update);                         // Atualizar
router.delete('/:id', ProductController.delete);                      // Deletar

export default router;
