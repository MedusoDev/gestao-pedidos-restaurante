import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '@/lib/axios'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Loader2, X, Info } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
})

export function LoginForm() {
  const { signIn } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await api.post('/login', {
        email: values.email,
        senha: values.password,
      })

      const { token, user } = response.data
      signIn(token, user)

      if (user.role === 'SUPER_ADMIN') {
        navigate('/superadmin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Falha no login:', error)
      alert('E-mail ou senha inválidos.')
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Campo e-mail */}
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Insira seu e-mail"
            {...form.register('email')}
            className="w-full rounded-lg border border-gray-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#2373ab] focus:ring-1 focus:ring-[#2373ab]"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Campo senha */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Insira sua senha"
            {...form.register('password')}
            className="w-full rounded-lg border border-gray-200 py-3 pl-9 pr-10 text-sm outline-none transition focus:border-[#2373ab] focus:ring-1 focus:ring-[#2373ab]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Botão entrar */}
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2373ab] py-3 text-sm font-semibold text-white transition hover:bg-[#114d77] disabled:opacity-70"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>

        {/* Esqueceu a senha */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-sm text-gray-400 underline-offset-2 hover:underline"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </form>

      {/* Modal — Esqueceu sua senha */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

            {/* Botão fechar */}
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            {/* Ícone */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Info size={22} className="text-[#2373ab]" />
            </div>

            {/* Conteúdo */}
            <h2 className="mb-1 text-base font-semibold text-gray-700">
              Recuperação de senha
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Para redefinir sua senha, entre em contato com um{' '}
              <span className="font-medium text-[#2373ab]">administrador do Pedido Certo</span>.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Suporte:{' '}
              <a
                href="mailto:suporte@pedidocerto.com.br"
                className="font-medium text-[#2373ab] hover:underline"
              >
                suporte@pedidocerto.com.br
              </a>
            </p>

            {/* Botão fechar */}
            <button
              onClick={() => setShowForgotModal(false)}
              className="mt-5 w-full rounded-lg bg-[#2373ab] py-2.5 text-sm font-semibold text-white transition hover:bg-[#114d77]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}