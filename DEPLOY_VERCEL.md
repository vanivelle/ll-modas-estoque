# 🚀 DEPLOY NO VERCEL - PASSO A PASSO

## ✨ Status Atual
- ✅ Repositório Git criado localmente
- ✅ Todos os arquivos commitados
- ⏭️ Próximo: GitHub + Vercel

---

## 📋 PASSO 1: Criar Repositório no GitHub

### 1.1 - Acesse GitHub
- Vá para: https://github.com/new
- Faça login (crie conta se não tiver)

### 1.2 - Crie o repositório
- **Repository name**: `ll-modas-estoque`
- **Description**: Estoque Universal - Desktop & Mobile com Scanner USB
- **Visibility**: Public (ou Private se preferir)
- **NÃO** marque "Initialize with README"
- Clique **"Create repository"**

### 1.3 - Copie o código que aparecerá
Será algo como:
```bash
git remote add origin https://github.com/SEU_USERNAME/ll-modas-estoque.git
git branch -M main
git push -u origin main
```

---

## 💻 PASSO 2: Conectar Repositório Local ao GitHub

No PowerShell, execute os 3 comandos acima que você copiou:

```powershell
cd c:\Users\guigu\OneDrive\Documentos\web\ll-modas\estoque-universal

git remote add origin https://github.com/SEU_USERNAME/ll-modas-estoque.git
git branch -M main
git push -u origin main
```

**Será pedido seu GitHub username e password (ou token)**

---

## 🎯 PASSO 3: Deploy no Vercel (Frontend)

### 3.1 - Acesse Vercel
- Vá para: https://vercel.com
- Clique **"Sign Up"** e use sua conta GitHub (mais fácil)

### 3.2 - Crie novo projeto
- Clique **"Add New Project"**
- Procure pelo repositório "ll-modas-estoque"
- Clique **"Import"**

### 3.3 - Configure Project Settings
- **Framework Preset**: Next.js ✅
- **Root Directory**: `frontend/` (IMPORTANTE!)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables** - Adicione:
  ```
  NEXT_PUBLIC_API_URL=https://seu-backend-dominio.com
  ```
  (Por enquanto use: `http://localhost:3002` ou deixe em branco)

### 3.4 - Deploy
- Clique **"Deploy"**
- Aguarde ~3 minutos
- Pronto! URL gerada automaticamente

---

## 🔧 PASSO 4: Deploy do Backend (Node/Express)

### Opção A: Render.com (Recomendado - Gratuito até 750h/mês)

#### 4.1 - Acesse Render
- Vá para: https://render.com
- Clique **"Sign Up"** e use GitHub

#### 4.2 - Crie novo serviço
- Clique **"New +"** → **"Web Service"**
- Selecione seu repositório GitHub
- Configure:
  - **Name**: `ll-modas-api`
  - **Environment**: `Node`
  - **Build Command**: `cd backend && npm install`
  - **Start Command**: `cd backend && npm start`

#### 4.3 - Adicione Variáveis de Ambiente
```
SUPABASE_URL=https://xnqiicsiuyokexrwtrrg.supabase.co
SUPABASE_ANON_KEY=sb_publishable_O00ynoOgW3_TMXBhx9VfMA_RDCQEL8r
PORT=3000
NODE_ENV=production
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
