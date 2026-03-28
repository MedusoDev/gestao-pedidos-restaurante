import "dotenv/config";

import http from "node:http";
import cors from "cors";
import express from "express";
import { Server as SocketIOServer } from "socket.io";

import routes from "./routes";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", routes);

io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

const port = Number(process.env.PORT ?? 3333);

server.listen(port, () => {
  console.log(`Backend em execucao na porta ${port}`);
});
