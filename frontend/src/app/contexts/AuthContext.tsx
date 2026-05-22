import { createContext, ReactNode, useEffect, useState } from 'react'

interface AuthUser {
  id: string
  nome: string
  email: string
  role: string
  estabelecimentoId?: string
  estabelecimentoNome?: string
}

interface AuthContextData {
  isAuthenticated: boolean
  user: AuthUser | null
  signIn: (token: string, user: AuthUser) => void
  signOut: () => void
  updateUser: (user: AuthUser) => void
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem('@gestao-pedidos:user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const isAuthenticated = !!user

  function signIn(token: string, user: AuthUser) {
    localStorage.setItem('@gestao-pedidos:token', token)
    localStorage.setItem('@gestao-pedidos:user', JSON.stringify(user))
    setUser(user)
  }

  function signOut() {
    localStorage.removeItem('@gestao-pedidos:token')
    localStorage.removeItem('@gestao-pedidos:user')
    setUser(null)
  }

  function updateUser(updatedUser: AuthUser) {
    localStorage.setItem('@gestao-pedidos:user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
