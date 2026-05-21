# Gestao de Pedidos para Restaurantes

## Sobre o Projeto

O Pedido Certo é um sistema digital de gestão de pedidos para restaurantes, lanchonetes e food trucks que substitui processos manuais por uma plataforma integrada e em tempo real.

Ele conecta salão, cozinha e gestão, permitindo registrar pedidos, acompanhar o status de preparo, controlar mesas e delivery, dividir contas e automatizar cálculos financeiros. Além disso, oferece relatórios de vendas e desempenho, ajudando o gestor a tomar decisões mais estratégicas.

## Integrantes

| Nome | Matricula |
|------|-----------|
| Ryan Nunes da Silva | 01431101 |
| Anderson Djalma Santos Pinto | 01607677 |
| Gabriel de Oliveira Barros | 01608601 |
| Brian Samuel de Barros Santos | 01608705 |

## Estrutura

```text
.
|-- backend/
|-- docker/
|   `-- docker-compose.yml
|-- frontend/
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- src/
|-- .gitignore
`-- README.md
```

## Tecnologias

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui (init basico), React Router, Axios, Socket.io Client
- Backend: Node.js 20, Express, TypeScript, Prisma ORM, PostgreSQL, Socket.io, JWT, Zod, Bcrypt
- Orquestracao: Docker Compose

## Como rodar com Docker

### 1. Requisitos

- Docker
- Docker Compose

### 2. Subir os servicos

No diretorio `docker/`, execute:

```bash
docker compose up --build
```

Isso sobe:

- PostgreSQL na porta `5432`
- Backend na porta `3333`
- Frontend na porta `5173`

### 3. Acessar a aplicacao

**Frontend:**
- Abra no navegador: `http://localhost:5173`

**API Backend:**
- `http://localhost:3333/health`
- `http://localhost:3333/api/status`

## Como rodar sem Docker (opcional)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend padrao: `http://localhost:5173`

## Observacoes

- Este projeto e um boilerplate funcional completo com **3 containers**: PostgreSQL, Backend e Frontend.
- O Frontend e servido via Nginx em container (build multi-stage Vite + Nginx Alpine).
- O Backend aplica `prisma db push` ao iniciar para criar o schema base.
- Escopo inicial.
