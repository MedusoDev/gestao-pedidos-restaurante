import { useContext, useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { AuthContext } from '../../contexts/AuthContext'
import Notification from '../../components/Notification'

import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'

const userFormSchema = z.object({
  nome: z.string().min(3, { message: 'Informe o nome completo.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  senha: z.string().min(6, { message: 'A senha precisa ter ao menos 6 caracteres.' }),
  perfil: z.enum(['ADMIN', 'GERENTE', 'GARCOM']),
})

const mesaFormSchema = z.object({
  numero: z.string().trim().regex(/^[1-9]\d*$/, { message: 'Informe um número válido.' }),
  capacidade: z.string().trim().regex(/^[1-9]\d*$/, { message: 'Informe uma capacidade válida.' }),
  status: z.enum(['LIVRE', 'OCUPADA', 'RESERVADA', 'MANUTENCAO']),
})

const categoriaFormSchema = z.object({
  nome: z.string().min(3, { message: 'Informe um nome válido.' }),
  ordemExibicao: z.string().default('0'),
})

const itemCardapioFormSchema = z.object({
  nome: z.string().min(3, { message: 'Informe um nome válido.' }),
  descricao: z.string().optional(),
  preco: z.string().regex(/^\d+(\.\d{2})?$/, { message: 'Informe um preço válido.' }),
  categoriaId: z.string().min(1, { message: 'Selecione uma categoria.' }),
  imagem: z.instanceof(File).optional(),
})

const mesaStatusOptions = [
  { value: 'LIVRE', label: 'Livre' },
  { value: 'OCUPADA', label: 'Ocupada' },
  { value: 'RESERVADA', label: 'Reservada' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
] as const

interface Categoria {
  id: string
  nome: string
  ordemExibicao: number
}

export function Register() {
  const { user } = useContext(AuthContext)
  const [userSuccessMessage, setUserSuccessMessage] = useState('')
  const [mesaSuccessMessage, setMesaSuccessMessage] = useState('')
  const [categoriaSuccessMessage, setCategoriaSuccessMessage] = useState('')
  const [itemSuccessMessage, setItemSuccessMessage] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [imagemPreview, setImagemPreview] = useState<string>('')

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      perfil: 'GARCOM',
    },
  })

  const mesaForm = useForm<z.infer<typeof mesaFormSchema>>({
    resolver: zodResolver(mesaFormSchema),
    defaultValues: {
      numero: '',
      capacidade: '',
      status: 'LIVRE',
    },
  })

  const categoriaForm = useForm<z.infer<typeof categoriaFormSchema>>({
    resolver: zodResolver(categoriaFormSchema),
    defaultValues: {
      nome: '',
      ordemExibicao: '0',
    },
  })

  const itemForm = useForm<z.infer<typeof itemCardapioFormSchema>>({
    resolver: zodResolver(itemCardapioFormSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      preco: '',
      categoriaId: '',
      imagem: undefined,
    },
  })

  // Carrega categorias ao montar o componente
  useEffect(() => {
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    try {
      const response = await api.get('/categorias')
      setCategorias(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  async function handleUserSubmit(values: z.infer<typeof userFormSchema>) {
    setUserSuccessMessage('')

    if (!user?.estabelecimentoId) {
      alert('Não foi possível identificar o estabelecimento da sessão.')
      return
    }

    try {
      await api.post('/usuarios', {
        ...values,
        estabelecimentoId: user.estabelecimentoId,
      })

      userForm.reset({
        nome: '',
        email: '',
        senha: '',
        perfil: 'GARCOM',
      })

      setUserSuccessMessage('Perfil criado com sucesso.')
    } catch (error) {
      console.error('Falha ao criar usuário:', error)
      alert('Não foi possível criar o perfil.')
    }
    setUserSuccessMessage('Perfil criado com sucesso.')

    setTimeout(() => {
      setUserSuccessMessage('')
    }, 3000)
  }

  async function handleMesaSubmit(values: z.infer<typeof mesaFormSchema>) {
    setMesaSuccessMessage('')

    if (!user?.estabelecimentoId) {
      alert('Não foi possível identificar o estabelecimento da sessão.')
      return
    }

    try {
      await api.post('/mesas', {
        numero: Number(values.numero),
        capacidade: Number(values.capacidade),
        status: 'LIVRE',
        estabelecimentoId: user.estabelecimentoId,
      })

      mesaForm.reset({
        numero: '',
        capacidade: '',
        status: 'LIVRE',
      })

      setMesaSuccessMessage('Mesa criada com sucesso.')
    } catch (error) {
      console.error('Falha ao criar mesa:', error)
      alert('Não foi possível criar a mesa.')
    }
    setMesaSuccessMessage('Mesa criada com sucesso.')

    setTimeout(() => {
      setMesaSuccessMessage('')
    }, 3000)
  }

  async function handleCategoriaSubmit(values: z.infer<typeof categoriaFormSchema>) {
    setCategoriaSuccessMessage('')

    try {
      await api.post('/categorias', {
        nome: values.nome,
        ordemExibicao: Number(values.ordemExibicao),
      })

      categoriaForm.reset({
        nome: '',
        ordemExibicao: '0',
      })

      setCategoriaSuccessMessage('Categoria criada com sucesso.')
      carregarCategorias()
    } catch (error: any) {
      console.error('Falha ao criar categoria:', error)
      alert(error.response?.data?.error || 'Não foi possível criar a categoria.')
    }

    setTimeout(() => {
      setCategoriaSuccessMessage('')
    }, 3000)
  }

  async function handleItemSubmit(values: z.infer<typeof itemCardapioFormSchema>) {
    setItemSuccessMessage('')

    const formData = new FormData()
    formData.append('nome', values.nome)
    formData.append('descricao', values.descricao || '')
    formData.append('preco', values.preco)
    formData.append('categoriaId', values.categoriaId)
    
    if (values.imagem) {
      formData.append('imagem', values.imagem)
    }

    try {
      await api.post('/itens', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      itemForm.reset({
        nome: '',
        descricao: '',
        preco: '',
        categoriaId: '',
        imagem: undefined,
      })
      setImagemPreview('')

      setItemSuccessMessage('Item do cardápio criado com sucesso.')
      carregarCategorias()
    } catch (error: any) {
      console.error('Falha ao criar item:', error)
      alert(error.response?.data?.error || 'Não foi possível criar o item.')
    }

    setTimeout(() => {
      setItemSuccessMessage('')
    }, 3000)
  }

  function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      itemForm.setValue('imagem', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Notification message={userSuccessMessage} type="success" />
      <Notification message={mesaSuccessMessage} type="success" />
      <Notification message={categoriaSuccessMessage} type="success" />
      <Notification message={itemSuccessMessage} type="success" />

      <div className="min-h-full bg-muted/30 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gestão do Estabelecimento</h1>
            <p className="text-muted-foreground">
              Sessão: <span className="font-medium text-foreground">{user?.nome}</span> | 
              Estabelecimento: <span className="font-medium text-foreground">{user?.estabelecimentoNome}</span>
            </p>
          </div>

          <Tabs defaultValue="usuarios" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="mesas">Mesas</TabsTrigger>
              <TabsTrigger value="categorias">Categorias</TabsTrigger>
              <TabsTrigger value="itens">Items</TabsTrigger>
              <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            </TabsList>

            {/* TAB: USUÁRIOS */}
            <TabsContent value="usuarios" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Registro de usuários</CardTitle>
                  <CardDescription>
                    Apenas administradores podem criar novos perfis de admin, gerente e garçom.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(handleUserSubmit)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do usuário" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="usuario@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="perfil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Perfil</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                              >
                                <option value="ADMIN">Admin</option>
                                <option value="GERENTE">Gerente</option>
                                <option value="GARCOM">Garçom</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={userForm.formState.isSubmitting}>
                        {userForm.formState.isSubmitting ? 'Criando...' : 'Criar perfil'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: MESAS */}
            <TabsContent value="mesas" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Registro de mesas</CardTitle>
                  <CardDescription>
                    Cadastre as mesas do estabelecimento com número, capacidade e status inicial.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...mesaForm}>
                    <form onSubmit={mesaForm.handleSubmit(handleMesaSubmit)} className="space-y-4">
                      <FormField
                        control={mesaForm.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número da mesa</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="Ex.: 12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mesaForm.control}
                        name="capacidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidade</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="Ex.: 4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mesaForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status inicial</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                              >
                                {mesaStatusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={mesaForm.formState.isSubmitting}>
                        {mesaForm.formState.isSubmitting ? 'Criando...' : 'Criar mesa'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: CATEGORIAS */}
            <TabsContent value="categorias" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Cadastro de categorias</CardTitle>
                  <CardDescription>
                    Crie categorias para organizar os itens do cardápio (Ex.: Frios, Churrasco, Bebidas).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...categoriaForm}>
                    <form onSubmit={categoriaForm.handleSubmit(handleCategoriaSubmit)} className="space-y-4">
                      <FormField
                        control={categoriaForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da categoria</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex.: Frios, Churrasco, Bebidas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={categoriaForm.control}
                        name="ordemExibicao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordem de exibição</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={categoriaForm.formState.isSubmitting}>
                        {categoriaForm.formState.isSubmitting ? 'Criando...' : 'Criar categoria'}
                      </Button>
                    </form>
                  </Form>

                  {categorias.length > 0 && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="font-semibold mb-4">Categorias cadastradas</h3>
                      <div className="space-y-2">
                        {categorias.map((cat) => (
                          <div key={cat.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div>
                              <p className="font-medium">{cat.nome}</p>
                              <p className="text-sm text-muted-foreground">Ordem: {cat.ordemExibicao}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: ITEMS DO CARDÁPIO */}
            <TabsContent value="itens" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Cadastro de itens do cardápio</CardTitle>
                  <CardDescription>
                    Adicione itens ao cardápio com nome, descrição, preço e imagem.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...itemForm}>
                    <form onSubmit={itemForm.handleSubmit(handleItemSubmit)} className="space-y-4">
                      <FormField
                        control={itemForm.control}
                        name="categoriaId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                              >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={itemForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do item</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex.: Filé mignon grelhado" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={itemForm.control}
                        name="descricao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição (opcional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Descreva o item do cardápio..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={itemForm.control}
                        name="preco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex.: 45.90" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImagemChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      {imagemPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview da imagem:</p>
                          <img src={imagemPreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={itemForm.formState.isSubmitting}>
                        {itemForm.formState.isSubmitting ? 'Criando...' : 'Criar item'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: QR CODE */}
            <TabsContent value="qrcode" className="mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>QR Code do Cardápio</CardTitle>
                  <CardDescription>
                    Gere um QR Code para os clientes acessarem o cardápio pelo celular
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Clique no botão abaixo para gerar um QR Code único para o seu estabelecimento. 
                      Os clientes podem escanear com a câmera do celular para acessar seu cardápio.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/dashboard/qrcode'}
                      size="lg"
                      className="w-full"
                    >
                      🔲 Gerenciar QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}