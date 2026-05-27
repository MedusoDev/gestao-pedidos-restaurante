import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@gestao-pedidos:token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado - fazer logout
      localStorage.removeItem('@gestao-pedidos:token')
      localStorage.removeItem('@gestao-pedidos:user')
      // Redirecionar para login
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
