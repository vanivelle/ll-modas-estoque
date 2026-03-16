# 🚀 SETUP RÁPIDO - ESTOQUE UNIVERSAL

## ⚡ DIA 1 (HOJE - SEGUNDA 16/03)

### PASSO 1: Clonar o repositório local

```bash
# Você já tem em:
cd c:\Users\guigu\OneDrive\Documentos\web\ll-modas\estoque-universal
```

### PASSO 2: Configurar Supabase

1. **Acessar Supabase:**
   - Vá em https://supabase.com/
   - Login com sua conta
   - Crie novo projeto (1min)

2. **Executar Script SQL:**
   - No Supabase, vá em **SQL Editor**
   - Cole o conteúdo de `database/schema.sql`
   - Clique **RUN**
   - Wait para criar (pode dar erro na parte de RLS, ignora por enquanto)

3. **Copiar credenciais:**
   - Vá em **Project Settings** → **API**
   - Copie:
     - **Project URL** → SUPABASE_URL
     - **anon public key** → SUPABASE_ANON_KEY

4. **Criar um Tenant (Cliente):**
   - Vá em **SQL Editor**
   - Execute:
   ```sql
   INSERT INTO tenants (name, email, password, phone)
   VALUES ('L&L Modas', 'lazaro@email.com', '123456', '(61) 99911-2886')
   RETURNING id;
   ```
   - Copie o `id` que apareceu (vai ser seu tenantId)

### PASSO 3: Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
# Abra .env.example, copie e renomeie pra .env
# Preencha com suas credenciais:

SUPABASE_URL=sua_url_aqui
SUPABASE_ANON_KEY=sua_chave_aqui
PORT=3000
NODE_ENV=development

# Testar se funciona
npm run dev

# Se aparecer "✅ Servidor rodando em http://localhost:3000" = OK!
```

### PASSO 4: Configurar Frontend

```bash
# Em outro terminal
cd frontend

# Instalar dependências
npm install

# Configurar .env.local
# Copie o conteúdo e preencha:

NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_TENANT_ID=seu-tenant-id-aqui

# Substituir "seu-tenant-id-aqui" pelo ID que você copiou acima!

# Rodar
npm run dev

# Se aparece "✔ Ready in XXms" = OK!
```

### PASSO 5: Testar tudo

1. **Abrir no browser:**
   ```
   http://localhost:3000
   ```

2. **Você deve ver:**
   - Página de estoque
   - 3 abas: Dashboard | Entrada | Saída
   - Aviso vermelho "Nenhum produto cadastrado"

3. **Testar API (via curl ou Postman):**

```bash
# Criar um produto de teste
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "tenantId: seu-tenant-id-aqui" \
  -d '{
    "name": "Bermuda Jeans",
    "sku": "BERM001",
    "barcode": "7890123456789",
    "price": 65.00,
    "minimum_quantity": 5
  }'

# Você deve receber um JSON com o produto criado
```

---

## ✅ CHECKLIST DE HOJE

- [ ] Supabase projeto criado
- [ ] SQL schema executado
- [ ] Tenant criado + ID copiado
- [ ] Backend rodar sem erro (nm run dev)
- [ ] Frontend rodar sem erro (npm run dev)
- [ ] Acessar http://localhost:3000 no browser
- [ ] Criar produto de teste via API ou frontend

---

## 🎯 META DE HOJE

**Ter estoque funcionando LOCALMENTE (semiFuncional em uma máquina)**

**Não precisa:**
- Integração com bot de leads
- Deploy em produção
- Relatórios PDF
- Emails automáticos

**Apenas:**
- ✅ Criar, listar, entrar e sair
- ✅ Dashboard mostrando produtos
- ✅ Alertas de estoque baixo

---

## 🆘 PROBLEMAS COMUNS

### "npm install não funciona"
```bash
# Tenta:
npm cache clean --force
npm install
```

### "Erro ao conectar Supabase"
- Verifica se copiou certinho o URL e a chave
- Verifica se o projeto Supabase está rodando (não pausado)

### "Porto 3000 ocupado"
```bash
# Backend em outra porta:
PORT=3001 npm run dev
```

### "Tenant ID inválido"
- Abre SQL do Supabase
- SELECT * FROM tenants;
- Copia o UUID que aparecer
- Cola em .env.local

---

## 📞 PRÓXIMO PASSO

Amanhã (terça) você:
1. Tira prints funcionando
2. Mostra pro Lázaro
3. A gente começa leads page

**Bora! 💪**
