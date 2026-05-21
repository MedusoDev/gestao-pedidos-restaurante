import { useContext, useState } from 'react'
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

const mesaStatusOptions = [
  { value: 'LIVRE', label: 'Livre' },
  { value: 'OCUPADA', label: 'Ocupada' },
  { value: 'RESERVADA', label: 'Reservada' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
] as const

export function Register() {
  const { user } = useContext(AuthContext)
  const [userSuccessMessage, setUserSuccessMessage] = useState('')
  const [mesaSuccessMessage, setMesaSuccessMessage] = useState('')

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
        status: values.status,
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

  return (
          <>
        <Notification
          message={userSuccessMessage}
          type="success"
        />
        <Notification
          message={mesaSuccessMessage}
          type="success"
        />

  <div className="min-h-full bg-muted/30 p-8">
    <div className="min-h-full bg-muted/30 p-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Registro de usuários</CardTitle>
            <CardDescription>
              Apenas administradores podem criar novos perfis de admin, gerente e garçom.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Sessão atual: <span className="font-medium text-foreground">{user?.nome}</span>
            </div>

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

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Registro de mesas</CardTitle>
            <CardDescription>
              Cadastre as mesas do estabelecimento com número, capacidade e status inicial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Estabelecimento: <span className="font-medium text-foreground">{user?.estabelecimentoNome}</span>
            </div>

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
      </div>
    </div>
      </div>
  </>
  )
}