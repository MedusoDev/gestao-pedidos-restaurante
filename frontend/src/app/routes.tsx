import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Register } from './pages/Register'
import { Auth } from './pages/Auth'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

const AdminRoute = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Auth,
  },
  {
    path: '/dashboard',
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, Component: Dashboard },
          { path: 'configuracoes', Component: Settings },
          {
            path: 'registro',
            element: <AdminRoute />,
            children: [{ index: true, Component: Register }],
          },
        ],
      },
    ],
  },
  // Redireciona qualquer outra rota não encontrada para a raiz (login)
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
