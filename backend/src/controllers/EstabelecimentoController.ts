import { Request, Response } from 'express';
import { ListEstabelecimentosService } from '../services/ListEstabelecimentosService';
import { prisma } from './UserController'; // Reutilizando a instância do prisma

class EstabelecimentoController {
  async index(req: Request, res: Response) {
    const listEstabelecimentosService = new ListEstabelecimentosService();

    const estabelecimentos = await listEstabelecimentosService.execute();

    return res.json(estabelecimentos);
  }

  async create(req: Request, res: Response) {
    const { nome, cnpj, endereco, telefone } = req.body;

    if (!nome || !cnpj || !endereco) {
      return res.status(400).json({ error: 'Nome, CNPJ e Endereço são obrigatórios.' });
    }

    // Remove a formatação do CNPJ antes de salvar
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

    const cnpjExists = await prisma.estabelecimento.findUnique({
      where: { cnpj: cnpjLimpo }
    });

    if (cnpjExists) {
      return res.status(400).json({ error: 'CNPJ já cadastrado.' });
    }

    const estabelecimento = await prisma.estabelecimento.create({
      data: {
        nome,
        cnpj: cnpjLimpo,
        endereco,
        telefone,
      },
      select: {
        id: true,
        nome: true,
        cnpj: true,
        endereco: true,
        telefone: true,
      }
    });

    return res.status(201).json(estabelecimento);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Verifica se há usuários vinculados
      const usuariosVinculados = await prisma.usuario.count({
        where: { estabelecimentoId: id }
      });

      if (usuariosVinculados > 0) {
        return res.status(400).json({ error: 'Não é possível excluir. Existem usuários vinculados a este estabelecimento.' });
      }

      await prisma.estabelecimento.delete({
        where: { id }
      });

      return res.json({ message: 'Estabelecimento excluído com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir estabelecimento.' });
    }
  }
}

export { EstabelecimentoController };