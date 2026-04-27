import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export class CreateUserService {
  async execute(nome: string, email: string, senhaHash: string, perfil: string) {
    const user = await prisma.usuario.create({
      data: { nome, email, senhaHash, perfil }
    })
    return user
  }
}