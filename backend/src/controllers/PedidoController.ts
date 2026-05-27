import { Request, Response } from 'express';
import { PedidoService } from '../services/PedidoService';

const service = new PedidoService();

export class PedidoController {
  async criar(req: Request, res: Response) {
    try {
      const { tipo, mesaId, nomeCliente, telefone, enderecoEntrega, taxaEntrega, itens } = req.body;
      const usuarioId = req.user!.id;
      const estabelecimentoId = req.user!.estabelecimentoId!;

      const pedido = await service.criar({
        tipo,
        mesaId,
        nomeCliente,
        telefone,
        enderecoEntrega,
        taxaEntrega: taxaEntrega ? parseFloat(taxaEntrega) : 0,
        itens,
        usuarioId,
        estabelecimentoId
      });

      res.status(201).json(pedido);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const estabelecimentoId = req.user!.estabelecimentoId!;
      const { status, tipo } = req.query;

      const pedidos = await service.listar({
        estabelecimentoId,
        status: status as string,
        tipo: tipo as string
      });

      res.json(pedidos);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await service.obterPorId(id);
      res.json(pedido);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async atualizarStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const pedido = await service.atualizarStatus(id, status);
      res.json(pedido);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async atualizarStatusEntrega(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const delivery = await service.atualizarStatusEntrega(id, status);
      res.json(delivery);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async cancelarPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await service.cancelarPedido(id);
      res.json(pedido);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deletarPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.deletarPedido(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
