import { useContext, useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  UserPlus,
  Table2,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  UtensilsCrossed,
  ArrowLeftCircle,
  QrCode,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { AuthContext } from "../contexts/AuthContext";

export function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(true);
  const { signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Settings, label: "Configurações", path: "/dashboard/configuracoes" },
    { icon: UtensilsCrossed, label: "Cardápio", path: "/dashboard/cardapio" },
    { icon: QrCode, label: "QR Code", path: "/dashboard/qrcode" },
    ...(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? [
          { icon: UserPlus, label: "Registro", path: "/dashboard/registro" },
          { icon: Table2, label: "Mesas", path: "/dashboard/mesas" },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-background font-['Inter']">
      {/* Sidebar */}
      <aside className="w-[280px] bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Rápido Pedidos</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/30 rounded-xl p-4 mb-3">
            <p className="text-sm text-sidebar-foreground/70 mb-1">
              Restaurante
            </p>
            <p className="font-semibold text-sidebar-foreground line-clamp-1">
              {user?.estabelecimentoNome || "Estabelecimento"}
            </p>
          </div>
          
          {user?.role === "SUPER_ADMIN" && (
            <Button
              variant="outline"
              onClick={() => navigate('/superadmin')}
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 mb-2 border-sidebar-border"
            >
              <ArrowLeftCircle className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos, mesas, produtos..."
                className="pl-10 bg-input-background border-border rounded-xl"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>

              <div className="relative">
                <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                  <Bell className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.nome?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.nome || "Usuário"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.role || "Usuário"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
