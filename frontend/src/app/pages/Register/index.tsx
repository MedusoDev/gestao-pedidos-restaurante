import { useContext, useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { AuthContext } from '../../contexts/AuthContext'
import Notification from '../../components/Notification'
import {
  Tag,
  Users,
  TableProperties,
  UtensilsCrossed,
  Info,
  Plus,
} from 'lucide-react'

import { Button } from '@/app/components/ui/button'
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

// ─── Schemas ────────────────────────────────────────────────────────────────

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

const inputCls =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

type TabKey = 'usuarios' | 'mesas' | 'categorias' | 'itens'

const navItems: { key: TabKey; label: string; icon: React.ReactNode; description: string }[] = [
  {
    key: 'usuarios',
    label: 'Usuários',
    icon: <Users className="h-5 w-5" />,
    description: 'Gerencie os perfis de acesso',
  },
  {
    key: 'mesas',
    label: 'Mesas',
    icon: <TableProperties className="h-5 w-5" />,
    description: 'Cadastre e configure as mesas',
  },
  {
    key: 'categorias',
    label: 'Categorias',
    icon: <Tag className="h-5 w-5" />,
    description: 'Organize o cardápio por categoria',
  },
  {
    key: 'itens',
    label: 'Itens',
    icon: <UtensilsCrossed className="h-5 w-5" />,
    description: 'Adicione itens ao cardápio',
  },
]

function FormPanelHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Register() {
  const { user } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState<TabKey>('usuarios')
  const [userSuccessMessage, setUserSuccessMessage] = useState('')
  const [mesaSuccessMessage, setMesaSuccessMessage] = useState('')
  const [categoriaSuccessMessage, setCategoriaSuccessMessage] = useState('')
  const [itemSuccessMessage, setItemSuccessMessage] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [imagemPreview, setImagemPreview] = useState<string>('')

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { nome: '', email: '', senha: '', perfil: 'GARCOM' },
  })

  const mesaForm = useForm<z.infer<typeof mesaFormSchema>>({
    resolver: zodResolver(mesaFormSchema),
    defaultValues: { numero: '', capacidade: '', status: 'LIVRE' },
  })

  const categoriaForm = useForm<z.infer<typeof categoriaFormSchema>>({
    resolver: zodResolver(categoriaFormSchema),
    defaultValues: { nome: '', ordemExibicao: '0' },
  })

  const itemForm = useForm<z.infer<typeof itemCardapioFormSchema>>({
    resolver: zodResolver(itemCardapioFormSchema),
    defaultValues: { nome: '', descricao: '', preco: '', categoriaId: '', imagem: undefined },
  })

  useEffect(() => { carregarCategorias() }, [])

  async function carregarCategorias() {
    try {
      const response = await api.get('/categorias')
      setCategorias(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  function flash(set: (v: string) => void, msg: string) {
    set(msg)
    setTimeout(() => set(''), 3000)
  }

  async function handleUserSubmit(values: z.infer<typeof userFormSchema>) {
    if (!user?.estabelecimentoId) return alert('Não foi possível identificar o estabelecimento.')
    try {
      await api.post('/usuarios', { ...values, estabelecimentoId: user.estabelecimentoId })
      userForm.reset({ nome: '', email: '', senha: '', perfil: 'GARCOM' })
      flash(setUserSuccessMessage, 'Perfil criado com sucesso.')
    } catch {
      alert('Não foi possível criar o perfil.')
    }
  }

  async function handleMesaSubmit(values: z.infer<typeof mesaFormSchema>) {
    if (!user?.estabelecimentoId) return alert('Não foi possível identificar o estabelecimento.')
    try {
      await api.post('/mesas', {
        numero: Number(values.numero),
        capacidade: Number(values.capacidade),
        status: values.status,
        estabelecimentoId: user.estabelecimentoId,
      })
      mesaForm.reset({ numero: '', capacidade: '', status: 'LIVRE' })
      flash(setMesaSuccessMessage, 'Mesa criada com sucesso.')
    } catch {
      alert('Não foi possível criar a mesa.')
    }
  }

  async function handleCategoriaSubmit(values: z.infer<typeof categoriaFormSchema>) {
    try {
      await api.post('/categorias', { nome: values.nome, ordemExibicao: Number(values.ordemExibicao) })
      categoriaForm.reset({ nome: '', ordemExibicao: '0' })
      flash(setCategoriaSuccessMessage, 'Categoria criada com sucesso.')
      carregarCategorias()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Não foi possível criar a categoria.')
    }
  }

  async function handleItemSubmit(values: z.infer<typeof itemCardapioFormSchema>) {
    const formData = new FormData()
    formData.append('nome', values.nome)
    formData.append('descricao', values.descricao || '')
    formData.append('preco', values.preco)
    formData.append('categoriaId', values.categoriaId)
    if (values.imagem) formData.append('imagem', values.imagem)
    try {
      await api.post('/itens', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      itemForm.reset({ nome: '', descricao: '', preco: '', categoriaId: '', imagem: undefined })
      setImagemPreview('')
      flash(setItemSuccessMessage, 'Item criado com sucesso.')
      carregarCategorias()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Não foi possível criar o item.')
    }
  }

  function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      itemForm.setValue('imagem', file)
      const reader = new FileReader()
      reader.onloadend = () => setImagemPreview(reader.result as string)
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
        <div className="flex gap-6 items-start">

          {/* ── Sidebar vertical ── */}
          <nav className="w-56 shrink-0 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {navItems.map((item, i) => {
              const isActive = activeTab === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                    i !== navItems.length - 1 ? 'border-b border-border' : '',
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'text-foreground hover:bg-muted/60',
                  ].join(' ')}
                >
                  <span className={isActive ? 'text-white' : 'text-muted-foreground'}>
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{item.label}</p>
                    <p className={[
                      'text-xs leading-snug mt-0.5 truncate',
                      isActive ? 'text-emerald-100' : 'text-muted-foreground',
                    ].join(' ')}>
                      {item.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* ── Form panel ── */}
          <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm max-w-lg">

            {/* USUÁRIOS */}
            {activeTab === 'usuarios' && (
              <>
                <FormPanelHeader
                  icon={<Users className="h-5 w-5" />}
                  title="Cadastrar usuário"
                  description="Apenas administradores podem criar novos perfis de admin, gerente e garçom."
                />
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(handleUserSubmit)} className="space-y-4">
                    <FormField control={userForm.control} name="nome" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl><Input placeholder="Nome do usuário" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={userForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl><Input placeholder="usuario@exemplo.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={userForm.control} name="senha" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={userForm.control} name="perfil" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfil</FormLabel>
                        <FormControl>
                          <select className={inputCls} {...field}>
                            <option value="ADMIN">Admin</option>
                            <option value="GERENTE">Gerente</option>
                            <option value="GARCOM">Garçom</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white" disabled={userForm.formState.isSubmitting}>
                      <Plus className="h-4 w-4 mr-1.5" />
                      {userForm.formState.isSubmitting ? 'Criando...' : 'Criar perfil'}
                    </Button>
                  </form>
                </Form>
              </>
            )}

            {/* MESAS */}
            {activeTab === 'mesas' && (
              <>
                <FormPanelHeader
                  icon={<TableProperties className="h-5 w-5" />}
                  title="Cadastrar mesa"
                  description="Informe o número, capacidade e status inicial da mesa."
                />
                <Form {...mesaForm}>
                  <form onSubmit={mesaForm.handleSubmit(handleMesaSubmit)} className="space-y-4">
                    <FormField control={mesaForm.control} name="numero" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da mesa</FormLabel>
                        <FormControl><Input type="number" min="1" placeholder="Ex.: 12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={mesaForm.control} name="capacidade" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade</FormLabel>
                        <FormControl><Input type="number" min="1" placeholder="Ex.: 4" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={mesaForm.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status inicial</FormLabel>
                        <FormControl>
                          <select className={inputCls} {...field}>
                            {mesaStatusOptions.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white" disabled={mesaForm.formState.isSubmitting}>
                      <Plus className="h-4 w-4 mr-1.5" />
                      {mesaForm.formState.isSubmitting ? 'Criando...' : 'Criar mesa'}
                    </Button>
                  </form>
                </Form>
              </>
            )}

            {/* CATEGORIAS */}
            {activeTab === 'categorias' && (
              <>
                <FormPanelHeader
                  icon={<Tag className="h-5 w-5" />}
                  title="Cadastrar categoria"
                  description="Crie categorias para organizar os itens do cardápio (Ex.: Frios, Churrasco, Bebidas)."
                />
                <Form {...categoriaForm}>
                  <form onSubmit={categoriaForm.handleSubmit(handleCategoriaSubmit)} className="space-y-4">
                    <FormField control={categoriaForm.control} name="nome" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da categoria</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Ex.: Frios, Churrasco, Bebidas" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={categoriaForm.control} name="ordemExibicao" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem de exibição</FormLabel>
                        <FormControl><Input type="number" min="0" placeholder="0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-700">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      A ordem define a posição da categoria no cardápio.
                    </div>
                    <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white" disabled={categoriaForm.formState.isSubmitting}>
                      <Plus className="h-4 w-4 mr-1.5" />
                      {categoriaForm.formState.isSubmitting ? 'Criando...' : 'Criar categoria'}
                    </Button>
                  </form>
                </Form>
              </>
            )}

            {/* ITENS */}
            {activeTab === 'itens' && (
              <>
                <FormPanelHeader
                  icon={<UtensilsCrossed className="h-5 w-5" />}
                  title="Cadastrar item do cardápio"
                  description="Adicione itens com nome, descrição, preço e imagem."
                />
                <Form {...itemForm}>
                  <form onSubmit={itemForm.handleSubmit(handleItemSubmit)} className="space-y-4">
                    <FormField control={itemForm.control} name="categoriaId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select className={inputCls} {...field}>
                            <option value="">Selecione uma categoria</option>
                            {categorias.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={itemForm.control} name="nome" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do item</FormLabel>
                        <FormControl><Input placeholder="Ex.: Filé mignon grelhado" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={itemForm.control} name="descricao" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl><Textarea placeholder="Descreva o item do cardápio..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={itemForm.control} name="preco" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl><Input placeholder="Ex.: 45.90" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormItem>
                      <FormLabel>Imagem</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handleImagemChange} />
                      </FormControl>
                    </FormItem>
                    {imagemPreview && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Preview:</p>
                        <img src={imagemPreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-border" />
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white" disabled={itemForm.formState.isSubmitting}>
                      <Plus className="h-4 w-4 mr-1.5" />
                      {itemForm.formState.isSubmitting ? 'Criando...' : 'Criar item'}
                    </Button>
                  </form>
                </Form>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}