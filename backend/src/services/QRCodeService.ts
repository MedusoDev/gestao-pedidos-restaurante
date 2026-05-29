import QRCode from 'qrcode';

export class QRCodeService {
  /**
   * Gera um QR Code em formato PNG (base64 ou buffer)
   * @param data - Dados a serem codificados no QR Code (geralmente uma URL)
   * @returns PNG base64 string
   */
  async gerarQRCode(data: string): Promise<string> {
    try {
      // Gera QR Code como Data URL (base64)
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        width: 500,
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error(`Erro ao gerar QR Code: ${error}`);
    }
  }

  /**
   * Gera QR Code como buffer (para salvar em arquivo ou enviar direto)
   */
  async gerarQRCodeBuffer(data: string): Promise<Buffer> {
    try {
      const buffer = await QRCode.toBuffer(data, {
        errorCorrectionLevel: 'H',
        type: 'png',
        margin: 1,
        width: 500,
      });
      
      return buffer;
    } catch (error) {
      throw new Error(`Erro ao gerar QR Code: ${error}`);
    }
  }
}
