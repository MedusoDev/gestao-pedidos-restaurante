import { Router } from "express";

const router = Router();

router.get("/status", (_req, res) => {
  res.status(200).json({ message: "API de pedidos ativa" });
});

export default router;
