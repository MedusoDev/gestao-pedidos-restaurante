import { useContext, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { AuthContext } from '../contexts/AuthContext'

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

const formSchema = z.object({
  nome: z.string().min(3, { message: 'Informe o nome completo.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  senha: z.string().min(6, { message: 'A senha precisa ter ao menos 6 caracteres.' }),
  perfil: z.enum(['ADMIN', 'GERENTE', 'GARCOM']),
})

export function Register() {
  const { user } = useContext(AuthContext)
  const [successMessage, setSuccessMessage] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      perfil: 'GARCOM',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSuccessMessage('')

    try {
      await api.post('/usuarios', {
        ...values,
        estabelecimentoId: user?.estabelecimentoId,
      })
      form.reset({
        nome: '',
        email: '',
        senha: '',
        perfil: 'GARCOM',
      })
      setSuccessMessage('Perfil criado com sucesso.')
    } catch (error) {
      console.error('Falha ao criar usuário:', error)
      alert('Não foi possível criar o perfil.')
    }
  }

  return (
    <div className="min-h-full p-8 bg-muted/30">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Registro de usuários</CardTitle>
            <CardDescription>
              Apenas administradores podem criar novos perfis de admin, gerente e garçom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-muted-foreground">
              Sessão atual: <span className="font-medium text-foreground">{user?.nome}</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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

                {successMessage ? (
                  <p className="text-sm font-medium text-green-600">{successMessage}</p>
                ) : null}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Criando...' : 'Criar perfil'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}