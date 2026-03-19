# 📖 MANUAL DE USO - LL MODAS ESTOQUE

## 🚀 COMEÇANDO

**URL:** https://frontend-murex-eta-70.vercel.app

### Abas Disponíveis:
1. **📊 Dashboard** - Visão geral do estoque
2. **➕ Entrada** - Adicionar produtos ao estoque
3. **🛒 Saída** - Vender/remover produtos
4. **📦 Estoque** - Consultar produtos disponíveis
5. **📈 Relatórios** - Análise de movimentações

---

## 📥 **ENTRADA (Receber Estoque)**

### Como adicionar produtos:

1. Click na aba **"Entrada"**
2. Selecione produto no dropdown OU digitando nome
3. Preencha:
   - **Preço Unitário** (ex: 50.00)
   - **Quantidade** (ex: 10)
   - **Nota Fiscal** (opcional)
4. Click em **"✅ Confirmar Entrada"**
5. Um comprovante aparecerá - click **"🖨️ Imprimir"** se quiser

### Usando Scanner:
- Se tiver scanner USB: Aponta → digita quantidade → confirma
- Se tiver webcam: Click "📸 Escanear" → aponta para código → confirma

---

## 🛒 **SAÍDA (Vender Produtos)**

### Como vender:

1. Click na aba **"Saída"**
2. Selecione produto no dropdown
   - Sistema mostra: código, preço, estoque disponível
3. Digite **Quantidade** a vender (ex: 3)
4. Sistema calcula total automaticamente
5. Click em **"🛒 Confirmar Venda"**
6. Comprovante imprime com valor total

---

## 📦 **ESTOQUE (Consultar)**

### Ver tudo que tem:

1. Click na aba **"Estoque"**
2. Ver tabela com:
   - Produto
   - Código de barras
   - Preço
   - Quantidade disponível
   - Status (OK / Baixo / Sem estoque)

### Filtrar:
- Search box no topo para buscar por nome
- Buttons para filtrar por status

---

## 📊 **RELATÓRIOS**

Acesse a aba **"Relatórios"** para ver:
- Total de produtos em estoque
- Valor total do estoque
- Quantidade total
- Produtos mais caros
- Produtos com baixo estoque

---

## 🖨️ **IMPRESSÃO**

### Caracteres especiais:
- ✅ = Confirmado
- ❌ = Erro
- 📱 = Scanner
- 🛒 = Venda
- 📦 = Produto

### Tamanho padrão:
Comprovantes vêm com formato **58mm** (padrão de bobina térmica)

Se usar impressora A4 comum: vai redimensionar automaticamente

---

## ⚠️ **DÚVIDAS FREQUENTES**

**P: Perdi o comprovante, como reimprimo?**
R: Acesse a aba Relatórios → clique no produto → print novamente

**P: Preciso alterar preço de um produto?**
R: Delete via Estoque → re-adicione com preço novo

**P: Dá para usar scanner de celular?**
R: Click "📸 Escanear" → use câmera do computador

**P: Dá para acessar de celular?**
R: Sim! Acesse a URL no navegador. Interface é mobile-friendly.

---

## 🔧 **CONTATO TÉCNICO**

Sistema desenvolvido com:
- **Frontend:** Next.js 14
- **BD:** Supabase (PostgreSQL)
- **Hospedagem:** Vercel

Para bugs ou ajustes: contate o desenvolvedor

---

**Última atualização:** Março 2026
