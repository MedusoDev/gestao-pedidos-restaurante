import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = await prisma.usuario.findUnique({
    where: { id: req.user_id },
    select: { perfil: true },
  })

  if (!user || user.perfil !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' })
  }

  return next()
}