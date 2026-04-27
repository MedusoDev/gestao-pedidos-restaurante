import "dotenv/config";
import http from "node:http";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { Server as SocketIOServer } from "socket.io";

import routes from "./routes";

const app = express();
const server = http.createServer(app);

// Configuração do Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Suas rotas centralizadas
app.use("/api", routes);

/**
 * Middleware Global de Erros
 * Importante para capturar erros lançados nos Services (como "Usuário incorreto")
 * e retornar um JSON bonito para o front-end em vez de quebrar o servidor.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

// Gerenciamento de WebSockets
io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

const port = Number(process.env.PORT ?? 3333);

server.listen(port, () => {
  console.log(`🚀 Backend em execução na porta ${port}`);
});

// Exportamos o 'io' caso você queira emitir eventos de dentro dos seus Services
export { io };