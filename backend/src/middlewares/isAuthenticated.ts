import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) return res.status(401).json({ error: 'Token não fornecido' });

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as { sub: string };
    
    // Busca o usuário no banco de dados
    const user = await prisma.usuario.findUnique({
      where: { id: sub },
      select: {
        id: true,
        email: true,
        perfil: true,
        estabelecimentoId: true,
        nome: true,
        ativo: true,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.ativo) {
      return res.status(403).json({ error: 'Usuário inativo' });
    }

    // Coloca os dados do usuário no request
    req.user = {
      id: user.id,
      email: user.email,
      perfil: user.perfil,
      estabelecimentoId: user.estabelecimentoId || undefined,
    };

    return next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
}