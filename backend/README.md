# Backend - Gestão de Pedidos de Restaurante

Este é o backend do sistema de gestão de pedidos, desenvolvido em Node.js com TypeScript. Ele é responsável por toda a lógica de negócio, autenticação, e comunicação com o banco de dados.

## Como Funciona

O backend é uma API RESTful que utiliza Express.js para o roteamento e gerenciamento das requisições HTTP. A comunicação em tempo real, como a notificação de novos pedidos para a cozinha, é feita com WebSockets através da biblioteca `socket.io`.

A arquitetura segue uma separação de responsabilidades, com a lógica de negócio contida nos `services`, as requisições sendo recebidas pelos `controllers`, e as rotas definidas no arquivo `router.ts`.

### Principais Funcionalidades:

*   **Autenticação:** Utiliza JWT (JSON Web Token) para proteger as rotas. O login de um usuário gera um token que deve ser enviado no cabeçalho de autorização para acessar rotas protegidas.
*   **Gerenciamento de Usuários:** Cadastro e autenticação de usuários com diferentes perfis (Admin, Garçom, Cozinha, Caixa).
*   **Banco de Dados:** A persistência dos dados é feita em um banco de dados PostgreSQL, e o acesso a ele é gerenciado pelo ORM Prisma. O `schema.prisma` define todos os modelos de dados da aplicação.
*   **Comunicação em Tempo Real:** O `socket.io` é utilizado para notificar em tempo real as diferentes partes do sistema (por exemplo, quando um novo pedido é feito, a cozinha é notificada instantaneamente).

## Tecnologias e Recursos Utilizados

*   **Node.js:** Ambiente de execução para o JavaScript no servidor.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática, aumentando a robustez e a manutenibilidade do código.
*   **Express.js:** Framework para a criação de APIs RESTful.
*   **Prisma:** ORM (Object-Relational Mapping) para a comunicação com o banco de dados PostgreSQL. Facilita a criação e manipulação das tabelas e registros.
*   **Socket.io:** Biblioteca para a comunicação em tempo real via WebSockets.
*   **bcryptjs:** Para a criptografia de senhas antes de salvá-las no banco de dados.
*   **jsonwebtoken (JWT):** Para a criação e verificação de tokens de autenticação.
*   **Zod:** Para validação de esquemas de dados, garantindo que os dados recebidos pela API estejam no formato correto.
*   **ts-node-dev:** Para o desenvolvimento, reiniciando o servidor automaticamente a cada alteração no código.
*   **Docker:** O backend pode ser containerizado para facilitar o deploy e a execução em diferentes ambientes.

## Estrutura de Pastas

*   `src/controllers`: Recebem as requisições HTTP e chamam os serviços correspondentes.
*   `src/services`: Contêm a lógica de negócio da aplicação.
*   `src/middlewares`: Funções que são executadas antes das rotas, como a `isAuthenticated` que verifica o token de autenticação.
*   `src/routes`: Definição de todas as rotas da API.
*   `prisma`: Contém o schema do banco de dados e as migrações.

## Como Executar

1.  Instale as dependências: `npm install`
2.  Configure as variáveis de ambiente em um arquivo `.env` (principalmente a `DATABASE_URL`).
3.  Execute as migrações do Prisma: `npx prisma migrate deploy`
4.  Inicie o servidor em modo de desenvolvimento: `npm run dev`
