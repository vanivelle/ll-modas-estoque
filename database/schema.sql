-- ============================================
-- SCHEMA: Controle de Estoque Universal
-- ============================================

-- Tabela de tenants (clientes)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- HASH em produção!
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos (cada tenant tem seus produtos)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  minimum_quantity INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, barcode)
);

-- Tabela de movimentações de estoque
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL, -- 'entrada' ou 'saida'
  quantity INTEGER NOT NULL,
  notes TEXT,
  before_quantity INTEGER,
  after_quantity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de alertas de estoque baixo
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'low_stock', 'out_of_stock'
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_movements_tenant ON inventory_movements(tenant_id);
CREATE INDEX idx_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_alerts_tenant ON alerts(tenant_id);
CREATE INDEX idx_alerts_unread ON alerts(tenant_id, is_read);

-- Row Level Security (RLS) - Desativado por enquanto
-- Será implementado quando tiver autenticação real
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
