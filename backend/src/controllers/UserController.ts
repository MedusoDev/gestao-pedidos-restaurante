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

    if (!['ADMIN', 'GERENTE', 'GARCOM'].includes(userPerfil)) {
      return res.status(400).json({ error: 'Perfil inválido' })
    }

    if (!estabelecimentoId) {
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
      select: { id: true, nome: true, email: true, perfil: true },
    })

    return res.json({
      ...user,
      role: user.perfil,
    })
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body

    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'E-mail ou senha incorretos' })

    const passwordMatch = await compare(senha, user.senhaHash)
    if (!passwordMatch) return res.status(401).json({ error: 'E-mail ou senha incorretos' })

    const token = sign(
      { perfil: user.perfil },
      process.env.JWT_SECRET as string,
      { subject: user.id, expiresIn: '1d' }
    )

    return res.json({
      user: { id: user.id, nome: user.nome, email: user.email, role: user.perfil, estabelecimentoId: user.estabelecimentoId },
      token,
    })
  }

  async me(req: Request, res: Response) {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user_id },
      select: { id: true, nome: true, email: true, perfil: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.json({
      ...user,
      role: user.perfil,
    })
  }
}