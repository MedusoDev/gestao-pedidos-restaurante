import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { QRCodeService } from '../services/QRCodeService';

const prisma = new PrismaClient();
const qrcodeService = new QRCodeService();

export class PublicController {
  /**
   * Retorna o cardápio de um estabelecimento (público, sem autenticação)
   */
  async obterCardapio(req: Request, res: Response) {
    try {
      const { estabelecimentoId } = req.params;

      // Busca o estabelecimento
      const estabelecimento = await prisma.estabelecimento.findUnique({
        where: { id: estabelecimentoId },
        select: {
          id: true,
          nome: true,
          endereco: true,
          telefone: true,
        },
      });

      if (!estabelecimento) {
        return res.status(404).json({ error: 'Estabelecimento não encontrado' });
      }

      // Busca categorias e itens
      const categorias = await prisma.categoria.findMany({
        where: { estabelecimentoId },
        orderBy: { ordemExibicao: 'asc' },
        include: {
          itens: {
            where: { disponivel: true },
            orderBy: { nome: 'asc' },
          },
        },
      });

      res.json({
        estabelecimento,
        categorias,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar cardápio' });
    }
  }

  /**
   * Retorna o QR Code do estabelecimento
   */
  async obterQRCode(req: Request, res: Response) {
    try {
      const { estabelecimentoId } = req.params;

      // Verifica se o estabelecimento existe
      const estabelecimento = await prisma.estabelecimento.findUnique({
        where: { id: estabelecimentoId },
      });

      if (!estabelecimento) {
        return res.status(404).json({ error: 'Estabelecimento não encontrado' });
      }

      // Cria a URL do cardápio público
      // Ajuste a URL base conforme necessário
      const cardapioUrl = `${process.env.FRONTEND_URL}/cardapio/${estabelecimentoId}`;

      // Gera o QR Code
      const qrCodeDataUrl = await qrcodeService.gerarQRCode(cardapioUrl);

      res.json({
        qrCode: qrCodeDataUrl,
        cardapioUrl,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao gerar QR Code' });
    }
  }

  /**
   * Download do QR Code como imagem PNG
   */
  async downloadQRCode(req: Request, res: Response) {
    try {
      const { estabelecimentoId } = req.params;

      // Verifica se o estabelecimento existe
      const estabelecimento = await prisma.estabelecimento.findUnique({
        where: { id: estabelecimentoId },
      });

      if (!estabelecimento) {
        return res.status(404).json({ error: 'Estabelecimento não encontrado' });
      }

      // Cria a URL do cardápio público
      const cardapioUrl = `${process.env.FRONTEND_URL}/cardapio/${estabelecimentoId}`;

      // Gera o QR Code como buffer
      const qrCodeBuffer = await qrcodeService.gerarQRCodeBuffer(cardapioUrl);

      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', `attachment; filename="qrcode-${estabelecimento.nome}.png"`);
      res.send(qrCodeBuffer);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao gerar QR Code' });
    }
  }
}
