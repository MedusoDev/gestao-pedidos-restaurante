import { useEffect, useState, useContext } from 'react'
import { api } from '@/lib/axios'
import { AuthContext } from '../contexts/AuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'

interface Categoria {
  id: string
  nome: string
  ordemExibicao: number
  itens?: ItemCardapio[]
}

interface ItemCardapio {
  id: string
  nome: string
  descricao?: string
  preco: string | number
  fotoUrl?: string
  disponivel: boolean
  categoriaId?: string
}

export function Menu() {
  const { user } = useContext(AuthContext)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setLoading(true)
      
      // Carrega categorias
      const categoriasResponse = await api.get('/categorias')
      const categoriasData = categoriasResponse.data || []

      // Carrega itens
      const itensResponse = await api.get('/itens')
      const itensData = itensResponse.data || []

      // Agrupa itens por categoria
      const categoriasComItens = categoriasData.map((cat: Categoria) => ({
        ...cat,
        itens: itensData.filter((item: ItemCardapio) => item.categoriaId === cat.id),
      }))

      // Ordena por ordem de exibição
      categoriasComItens.sort((a, b) => a.ordemExibicao - b.ordemExibicao)

      setCategorias(categoriasComItens)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (categorias.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Cardápio</h1>
          <p className="text-muted-foreground mb-8">
            Nenhuma categoria ou item cadastrado ainda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cardápio</h1>
          <p className="text-muted-foreground">
            Estabelecimento: <span className="font-medium text-foreground">{user?.estabelecimentoNome}</span>
          </p>
        </div>

        <div className="space-y-8">
          {categorias.map((categoria) => (
            <div key={categoria.id}>
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{categoria.nome}</h2>
                {categoria.itens && categoria.itens.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {categoria.itens.length} item{categoria.itens.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {categoria.itens && categoria.itens.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoria.itens.map((item) => (
                    <Card key={item.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                      {item.fotoUrl && (
                        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                          <img
                            src={item.fotoUrl}
                            alt={item.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className={item.fotoUrl ? 'pt-4' : ''}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{item.nome}</CardTitle>
                            {item.descricao && (
                              <CardDescription className="mt-2">{item.descricao}</CardDescription>
                            )}
                          </div>
                          {!item.disponivel && (
                            <Badge variant="secondary">Indisponível</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">
                            R$ {typeof item.preco === 'string' ? item.preco : item.preco.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Nenhum item nesta categoria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
