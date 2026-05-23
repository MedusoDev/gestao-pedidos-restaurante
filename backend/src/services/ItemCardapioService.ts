import { PrismaClient } from '@prisma/client';
import cloudinary from '../config/cloudinary';

const prisma = new PrismaClient();

export class ItemCardapioService {
  // Função auxiliar pra fazer upload do buffer pro Cloudinary
  private async uploadImagem(buffer: Buffer, nome: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'cardapio', public_id: nome, overwrite: true },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });
  }

  async criar(dados: {
    nome: string;
    descricao?: string;
    preco: number;
    categoriaId: string;
    estabelecimentoId: string;
    imagemBuffer?: Buffer;
    imagemNome?: string;
  }) {
    // Verifica se a categoria pertence ao estabelecimento
    const categoria = await prisma.categoria.findFirst({
      where: { id: dados.categoriaId, estabelecimentoId: dados.estabelecimentoId },
    });
    if (!categoria) throw new Error('Categoria não encontrada');

    let fotoUrl: string | undefined;
    if (dados.imagemBuffer && dados.imagemNome) {
      fotoUrl = await this.uploadImagem(dados.imagemBuffer, dados.imagemNome);
    }

    return prisma.itemCardapio.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        preco: dados.preco,
        categoriaId: dados.categoriaId,
        fotoUrl,
      },
    });
  }

  async listar(estabelecimentoId: string, categoriaId?: string) {
    return prisma.itemCardapio.findMany({
      where: {
        categoria: {
          estabelecimentoId,
          ...(categoriaId && { id: categoriaId }),
        },
      },
      include: { categoria: true },
      orderBy: { nome: 'asc' },
    });
  }

  async editar(id: string, estabelecimentoId: string, dados: {
    nome?: string;
    descricao?: string;
    preco?: number;
    categoriaId?: string;
    imagemBuffer?: Buffer;
    imagemNome?: string;
  }) {
    const item = await prisma.itemCardapio.findFirst({
      where: { id, categoria: { estabelecimentoId } },
    });
    if (!item) throw new Error('Item não encontrado');

    let fotoUrl = item.fotoUrl ?? undefined;
    if (dados.imagemBuffer && dados.imagemNome) {
      fotoUrl = await this.uploadImagem(dados.imagemBuffer, dados.imagemNome);
    }

    return prisma.itemCardapio.update({
      where: { id },
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        preco: dados.preco,
        categoriaId: dados.categoriaId,
        fotoUrl,
      },
    });
  }

  async toggleDisponivel(id: string, estabelecimentoId: string) {
    const item = await prisma.itemCardapio.findFirst({
      where: { id, categoria: { estabelecimentoId } },
    });
    if (!item) throw new Error('Item não encontrado');

    return prisma.itemCardapio.update({
      where: { id },
      data: { disponivel: !item.disponivel },
    });
  }

  async excluir(id: string, estabelecimentoId: string) {
    const item = await prisma.itemCardapio.findFirst({
      where: { id, categoria: { estabelecimentoId } },
    });
    if (!item) throw new Error('Item não encontrado');

    return prisma.itemCardapio.delete({ where: { id } });
  }
}