import { Request, Response } from 'express'
import { PrismaClient, StatusMesa } from '@prisma/client'

const prisma = new PrismaClient()

const allowedStatuses: StatusMesa[] = ['LIVRE', 'OCUPADA', 'RESERVADA', 'MANUTENCAO']

export class MesaController {
  async index(req: Request, res: Response) {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user_id },
      select: { estabelecimentoId: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const mesas = await prisma.mesa.findMany({
      where: {
        estabelecimentoId: user.estabelecimentoId,
      },
      select: {
        id: true,
        numero: true,
        capacidade: true,
        status: true,
      },
      orderBy: {
        numero: 'asc',
      },
    })

    return res.json({ mesas })
  }

  async create(req: Request, res: Response) {
    const { numero, capacidade, status, estabelecimentoId } = req.body

    if (!estabelecimentoId) {
      return res.status(400).json({ error: 'estabelecimentoId é obrigatório' })
    }

    const numeroMesa = Number(numero)
    const capacidadeMesa = Number(capacidade)
    const statusMesa = (status ?? 'LIVRE') as StatusMesa

    if (!Number.isInteger(numeroMesa) || numeroMesa <= 0) {
      return res.status(400).json({ error: 'Número da mesa inválido' })
    }

    if (!Number.isInteger(capacidadeMesa) || capacidadeMesa <= 0) {
      return res.status(400).json({ error: 'Capacidade inválida' })
    }

    if (!allowedStatuses.includes(statusMesa)) {
      return res.status(400).json({ error: 'Status da mesa inválido' })
    }

    const mesaExists = await prisma.mesa.findFirst({
      where: {
        estabelecimentoId,
        numero: numeroMesa,
      },
    })

    if (mesaExists) {
      return res.status(400).json({ error: 'Mesa já cadastrada para este estabelecimento' })
    }

    const mesa = await prisma.mesa.create({
      data: {
        numero: numeroMesa,
        capacidade: capacidadeMesa,
        status: statusMesa,
        estabelecimentoId,
      },
      select: {
        id: true,
        numero: true,
        capacidade: true,
        status: true,
        estabelecimentoId: true,
      },
    })

    return res.json(mesa)
  }
}