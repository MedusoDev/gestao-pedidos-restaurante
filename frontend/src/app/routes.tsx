import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Kitchen } from "./pages/Kitchen";
import { Menu } from "./pages/Menu";
import { Tables } from "./pages/Tables";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pedidos", Component: Orders },
      { path: "cardapio", Component: Menu },
      { path: "mesas", Component: Tables },
      { path: "cozinha", Component: Kitchen },
      { path: "relatorios", Component: Reports },
      { path: "configuracoes", Component: Settings },
    ],
  },
]);
