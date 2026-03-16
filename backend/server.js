import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './src/routes/products.js';
import inventoryRoutes from './src/routes/inventory.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Backend está funcionando!',
    timestamp: new Date()
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro no servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ BACKEND FUNCIONANDO!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/health\n`);
});
