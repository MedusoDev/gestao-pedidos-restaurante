import { LoginForm } from '@/app/components/LoginForm'

export function Auth() {
  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo — formulário */}
      <div className="flex w-full flex-col items-center justify-center px-8 md:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
               <img
                src="https://6a11010be92048e6f022f1f5.imgix.net/pedido-certo.png"
                alt="logo-pedido-certo"
                className="h-25 w-auto object-cover"
              />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-500">Boas-vindas</h1>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Lado direito — imagem */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://6a11010be92048e6f022f1f5.imgix.net/pedido-certo-imagem-inicial.png"
          alt="Restaurante"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}