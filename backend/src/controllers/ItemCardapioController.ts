import { Request, Response } from 'express';
import { ItemCardapioService } from '../services/ItemCardapioService';

const service = new ItemCardapioService();

export class ItemCardapioController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, preco, categoriaId } = req.body;
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const file = req.file;

      const item = await service.criar({
        nome,
        descricao,
        preco: parseFloat(preco),
        categoriaId,
        estabelecimentoId,
        imagemBuffer: file?.buffer,
        imagemNome: file ? `${Date.now()}-${nome}` : undefined,
      });

      res.status(201).json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const { categoriaId } = req.query;
      const itens = await service.listar(estabelecimentoId, categoriaId as string);
      res.json(itens);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const file = req.file;

      const item = await service.editar(id, estabelecimentoId, {
        ...req.body,
        preco: req.body.preco ? parseFloat(req.body.preco) : undefined,
        imagemBuffer: file?.buffer,
        imagemNome: file ? `${Date.now()}-${req.body.nome}` : undefined,
      });

      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async toggleDisponivel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const item = await service.toggleDisponivel(id, estabelecimentoId);
      res.json(item);
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