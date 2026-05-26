import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'

interface Categoria {
  id: string
  nome: string
  itens: ItemCardapio[]
}

interface ItemCardapio {
  id: string
  nome: string
  descricao?: string
  preco: string
  fotoUrl?: string
  disponivel: boolean
}

interface Estabelecimento {
  id: string
  nome: string
  endereco?: string
  telefone?: string
}

export function PublicMenu() {
  const { estabelecimentoId } = useParams<{ estabelecimentoId: string }>()
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null)
  const [loading, setLoading] = useState(true)
  const [carrinho, setCarrinho] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    if (!estabelecimentoId) {
      navigate('/')
      return
    }
    carregarDados()
  }, [estabelecimentoId])

  async function carregarDados() {
    try {
      setLoading(true)
      const response = await api.get(`/public/cardapio/${estabelecimentoId}`)
      setEstabelecimento(response.data.estabelecimento)
      setCategorias(response.data.categorias || [])
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error)
    } finally {
      setLoading(false)
    }
  }

  function adicionarAoCarrinho(itemId: string) {
    const novoCarrinho = new Map(carrinho)
    const quantidade = novoCarrinho.get(itemId) || 0
    novoCarrinho.set(itemId, quantidade + 1)
    setCarrinho(novoCarrinho)
  }

  function removerDoCarrinho(itemId: string) {
    const novoCarrinho = new Map(carrinho)
    const quantidade = novoCarrinho.get(itemId) || 0
    if (quantidade <= 1) {
      novoCarrinho.delete(itemId)
    } else {
      novoCarrinho.set(itemId, quantidade - 1)
    }
    setCarrinho(novoCarrinho)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-lg font-medium text-white">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (!estabelecimento) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-lg font-medium text-red-400">Estabelecimento não encontrado</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const totalCarrinho = Array.from(carrinho.values()).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">{estabelecimento.nome}</h1>
          {estabelecimento.endereco && (
            <p className="text-slate-300 text-sm mt-1">📍 {estabelecimento.endereco}</p>
          )}
          {estabelecimento.telefone && (
            <p className="text-slate-300 text-sm">📞 {estabelecimento.telefone}</p>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {categorias.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <p className="text-slate-300">Nenhum item disponível no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {categorias.map((categoria) => (
              <div key={categoria.id}>
                <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-slate-700">
                  {categoria.nome}
                </h2>

                {categoria.itens.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoria.itens.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-all overflow-hidden flex flex-col"
                      >
                        {/* Imagem */}
                        {item.fotoUrl && (
                          <div className="aspect-video overflow-hidden bg-slate-900">
                            <img
                              src={item.fotoUrl}
                              alt={item.nome}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Conteúdo */}
                        <CardHeader className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-white">{item.nome}</CardTitle>
                              {item.descricao && (
                                <CardDescription className="text-slate-300 mt-2">
                                  {item.descricao}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        {/* Footer */}
                        <CardContent>
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-3xl font-bold text-emerald-400">
                              R$ {typeof item.preco === 'string' ? item.preco : item.preco.toFixed(2)}
                            </div>

                            {/* Controle de Quantidade */}
                            <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-1">
                              <button
                                onClick={() => removerDoCarrinho(item.id)}
                                className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-600 rounded transition"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-white font-semibold">
                                {carrinho.get(item.id) || 0}
                              </span>
                              <button
                                onClick={() => adicionarAoCarrinho(item.id)}
                                className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-600 rounded transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8 text-center">
                      <p className="text-slate-400">Nenhum item nesta categoria.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carrinho Flutuante */}
      {totalCarrinho > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 max-w-sm">
          <Card className="bg-emerald-600 border-emerald-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100">Total no carrinho</p>
                  <p className="text-2xl font-bold text-white">{totalCarrinho} item(ns)</p>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50"
                  onClick={() => console.log('Ir para checkout')}
                >
                  Pedir Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
