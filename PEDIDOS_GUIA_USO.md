# 📋 Aba de Pedidos - Guia de Uso

## 🎯 O que é a Aba de Pedidos?

A aba de **Pedidos** é o painel central para **criar** e **acompanhar** todos os pedidos do seu restaurante. É onde admin, gerentes e garçons podem gerir o fluxo de pedidos de forma completa.

---

## 📍 Como Acessar

1. Faça login no sistema
2. Clique em **"Pedidos"** no menu esquerdo (ícone de carrinho de compras 🛒)
3. Você será levado para a página de pedidos

---

## 🆕 Criando um Novo Pedido

### Passo 1: Clique em "Novo Pedido"
O botão **"Novo Pedido"** fica no canto superior direito da página.

### Passo 2: Escolha o Tipo
Selecione entre:
- **Mesa** - Para pedidos consumidos no restaurante
- **Delivery** - Para pedidos entregues em domicílio

### Passo 3: Preencha os Dados

#### Se escolher MESA:
1. Selecione qual mesa o cliente está usando
2. Prossiga para adicionar itens

#### Se escolher DELIVERY:
1. Preencha **Nome do Cliente**
2. Preencha **Telefone**
3. Preencha **Endereço de Entrega**
4. Preencha **Taxa de Entrega** (em R$)
5. Prossiga para adicionar itens

### Passo 4: Adicione Itens
1. Selecione um **item do cardápio**
2. Define a **quantidade**
3. Adicione **observações** (opcional) - ex: "Sem cebola", "Bem passado"
4. Clique em **"Adicionar Item"**
5. Repita para mais itens

### Passo 5: Revise e Confirme
1. Visualize todos os itens adicionados
2. Verifique o **total** (subtotal + taxa se delivery)
3. Clique em **"Criar Pedido"**

✅ **Pedido criado com sucesso!**

---

## 📊 Acompanhando Pedidos

### Visualização da Lista

Todos os pedidos aparecem como cards com informações resumidas:
- **ID do pedido** (#xxxxx)
- **Tipo** (Mesa ou Delivery)
- **Status** (Recebido, Em Preparação, Pronto, Entregue)
- **Mesa ou Cliente**
- **Responsável pelo pedido** (realçado em azul)
- **Quantidade de itens**
- **Total**
- **Horário**

### Filtros

Você pode filtrar os pedidos por:

#### 1. **Status**
```
Todos os status (padrão)
├─ Recebido
├─ Em Preparação
├─ Pronto
├─ Entregue
└─ Cancelado
```

#### 2. **Tipo**
```
Todos os tipos (padrão)
├─ Mesa
└─ Delivery
```

**Como usar:** Selecione nos dropdowns no topo da lista. A lista atualizará automaticamente.

---

## 👤 Visualizando o Responsável

### Na Lista de Pedidos
Cada pedido mostra claramente:
```
📍 Responsável: João Silva (em azul/destaque)
```

### Nos Detalhes do Pedido
Ao clicar em "Detalhes", você vê um card destacado com:
- **Nome completo** do responsável
- **Email** do responsável
- **Perfil** (Admin/Gerente/Garcom/Cozinha/Caixa)

---

## 🎛️ Gerenciando Status de Pedidos

### Entrar nos Detalhes
Clique no botão **"Detalhes"** de um pedido para ver todas as opções.

### Avançar Status
Clique em **"Avançar para..."** para mudar o status:
- **RECEBIDO** → **EM_PREPARAÇÃO** (Começar a preparar)
- **EM_PREPARAÇÃO** → **PRONTO** (Pedido ficou pronto)
- **PRONTO** → **ENTREGUE** (Pedido entregue ao cliente)

### Pedidos de Delivery
Há um botão adicional: **"Atualizar Entrega"**
```
PENDENTE → EM_ROTA → ENTREGUE
```

### Cancelar Pedido
Se necessário, clique em **"Cancelar Pedido"**
- O pedido muda para status **CANCELADO**
- Não pode mais ser editado (apenas admin pode deletar)

---

## 💰 Visualizando Valores

### Na Lista
Mostra apenas o **TOTAL** do pedido

### Nos Detalhes
Você vê a estrutura completa:
```
Subtotal ............. R$ 65,00
Taxa Entrega ......... R$ 5,50 (apenas para delivery)
Desconto ............. R$ 0,00
Gorjeta .............. R$ 0,00
─────────────────────────────────
TOTAL ................ R$ 70,50
```

---

## 🔍 Exemplo Prático

### Cenário: Novo Pedido para Mesa

```
1. Clique em "Novo Pedido"
2. Selecione "Mesa"
3. Escolha "Mesa 5"
4. Adicione:
   - 2x Hambúrguer Premium (R$ 35,00)
   - 1x Batata Frita (R$ 12,00)
   - 2x Refrigerante (R$ 6,00)
5. Obs no Hambúrguer: "Bem passado"
6. Total: R$ 88,00
7. Confirme criação
8. Pedido pronto para a cozinha!
```

### Cenário: Acompanhamento

```
1. Você vê o pedido na lista
2. Status: RECEBIDO
3. Responsável: João Garcom
4. Clica em "Detalhes"
5. Clica em "Avançar para Em Preparação"
6. Cozinha começa a preparar
7. Após pronto: "Avançar para Pronto"
8. Garcom entrega: "Avançar para Entregue"
9. ✅ Pedido finalizado!
```

---

## ⚙️ Permissões

| Ação | Admin | Gerente | Garcom | Cozinha |
|------|-------|---------|--------|---------|
| Criar Pedido | ✅ | ✅ | ✅ | ❌ |
| Listar Pedidos | ✅ | ✅ | ✅ | ❌ |
| Atualizar Status | ✅ | ✅ | ✅ | ❌ |
| Cancelar Pedido | ✅ | ✅ | ✅ | ❌ |
| Deletar Pedido | ✅ | ❌ | ❌ | ❌ |

---

## 🆘 Dúvidas Comuns

### P: Posso editar um pedido depois de criar?
R: Não. Você deve cancelar e criar um novo. Apenas admin pode deletar.

### P: Como filtrar por garcom?
R: Não há filtro por garcom na interface atual. Você pode criar um novo pedido e filtrar pela data/hora.

### P: O que é "Responsável pelo Pedido"?
R: É o usuário que criou o pedido (admin/gerente/garcom que fez o lançamento).

### P: Posso ver histórico de pedidos?
R: Sim, todos os pedidos aparecem na lista (mesmo os cancelados/entregues). Você pode filtrar por status.

### P: Como adicionar desconto ou gorjeta?
R: Atualmente, esses campos não são editáveis via interface. São cálculos futuros.

---

## 📱 Responsivo

A aba de pedidos funciona em:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

---

## 🚀 Dicas Úteis

1. **Sempre Verifique os Filtros** - Você pode estar vendo apenas um tipo de pedido
2. **Adicione Observações** - Isso ajuda a cozinha e o garcom
3. **Atualize Status Regularmente** - Deixa o sistema sempre sincronizado
4. **Use o Horário** - Veja quando foi criado para saber a ordem
5. **Confira o Responsável** - Ajuda na auditoria de quem criou

---

## 📞 Suporte

Consulte também:
- [PEDIDOS_API.md](./PEDIDOS_API.md) - Documentação técnica
- [PEDIDOS_IMPLEMENTACAO.md](./PEDIDOS_IMPLEMENTACAO.md) - Detalhes de implementação
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Guia de integração

---

**Versão:** 1.0  
**Data:** Maio 2026  
**Status:** ✅ Pronto para uso
