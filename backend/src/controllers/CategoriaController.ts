import { Request, Response } from 'express';
import { CategoriaService } from '../services/CategoriaService';

const service = new CategoriaService();

export class CategoriaController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, ordemExibicao } = req.body;
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const categoria = await service.criar(nome, ordemExibicao ?? 0, estabelecimentoId);
      res.status(201).json(categoria);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const categorias = await service.listar(estabelecimentoId);
      res.json(categorias);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const categoria = await service.editar(id, estabelecimentoId, req.body);
      res.json(categoria);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const estabelecimentoId = req.user!.estabelecimentoId!;
      await service.excluir(id, estabelecimentoId);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}