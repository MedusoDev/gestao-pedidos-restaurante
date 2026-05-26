# 📋 Implementação do Cardápio com Cloudinary

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Página Register Expandida** 
📁 Arquivo: `frontend/src/app/pages/Register/index.tsx`

#### Novas Tabs adicionadas:
- **Categorias**: Criar categorias do cardápio (Ex: Frios, Churrasco, Bebidas)
- **Items do Cardápio**: Criar itens com nome, descrição, preço e **upload de imagem**

#### Formulários implementados com validação Zod:
```typescript
// Categoria
- nome (string, mín. 3 caracteres)
- ordemExibicao (número, padrão: 0)

// Item do Cardápio
- categoriaId (obrigatório)
- nome (string, mín. 3 caracteres)
- descricao (opcional)
- preco (formato: XX.XX)
- imagem (arquivo: JPG, PNG, WEBP, máx. 5MB)
```

#### Features:
- Preview da imagem antes de enviar
- Carregamento automático de categorias cadastradas
- Notificações de sucesso/erro
- Integração automática com Cloudinary

---

### 2. **Página Menu Completa**
📁 Arquivo: `frontend/src/app/pages/Menu.tsx`

#### O que exibe:
- ✅ Todas as categorias do cardápio
- ✅ Itens agrupados por categoria
- ✅ Imagem do item (do Cloudinary)
- ✅ Nome, descrição e preço
- ✅ Status de disponibilidade
- ✅ Botão "Adicionar" (base para próximas features)

#### Design:
- Grid responsivo (1 coluna mobile, 2 tablets, 3 desktop)
- Cards com hover effects
- Exibição organizada por categorias

---

## 🏗️ ESTRUTURA DO BANCO DE DADOS

### Modelo: Categoria
```prisma
model Categoria {
  id                String           @id @default(uuid())
  nome              String
  ordemExibicao     Int              @default(0)
  
  estabelecimentoId String           @db.Uuid
  estabelecimento   Estabelecimento  @relation(...)
  
  itens             ItemCardapio[]   // Relacionamento com itens
}
```

### Modelo: ItemCardapio
```prisma
model ItemCardapio {
  id           String       @id @default(uuid())
  nome         String
  descricao    String?
  preco        Decimal      @db.Decimal(10, 2)
  fotoUrl      String?      // URL do Cloudinary
  disponivel   Boolean      @default(true)
  
  categoriaId  String       @db.Uuid
  categoria    Categoria    @relation(...)
}
```

---

## 🚀 ROTAS DA API

### Categorias
```
POST   /api/categorias          - Criar categoria
GET    /api/categorias          - Listar categorias
PUT    /api/categorias/:id      - Editar categoria
DELETE /api/categorias/:id      - Deletar categoria
```

### Items do Cardápio
```
POST   /api/itens               - Criar item (com upload de imagem)
GET    /api/itens               - Listar itens
GET    /api/itens?categoriaId=  - Filtrar por categoria
PUT    /api/itens/:id           - Editar item (com upload de imagem)
DELETE /api/itens/:id           - Deletar item
PATCH  /api/itens/:id/disponivel - Alternar disponibilidade
```

---

## 📸 COMO USAR

### 1. Criar uma Categoria

1. Vá para **Gestão do Estabelecimento**
2. Abra a aba **Categorias**
3. Preencha o nome (ex: "Frios")
4. Defina a ordem de exibição (ex: 1)
5. Clique em **Criar categoria**

### 2. Criar um Item do Cardápio

1. Vá para **Gestão do Estabelecimento**
2. Abra a aba **Items do Cardápio**
3. Preencha o formulário:
   - **Categoria**: Selecione uma categoria existente
   - **Nome**: Ex: "Filé Mignon Grelhado"
   - **Descrição**: Ex: "Filé de primeira qualidade com acompanhamentos"
   - **Preço**: Ex: "45.90"
   - **Imagem**: Selecione uma imagem (JPG, PNG ou WEBP)
4. Veja o preview da imagem
5. Clique em **Criar item**

> ℹ️ **A imagem será automaticamente enviada para o Cloudinary**

### 3. Visualizar o Cardápio

1. Vá para **Menu**
2. Veja todas as categorias organizadas
3. Cada categoria mostra seus itens com imagens

---

## 🔧 TECNOLOGIAS UTILIZADAS

### Frontend
- **React** com TypeScript
- **React Hook Form** para validação de formulários
- **Zod** para schemas de validação
- **Tailwind CSS** para styling
- **Radix UI** para componentes

### Backend
- **Node.js** com Express
- **Prisma** como ORM
- **Cloudinary** para armazenamento de imagens
- **Multer** para upload de arquivos

---

## 📋 CHECKLIST DE FEATURES

- ✅ Criação de Categorias
- ✅ Listagem de Categorias
- ✅ Criação de Items com Upload de Imagem
- ✅ Listagem de Items por Categoria
- ✅ Edição de Items (backend pronto)
- ✅ Alternar Disponibilidade (backend pronto)
- ✅ Integração com Cloudinary
- ✅ Página de Visualização do Cardápio
- 🔄 Editar/deletar categorias (UI em Register)
- 🔄 Editar/deletar items (UI a implementar)

---

## 🐛 TROUBLESHOOTING

### Erro: "Categoria não encontrada"
- Certifique-se de que a categoria pertence ao seu estabelecimento
- Crie uma categoria antes de adicionar itens

### Erro: "Apenas imagens JPG, PNG ou WEBP são permitidas"
- Verifique o tipo de arquivo
- Tamanho máximo: 5MB

### Imagem não aparece no Menu
- Verifique se o upload para Cloudinary foi bem-sucedido
- Teste o fotoUrl diretamente no navegador

---

## 📞 PRÓXIMOS PASSOS (Recomendações)

1. Implementar edição de items com nova imagem
2. Implementar exclusão de categories/items
3. Adicionar búsqueda/filtro no Menu
4. Integrar com sistema de pedidos
5. Adicionar adições/complementos aos items
6. Histórico de preços

---

*Implementado em: Maio 2026*
