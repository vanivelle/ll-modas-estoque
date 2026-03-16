# 📦 ESTOQUE UNIVERSAL - Multi-Tenant

Controle de estoque universal adaptável para qualquer negócio (roupas, restaurante, etc).

## 🚀 QUICK START

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

**Preencha o `.env`:**
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anon
PORT=3000
```

### 2. Setup Database (Supabase)

1. Vá em **supabase.com**
2. Crie novo projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de `database/schema.sql`
5. Execute

### 3. Criar Tenant (Cliente)

Via query SQL no Supabase:
```sql
INSERT INTO tenants (name, email, password, phone)
VALUES ('L&L Modas', 'lazaro@email.com', '123456', '(61) 99911-2886');
```

Depos copie o `id` do tenant (vai ser o tenantId).

### 4. Rodar Backend

```bash
npm run dev
# ✅ Servidor rodando em http://localhost:3000
```

### 5. Testar API

```bash
# Health check
curl http://localhost:3000/health

# Criar produto (substitua o tenantId)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "tenantId: seu-tenant-id-aqui" \
  -d '{
    "name": "Bermuda Jeans",
    "sku": "BERM001",
    "barcode": "7894567890123",
    "price": 65.00,
    "minimum_quantity": 5
  }'
```

---

## 📚 API ENDPOINTS

### PRODUTOS

#### Criar produto
```
POST /api/products
Headers: tenantId
Body: { name, sku, barcode, price, minimum_quantity }
```

#### Listar produtos
```
GET /api/products
Headers: tenantId
```

#### Buscar por ID
```
GET /api/products/:id
Headers: tenantId
```

#### Buscar por código de barras
```
GET /api/products/barcode/:barcode
Headers: tenantId
```

#### Atualizar
```
PUT /api/products/:id
Headers: tenantId
Body: { campos a atualizar }
```

#### Deletar
```
DELETE /api/products/:id
Headers: tenantId
```

### ESTOQUE

#### Entrada (recebimento)
```
POST /api/inventory/add
Headers: tenantId
Body: { productId, quantity, notes }
```

#### Saída (venda)
```
POST /api/inventory/remove
Headers: tenantId
Body: { productId, quantity, notes }
```

#### Histórico de movimentações
```
GET /api/inventory/history?productId=xxx&limit=50
Headers: tenantId
```

#### Produtos com estoque baixo
```
GET /api/inventory/low-stock
Headers: tenantId
```

---

## 🏗️ ESTRUTURA

```
backend/
├── server.js                 # Entry point
├── package.json
├── .env.example
└── src/
    ├── config/
    │   └── supabase.js       # Conexão com Supabase
    ├── models/
    │   ├── Product.js        # Lógica de produtos
    │   └── Inventory.js      # Lógica de estoque
    ├── controllers/
    │   ├── ProductController.js
    │   └── InventoryController.js
    └── routes/
        ├── products.js
        └── inventory.js

database/
└── schema.sql                # Schema do banco

frontend/
└── (Em breve - Next.js + React)
```

---

## 🔑 Variáveis de Ambiente

```env
SUPABASE_URL           # URL do seu projeto Supabase
SUPABASE_ANON_KEY      # Chave anonima do Supabase
PORT                   # Porta (default: 3000)
NODE_ENV               # development/production
```

---

## 🎯 PRÓXIMOS PASSOS

- [ ] Frontend com Next.js
- [ ] Dashboard com gráficos
- [ ] Alertas por email
- [ ] Relatórios PDF
- [ ] Integração com bot de leads

---

## 💪 DESENVOLVIDO PARA

**L&L Modas** - Controle de estoque de roupas (16/03/2026)

Use, fork, customize! 🚀
