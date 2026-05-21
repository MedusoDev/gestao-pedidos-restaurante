import { PrismaClient, PerfilUsuario } from '@prisma/client'
export const prisma = new PrismaClient()

export class CreateUserService {
  async execute(nome: string, email: string, senhaHash: string, perfil: PerfilUsuario, estabelecimentoId: string) {
    const user = await prisma.usuario.create({
      data: { nome, email, senhaHash, perfil, estabelecimentoId }
    })
    return user
  }
}