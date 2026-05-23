import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CategoriaService {
  async criar(nome: string, ordemExibicao: number, estabelecimentoId: string) {
    return prisma.categoria.create({
      data: { nome, ordemExibicao, estabelecimentoId },
    });
  }

  async listar(estabelecimentoId: string) {
    return prisma.categoria.findMany({
      where: { estabelecimentoId },
      orderBy: { ordemExibicao: 'asc' },
      include: { itens: true },
    });
  }

  async editar(id: string, estabelecimentoId: string, dados: { nome?: string; ordemExibicao?: number }) {
    // Verifica se a categoria pertence ao estabelecimento
    const categoria = await prisma.categoria.findFirst({
      where: { id, estabelecimentoId },
    });
    if (!categoria) throw new Error('Categoria não encontrada');

    return prisma.categoria.update({ where: { id }, data: dados });
  }

  async excluir(id: string, estabelecimentoId: string) {
    const categoria = await prisma.categoria.findFirst({
      where: { id, estabelecimentoId },
      include: { itens: true },
    });
    if (!categoria) throw new Error('Categoria não encontrada');
    if (categoria.itens.length > 0) {
      throw new Error('Remova os itens desta categoria antes de excluí-la');
    }

    return prisma.categoria.delete({ where: { id } });
  }
}