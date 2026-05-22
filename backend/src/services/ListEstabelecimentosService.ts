import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();

class ListEstabelecimentosService {
  async execute() {
    const estabelecimentos = await prismaClient.estabelecimento.findMany({
      select: {
        id: true,
        nome: true,
        cnpj: true,
        endereco: true,
        telefone: true,
        horarioFunc: true,
      },
    });

    return estabelecimentos;
  }
}

export { ListEstabelecimentosService };