# 📊 ARQUITETURA CRIADA - VISUALIZAÇÃO

## 🗂️ ESTRUTURA DE PASTAS

```
estoque-universal/
│
├── 📂 backend/
│   ├── server.js                 ← Entry point (npm run dev aqui)
│   ├── package.json              ← npm install aqui
│   ├── .env.example              ← Copiar → .env
│   │
│   └── 📂 src/
│       ├── 📂 config/
│       │   └── supabase.js       ← Conexão com Supabase
│       │
│       ├── 📂 models/
│       │   ├── Product.js        ← CRUD de produtos
│       │   └── Inventory.js      ← Entrada/saída de estoque
│       │
│       ├── 📂 controllers/
│       │   ├── ProductController.js
│       │   └── InventoryController.js
│       │
│       └── 📂 routes/
│           ├── products.js       ← GET /api/products
│           └── inventory.js      ← POST /api/inventory/add|remove
│
├── 📂 frontend/
│   ├── package.json              ← npm install aqui
│   ├── .env.local                ← Preencher: TENANT_ID
│   ├── tsconfig.json
│   ├── next.config.js
│   │
│   ├── 📂 app/
│   │   ├── page.tsx              ← Dashboard responsivo (TUDO aqui!)
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   └── 📂 lib/
│       └── api.ts                ← Funções pra chamar backend
│
├── 📂 database/
│   └── schema.sql                ← Colar no Supabase SQL Editor
│
├── README.md                      ← Visão geral
├── SETUP_RAPIDO.md                ← Seu guia (LEIA ISSO AGORA!)
└── .gitignore                     ← (opcional)
```

---

## 🔄 FLUXO DE DADOS

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│             http://localhost:3000                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Dashboard                                            │   │
│  │ ├─ Abas: Dashboard | Entrada | Saída                │   │
│  │ ├─ Produtos list                                    │   │
│  │ └─ Alerta estoque baixo                             │   │
│  └─────────────────────────────────────────────────────┘   │
│            ↓ (HTTP + tenantId header)                        │
├─────────────────────────────────────────────────────────────┤
│                      BACKEND (Express)                       │
│             http://localhost:3000                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ API Endpoints                                       │    │
│  │ ├─ GET  /api/products                             │    │
│  │ ├─ POST /api/products                             │    │
│  │ ├─ POST /api/inventory/add   (entrada)            │    │
│  │ └─ POST /api/inventory/remove (saída)             │    │
│  └────────────────────────────────────────────────────┘    │
│                    ↓ (Multi-tenant)                          │
├─────────────────────────────────────────────────────────────┤
│                   DATABASE (Supabase)                        │
│               PostgreSQL (grátis + RLS)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Tables:                                             │    │
│  │ ├─ tenants             (clientes)                  │    │
│  │ ├─ products            (produtos por tenant)       │    │
│  │ ├─ inventory_movements (histórico entrada/saída)  │    │
│  │ └─ alerts              (estoque baixo)             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 ENDPOINTS DA API

### PRODUTOS

| Método | Endpoint | O quê | Header obrigatório |
|--------|----------|-------|-------------------|
| POST | `/api/products` | Criar produto | `tenantId` |
| GET | `/api/products` | Listar todos | `tenantId` |
| GET | `/api/products/:id` | Buscar um | `tenantId` |
| GET | `/api/products/barcode/:barcode` | Por código | `tenantId` |
| PUT | `/api/products/:id` | Atualizar | `tenantId` |
| DELETE | `/api/products/:id` | Deletar | `tenantId` |

### ESTOQUE

| Método | Endpoint | O quê |
|--------|----------|-------|
| POST | `/api/inventory/add` | Nova entrada |
| POST | `/api/inventory/remove` | Nova saída (venda) |
| GET | `/api/inventory/history` | Histórico |
| GET | `/api/inventory/low-stock` | Produtos com estoque baixo |

> **Header obrigatório em todas:** `tenantId: seu-uuid-aqui`

---

## 🎯 FUNCIONALIDADES DO FRONTEND

### 📊 TAB: Dashboard
```
┌─────────────────────────────────┐
│ 📦 Estoque Universal            │
│ Tenant ID: abc1234...           │
├─────────────────────────────────┤
│ [📊 Dashboard] [📥 Entrada] [📤 Saída]
├─────────────────────────────────┤
│ Total de Produtos: 0            │
│ ⚠️ Estoque Baixo: 0             │
│ Quantidade Total: 0             │
│                                 │
│ [Tabela com todos os produtos]  │
│ [🔄 Recarregar]                 │
└─────────────────────────────────┘
```

### 📥 TAB: Entrada
```
┌─────────────────────────────────┐
│ 📥 Entrada de Mercadoria        │
├─────────────────────────────────┤
│ Produto:    [Dropdown]          │
│ Quantidade: [123]               │
│ Obs:        [Textarea]          │
│                                 │
│ [✅ Confirmar Entrada]          │
└─────────────────────────────────┘
```

### 📤 TAB: Saída
```
┌─────────────────────────────────┐
│ 📤 Saída de Mercadoria (Venda)  │
├─────────────────────────────────┤
│ Produto:    [Dropdown]          │
│ Quantidade: [1]                 │
│ Obs:        [Textarea]          │
│                                 │
│ [📤 Confirmar Saída]            │
└─────────────────────────────────┘
```

---

## ⚙️ REQUISITOS PARA RODAR

```
✅ Node.js 18+ instalado
✅ npm instalado
✅ VS Code aberto
✅ Conta Supabase criada
✅ Projeto Supabase criado
✅ Internet funcionando
✅ 2 terminais (1 backend, 1 frontend)
```

---

## 🚀 AGORA: SIGA O SETUP_RAPIDO.md!

Esse arquivo tem o passo-a-passo EXATO para:
1. ✅ Configurar Supabase
2. ✅ Setup backend 
3. ✅ Setup frontend
4. ✅ Testar tudo
5. ✅ Criar primeiro produto

**Tempo total: ~30 minutos se tudo correr bem**

Bora! 💪
