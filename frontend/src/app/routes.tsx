import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Register } from './pages/Register'
import { Mesas } from './pages/Mesas'
import { Menu } from './pages/Menu'
import { Auth } from './pages/Auth'
import { PublicMenu } from './pages/PublicMenu'
import { QRCodeManager } from './pages/QRCodeManager'
import { Pedidos } from './pages/Pedidos'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'

import { SuperAdminLayout } from './layout/SuperAdminLayout'
import { SuperAdminDashboard } from './pages/SuperAdminDashboard'
import { SuperAdminUsers } from './pages/SuperAdminUsers'

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

const AdminRoute = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const isAdminOrSuper = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  return isAdminOrSuper ? <Outlet /> : <Navigate to="/dashboard" replace />
}

const SuperAdminRoute = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return user?.role === 'SUPER_ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Auth,
  },
  // ROTA PÚBLICA: Cardápio por QR Code
  {
    path: '/cardapio/:estabelecimentoId',
    Component: PublicMenu,
  },
  {
    path: '/superadmin',
    element: <SuperAdminRoute />,
    children: [
      {
        element: <SuperAdminLayout />,
        children: [
          { index: true, Component: SuperAdminDashboard },
          { path: 'usuarios', Component: SuperAdminUsers },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, Component: Dashboard },
          { path: 'pedidos', Component: Pedidos },
          { path: 'configuracoes', Component: Settings },
          { path: 'cardapio', Component: Menu },
          { path: 'qrcode', Component: QRCodeManager },
          {
            path: 'registro',
            element: <AdminRoute />,
            children: [{ index: true, Component: Register }],
          },
          {
            path: 'mesas',
            element: <AdminRoute />,
            children: [{ index: true, Component: Mesas }],
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
