# 🚀 DEPLOY NO VERCEL - PASSO A PASSO (CORRIGIDO)

## ✨ Arquitetura
```
┌─────────────────────────────────────────┐
│   Vercel Frontend (Next.js)             │
│   - Dashboard (Desktop & Mobile)        │
│   - API Routes (/api/products, etc)     │
└──────────────┬──────────────────────────┘
               │✅ Chamadas API
┌──────────────▼──────────────────────────┐
│   Render.com Backend (Node.js/Express)  │
│   - Port 3000 (API REST)                │
└──────────────┬──────────────────────────┘
               │ Query
┌──────────────▼──────────────────────────┐
│   Supabase Database (PostgreSQL)        │
└─────────────────────────────────────────┘
```

---

## 📋 PASSO 1: Preparar Repositório Local

### 1.1 - Verificar arquivos críticos
```bash
# No PowerShell, na pasta do projeto:
cd c:\Users\guigu\OneDrive\Documentos\web\ll-modas\estoque-universal

# Verfique se os arquivos estão criados:
cat backend\.env.local      # Deve ter SUPABASE_URL e SUPABASE_ANON_KEY
cat frontend\.env.local     # Deve ter NEXT_PUBLIC_API_URL

# Verificar se git está inicializado:
git status
```

### 1.2 - Commit das mudanças
```bash
git add -A
git commit -m "Fix: Corrigir rota products e configurar API proxy"
git push origin main
```

---

## 🎯 PASSO 2: Deploy Frontend no Vercel

### 2.1 - Acesse Vercel
- Vá para: https://vercel.com
- Clique **"Sign Up"** se for primeira vez
- Use sua conta GitHub

### 2.2 - Importe o repositório
- Clique **"Add New..."** → **"Project"**
- Procure pelo repositório (ex: `ll-modas-estoque`)
- Clique **"Import"**

### 2.3 - Configure o projeto
Vercel pode detectar automaticamente o Next.js, mas certifique-se:

- **Framework**: Next.js ✅
- **Root Directory**: `frontend/` ✅
- **Build Command**: `npm run build` ✅
- **Install Command**: `npm install` ✅

### 2.4 - Adicione variáveis de ambiente
Clique em **"Environment Variables"** e adicione:

```
NEXT_PUBLIC_API_URL = https://seu-backend-render.com
```

**Deixar em branco por enquanto** se ainda não tem backend deployado.

### 2.5 - Deploy
- Clique **"Deploy"**
- Aguarde ~5 minutos
- Você receberá uma URL: `https://seu-projeto.vercel.app`

---

## 🔧 PASSO 3: Deploy Backend no Render.com

### 3.1 - Acesse Render
- Vá para: https://render.com
- Clique **"Sign Up"** e use sua conta GitHub
- Conecte seu GitHub

### 3.2 - Crie novo Web Service
- Clique **"New"** → **"Web Service"**
- Selecione seu repositório GitHub
- Clique **"Connect"**

### 3.3 - Configure o serviço
Na tela de configuração, preencha:

```
Name:                  ll-modas-api
Environment:           Node
Build Command:         cd backend && npm install
Start Command:         cd backend && node server.js
```

### 3.4 - Adicione variáveis de ambiente
Clique em **"Environment"** e adicione:

```
SUPABASE_URL = [Sua URL do Supabase]
SUPABASE_ANON_KEY = [Sua chave anon do Supabase]
PORT = 10000
NODE_ENV = production
```

⚠️ **NUNCA commite credenciais no Git!** Use variáveis de ambiente no Render.

⚠️ **Não deixe PORT vazio!** Render atribui dinamicamente em `onrender.com`

### 3.5 - Deploy
- Clique **"Create Web Service"**
- Render fará o deploy automaticamente
- Você receberá uma URL: `https://seu-projeto.onrender.com`
- ✅ A API estará em: `https://seu-projeto.onrender.com/api/products`

---

## 🔗 PASSO 4: Conectar Frontend ao Backend

### 4.1 - Atualize a variável Vercel
- Entre no Vercel → Seu projeto → **"Settings"** → **"Environment Variables"**
- Edite `NEXT_PUBLIC_API_URL`:

```
NEXT_PUBLIC_API_URL = https://seu-projeto.onrender.com
```

### 4.2 - Redeploy frontend
- Clique **"Deployments"** → Último deploy
- Clique **"Redeploy"**

### 4.3 - Teste no browser
```
1. Acesse: https://seu-projeto.vercel.app
2. Abra Developer Tools (F12) → Console
3. Faça uma ação (criar produto, etc)
4. Verifique Network tab se está chamando:
   https://seu-projeto.onrender.com/api/products
```

---

## ✅ Checklist de Verificação

- [ ] Repositório no GitHub com git push
- [ ] Frontend deployado no Vercel
- [ ] Backend deployado no Render.com
- [ ] Variáveis ambiente configuradas em ambos
- [ ] `NEXT_PUBLIC_API_URL` apontando para Render
- [ ] API routes funcionando (`/api/products`, `/api/inventory`)
- [ ] Teste criar produto no browser
- [ ] Verificar console para erros

---

## 🐛 Troubleshooting

### Erro 500 no Vercel
```
❌ Error: Erro conectando ao backend
```
**Solução:** Verificar se URL no NEXT_PUBLIC_API_URL está correta
```bash
# Testar via terminal:
curl https://seu-projeto.onrender.com/health
```

### Backend não inicia
```
❌ ERRO: Variáveis SUPABASE_URL e SUPABASE_ANON_KEY não configuradas!
```
**Solução:** Adicionar variáveis em Render → Environment Variables

### CORS error
```
❌ Access to XMLHttpRequest has been blocked by CORS policy
```
**Solução:** Backend já tem `cors()` habilitado, certificar que está rodando

### Renderizar freezou no cold start
```
❌ Site lento na primeira requisição
```
**Solução:** Normal no Render gratuito, aguarde 30s para wake up

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Environment Variables**: https://render.com/docs/configure-environment-variables
```

#### 4.4 - Deploy
- Clique **"Create Web Service"**
- Aguarde ~5 minutos
- Copie a URL do serviço (ex: `https://ll-modas-api.onrender.com`)

### Opção B: Railway.app (Alternativa)
- https://railway.app
- Mais simples mas com limite menor

### Opção C: Fly.io (Alternativa)
- https://fly.io
- Melhor performance, 3 apps gratuitos

---

## 🔗 PASSO 5: Conectar Frontend → Backend

### 5.1 - Atualize NEXT_PUBLIC_API_URL no Vercel
1. Vá para seu projeto no Vercel
2. Clique **"Settings"** → **"Environment Variables"**
3. Edite `NEXT_PUBLIC_API_URL`:
   ```
   Valor anterior: http://localhost:3002
   Novo valor: https://ll-modas-api.onrender.com
   ```
4. Clique **"Save"**
5. Redeploy: Clique **"Deployments"** → último → **"Redeploy"**

---

## ✅ CHECKLIST FINAL

### Antes do Deploy
- [ ] Todos os arquivos no Git
- [ ] Repositório GitHub criado
- [ ] Git push feito com sucesso

### Frontend (Vercel)
- [ ] Projeto criado no Vercel
- [ ] Root Directory: `frontend/`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] URL funciona (teste https://seu-vercel-url.vercel.app)

### Backend (Render/Railway/Fly)
- [ ] Serviço criado
- [ ] Variáveis Supabase configuradas
- [ ] Deploy bem-sucedido
- [ ] Health check funciona (GET /health)

### Integração
- [ ] Frontend conecta ao backend
- [ ] Scanner funciona
- [ ] APIs respondem corretamente

---

## 🧪 TESTES PÓS-DEPLOY

### Local (Desenvolvimento)
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Deve estar em http://localhost:3002

# Terminal 2 - Frontend
cd frontend
npm run dev
# Deve estar em http://localhost:3000
```

### Tempo Real
```bash
# Teste o backend
curl https://seu-backend.onrender.com/health

# Teste o frontend
Abra https://seu-frontend.vercel.app no navegador
```

---

## 🆘 TROUBLESHOOTING

### "Frontend diz que API não funciona"
- Verifique se NEXT_PUBLIC_API_URL está correto no Vercel
- Redeploy do frontend após mudança
- Aguarde ~5 minutos para propagação DNS

### "Backend retorna 500"
- Verifique variáveis de ambiente (SUPABASE_URL, SUPABASE_ANON_KEY)
- Cheque logs no Render/Railway
- Teste /health endpoint

### "Build falha no Vercel"
- Verifique se o root directory é `frontend/`
- Cheque se package.json do frontend existe
- Veja logs no Vercel

---

## 📞 Próximos Passos

1. **Banco de Dados**: Supabase já configurado ✅
2. **Domínio**: Comprar domínio e apontar DNS
3. **SSL**: Automático no Vercel e Render ✅
4. **Auto-deploy**: Git push → Deploy automático ✅

---

## 🎯 RESUMO RÁPIDO

```bash
# 1. Criar repo GitHub
https://github.com/new

# 2. Push local repo
cd c:\Users\guigu\OneDrive\Documentos\web\ll-modas\estoque-universal
git remote add origin https://github.com/SEU_USERNAME/ll-modas-estoque.git
git branch -M main
git push -u origin main

# 3. Deploy Frontend
Vercel + GitHub (import repo, root: frontend/)

# 4. Deploy Backend
Render.com + GitHub (nova web service)

# 5. Conectar Frontend → Backend
Atualizar NEXT_PUBLIC_API_URL no Vercel
```

---

**Qualquer dúvida, me avisa!** 🚀
