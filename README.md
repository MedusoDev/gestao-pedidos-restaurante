# Gestao de Pedidos para Restaurantes

Boilerplate full-stack com frontend em React + TypeScript (Vite) e backend em Node.js + Express + TypeScript + Prisma (PostgreSQL).

## Estrutura

```text
.
|-- backend/
|-- docker/
|-- frontend/
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

### 3. Testar API

Abra no navegador ou use curl:

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

- Este projeto e um boilerplate funcional minimo.
- Nao ha regras de negocio avancadas implementadas.
- O backend aplica `prisma db push` ao iniciar no container para criar o schema base.