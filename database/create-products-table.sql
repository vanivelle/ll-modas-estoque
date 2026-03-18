-- Criar tabela products no Supabase
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  barcode TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2),
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para barcode
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy para SELECT (público)
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

-- Policy para INSERT (público)
CREATE POLICY "Enable insert access for all users" ON products
  FOR INSERT WITH CHECK (true);

-- Policy para UPDATE (público)
CREATE POLICY "Enable update access for all users" ON products
  FOR UPDATE USING (true) WITH CHECK (true);

-- Verificar
SELECT * FROM products LIMIT 1;
