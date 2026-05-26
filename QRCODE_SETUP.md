# 🔲 Sistema de QR Code - Instruções de Instalação

## 📦 Dependência Necessária

O sistema usa a biblioteca `qrcode` para gerar QR Codes. Você precisa instalar no backend:

### Instalação (Backend)

```bash
cd backend
npm install qrcode
npm install --save-dev @types/qrcode
```

Isso adicionará ao seu `package.json`:
```json
{
  "dependencies": {
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.0"
  }
}
```

---

## 🚀 Como Usar

### 1. Gerar QR Code (Admin)

1. Faça login como administrador
2. Vá para **Gestão do Estabelecimento** → Aba **"QR Code"**
3. Clique em **"Gerenciar QR Code"**
4. Na página de QR Code, clique em **"Gerar QR Code"**
5. Um QR Code será gerado com a URL do cardápio público
6. Baixe a imagem em PNG
7. Imprima e cole nas mesas, balcão ou entrada do estabelecimento

### 2. Cliente Escaneia QR Code

1. Cliente aponta a câmera do celular para o QR Code
2. Toca no link que aparece na notificação
3. Acessa automaticamente o cardápio público (sem login)
4. Pode ver todos os itens do cardápio com imagens
5. Pode adicionar itens ao carrinho (para integração futura com pedidos)

### 3. Acessar Cardápio Diretamente

URL pública:
```
http://localhost:5173/cardapio/{ESTABELECIMENTO_ID}
```

Onde `{ESTABELECIMENTO_ID}` é o ID do estabelecimento (UUID)

---

## 📋 Rotas da API

### Cardápio Público (SEM autenticação)
```
GET /api/public/cardapio/:estabelecimentoId
Retorna: { estabelecimento, categorias com itens }
```

### QR Code (SEM autenticação)
```
GET /api/public/qrcode/:estabelecimentoId
Retorna: { qrCode: "data:image/png;base64,...", cardapioUrl: "http://..." }
```

### Download QR Code (SEM autenticação)
```
GET /api/public/qrcode/:estabelecimentoId/download
Retorna: PNG file para download
```

---

## 🧪 Teste Rápido

### Pré-requisitos:
- ✅ Backend rodando em http://localhost:3333
- ✅ Frontend rodando em http://localhost:5173
- ✅ Categorias criadas
- ✅ Items criados com imagens

### Passos:

1. **Terminal 1 - Backend:**
```bash
cd backend
npm install qrcode @types/qrcode
npm run dev
```

2. **Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

3. **Abra o navegador:**
   - http://localhost:5173 (Login)
   - Crie uma categoria
   - Crie um item com imagem
   - Vá em Registro → QR Code → Gerenciar QR Code
   - Clique em "Gerar QR Code"

4. **Teste no celular:**
   - Copie a URL que aparece
   - Abra no navegador do celular
   - Veja o cardápio responsivo

5. **Teste o QR Code:**
   - Baixe a imagem do QR Code
   - Abra em um editor de imagem (ou tire print)
   - Use o seu celular para escanear
   - Deve abrir o cardápio automaticamente

---

## 🎨 Páginas Criadas

### **PublicMenu.tsx** (/cardapio/:estabelecimentoId)
- Página pública do cardápio
- SEM autenticação necessária
- Design responsivo (mobile-friendly)
- Dark theme
- Carrinho flutuante com contador
- Exibe categorias e items com imagens

### **QRCodeManager.tsx** (/dashboard/qrcode)
- Gerenciamento do QR Code (autenticado)
- Gera QR Code em tempo real
- Preview em tempo real
- Download em PNG
- Copia URL para clipboard
- Link de preview no celular

---

## 🔗 Integração com Sistema

### Fluxo:
```
Admin cria Categoria
    ↓
Admin cria Item com imagem (Cloudinary)
    ↓
Admin gera QR Code
    ↓
QR Code aponta para /cardapio/{estabelecimentoId}
    ↓
Cliente escaneia ou acessa URL
    ↓
Cliente vê cardápio público sem login
    ↓
Cliente adiciona items ao carrinho (preparado para próximas etapas)
```

---

## 📱 Layout Responsivo

- **Desktop**: Grid 3 colunas
- **Tablet**: Grid 2 colunas  
- **Mobile**: Grid 1 coluna
- **Carrinho**: Flutuante no rodapé

---

## ⚙️ Variáveis de Ambiente

No `.env` do backend, adicione (já adicionada):
```
FRONTEND_URL=http://localhost:5173
```

Isso é usado para gerar o link correto no QR Code.

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'qrcode'"
- Solução: `npm install qrcode @types/qrcode`

### QR Code não funciona
- Verifique se o `FRONTEND_URL` está correto no `.env`
- Teste a URL manualmente no navegador

### Imagens não aparecem no cardápio público
- Verifique se o Cloudinary está configurado
- Teste a URL da imagem no navegador

### Mobile não acessa o link
- Certifique-se de usar `http://localhost:5173` se estiver localmente
- Para testar em rede local, use o IP da máquina: `http://192.168.x.x:5173`

---

## 📚 Próximos Passos

1. Integrar com sistema de pedidos
2. Adicionar checkout do carrinho
3. Enviar pedido para a cozinha
4. Rastrear status do pedido
5. Histórico de pedidos

---

*Implementado em: Maio 2026*
