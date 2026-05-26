import { Request, Response, NextFunction } from 'express'

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.perfil)) {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' })
  }

  return next()
}