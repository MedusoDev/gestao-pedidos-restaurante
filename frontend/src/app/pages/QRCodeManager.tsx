import { useContext, useState } from 'react'
import { api } from '@/lib/axios'
import { AuthContext } from '../contexts/AuthContext'
import Notification from '../components/Notification'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

interface QRCodeData {
  qrCode: string
  cardapioUrl: string
}

export function QRCodeManager() {
  const { user } = useContext(AuthContext)
  const [qrCodeData, setQRCodeData] = useState<QRCodeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function carregarQRCode() {
    if (!user?.estabelecimentoId) {
      setErrorMessage('Estabelecimento não identificado')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')
      
      const response = await api.get(`/public/qrcode/${user.estabelecimentoId}`)
      setQRCodeData(response.data)
      setSuccessMessage('QR Code carregado com sucesso!')
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Erro ao carregar QR Code:', error)
      setErrorMessage(error.response?.data?.error || 'Erro ao carregar QR Code')
    } finally {
      setLoading(false)
    }
  }

  async function downloadarQRCode() {
    if (!user?.estabelecimentoId) {
      setErrorMessage('Estabelecimento não identificado')
      return
    }

    try {
      const response = await api.get(`/public/qrcode/${user.estabelecimentoId}/download`, {
        responseType: 'blob',
      })

      // Cria um link para download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `qrcode-${user.estabelecimentoNome}.png`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccessMessage('QR Code baixado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Erro ao baixar QR Code:', error)
      setErrorMessage('Erro ao baixar QR Code')
    }
  }

  function copiarURL() {
    if (qrCodeData?.cardapioUrl) {
      navigator.clipboard.writeText(qrCodeData.cardapioUrl)
      setSuccessMessage('URL copiada para a área de transferência!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  return (
    <div className="min-h-full bg-muted/30 p-8">
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">QR Code do Cardápio</h1>
          <p className="text-muted-foreground mt-2">
            Gere um QR Code para os clientes acessarem seu cardápio pelo celular
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Seu QR Code</CardTitle>
            <CardDescription>
              Escaneie com o celular ou imprima para colocar no estabelecimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Botão de Carregamento */}
            <Button
              onClick={carregarQRCode}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? 'Gerando...' : 'Gerar QR Code'}
            </Button>

            {/* Exibição do QR Code */}
            {qrCodeData && (
              <div className="space-y-4">
                {/* QR Code Image */}
                <div className="flex justify-center bg-white p-6 rounded-lg border border-border">
                  <img
                    src={qrCodeData.qrCode}
                    alt="QR Code do Cardápio"
                    className="w-64 h-64"
                  />
                </div>

                {/* URL */}
                <div className="bg-muted p-4 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">
                    URL do Cardápio
                  </label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      readOnly
                      value={qrCodeData.cardapioUrl}
                      className="text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copiarURL}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                {/* Instruções */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Como usar:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✅ Baixe a imagem do QR Code</li>
                      <li>✅ Imprima e cole no balcão, mesas ou entrada do estabelecimento</li>
                      <li>✅ Clientes podem escanear com qualquer câmera de celular</li>
                      <li>✅ Acesso direto ao cardápio sem login</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="flex gap-3">
                  <Button
                    onClick={downloadarQRCode}
                    className="flex-1"
                    size="lg"
                  >
                    📥 Baixar QR Code
                  </Button>
                  <Button
                    onClick={copiarURL}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    🔗 Copiar Link
                  </Button>
                </div>

                {/* Preview Mobile */}
                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Preview no Celular</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        Abra este link no seu celular para visualizar:
                      </p>
                      <div className="bg-white p-4 rounded border border-slate-200 text-center">
                        <p className="text-xs text-slate-500 truncate">
                          {qrCodeData.cardapioUrl}
                        </p>
                      </div>
                      <Button
                        onClick={() => window.open(qrCodeData.cardapioUrl, '_blank')}
                        variant="outline"
                        className="w-full"
                      >
                        🌐 Abrir Cardápio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
