import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export class UserController {
  
  // Criar novo usuário (Cadastro)
  async create(req: Request, res: Response) {
    const { nome, email, senha, role } = req.body;

    const userExists = await prisma.usuario.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: "E-mail já cadastrado" });

    // Criptografa a senha antes de salvar
    const senhaHash = await hash(senha, 8);

    const user = await prisma.usuario.create({
      data: { nome, email, senhaHash, role },
      select: { id: true, nome: true, email: true, role: true } // Não retorna a senha no JSON
    });

    return res.json(user);
  }

  // Autenticar usuário (Login)
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "E-mail ou senha incorretos" });

    // Compara a senha digitada com a criptografada
    const passwordMatch = await compare(senha, user.senhaHash);
    if (!passwordMatch) return res.status(401).json({ error: "E-mail ou senha incorretos" });

    // Gera o token
    const token = sign(
      { role: user.role }, 
      process.env.JWT_SECRET as string, 
      { subject: user.id, expiresIn: '1d' }
    );

    return res.json({
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
      token
    });
  }

  // Exemplo de rota protegida: Perfil do usuário logado
  async me(req: Request, res: Response) {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user_id },
      select: { id: true, nome: true, email: true, role: true }
    });
    return res.json(user);
  }
}