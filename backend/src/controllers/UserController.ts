import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export class UserController {
  // Criar novo usuário (Cadastro)
  async create(req: Request, res: Response) {
    const { nome, email, senha, perfil, role, estabelecimentoId } = req.body
    const userPerfil = perfil ?? role

    if (!['SUPER_ADMIN', 'ADMIN', 'GERENTE', 'GARCOM'].includes(userPerfil)) {
      return res.status(400).json({ error: 'Perfil inválido' })
    }

    if (userPerfil !== 'SUPER_ADMIN' && !estabelecimentoId) {
      return res.status(400).json({ error: 'estabelecimentoId é obrigatório' })
    }

    const userExists = await prisma.usuario.findUnique({ where: { email } })
    if (userExists) return res.status(400).json({ error: 'E-mail já cadastrado' })

    const senhaHash = await hash(senha, 8)

    const user = await prisma.usuario.create({
      data: { 
        nome, 
        email, 
        senhaHash, 
        perfil: userPerfil,
        estabelecimentoId
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        estabelecimentoId: true,
        estabelecimento: {
          select: {
            nome: true,
          },
        },
      },
    })

    return res.json({
      ...user,
      role: user.perfil,
      estabelecimentoNome: user.estabelecimento?.nome || null,
    })
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body

    const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senhaHash: true,
        perfil: true,
        estabelecimentoId: true,
        estabelecimento: {
          select: {
            nome: true,
          },
        },
      },
    })
    if (!user) return res.status(401).json({ error: 'E-mail ou senha incorretos' })

    const passwordMatch = await compare(senha, user.senhaHash)
    if (!passwordMatch) return res.status(401).json({ error: 'E-mail ou senha incorretos' })

    const token = sign(
      { perfil: user.perfil },
      process.env.JWT_SECRET as string,
      { subject: user.id, expiresIn: '1d' }
    )

    return res.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.perfil,
        estabelecimentoId: user.estabelecimentoId,
        estabelecimentoNome: user.estabelecimento?.nome || null,
      },
      token,
    })
  }

  async me(req: Request, res: Response) {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user_id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        estabelecimentoId: true,
        estabelecimento: {
          select: {
            nome: true,
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.json({
      ...user,
      role: user.perfil,
      estabelecimentoNome: user.estabelecimento?.nome || null,
    })
  }

  async index(req: Request, res: Response) {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        estabelecimentoId: true,
        estabelecimento: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        criadoEm: 'desc'
      }
    })

    const usuariosFormatados = usuarios.map(u => ({
      ...u,
      role: u.perfil,
      estabelecimentoNome: u.estabelecimento?.nome || null,
    }))

    return res.json(usuariosFormatados)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    const user = await prisma.usuario.findUnique({
      where: { id },
      select: { perfil: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    if (user.perfil === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Não é possível excluir um SUPER_ADMIN' })
    }

    await prisma.usuario.delete({
      where: { id }
    })

    return res.json({ message: 'Usuário excluído com sucesso' })
  }
}