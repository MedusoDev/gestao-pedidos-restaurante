import { Request, Response, NextFunction } from 'express'

export function isPedidoOperator(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }

  const permissoes = ['ADMIN', 'SUPER_ADMIN', 'GERENTE', 'GARCOM'];
  
  if (!permissoes.includes(user.perfil)) {
    return res.status(403).json({ error: 'Acesso permitido apenas para Admin, Gerente e Garçom' })
  }

  return next()
}
