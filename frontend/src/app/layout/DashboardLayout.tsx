import { useContext, useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  UserPlus,
  Table2,
  Bell,
  Moon,
  Sun,
  LogOut,
  UtensilsCrossed,
  ArrowLeftCircle,
  QrCode,
  Clipboard,
  ChevronDown,
  User,
  Building2,
  ChefHat,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { AuthContext } from "../contexts/AuthContext";

export function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const restaurantMenuItems = [
    { icon: Table2, label: "Mesas", path: "/dashboard/mesas" },
    { icon: UtensilsCrossed, label: "Cardápio", path: "/dashboard/cardapio" },
    { icon: Clipboard, label: "Pedidos", path: "/dashboard/pedidos" },
    { icon: ChefHat, label: "Cozinha", path: "/dashboard/cozinha" },
  ];

  const utilitiesMenuItems = [
    { icon: QrCode, label: "QR Code", path: "/dashboard/qrcode" },
  ];

  const systemMenuItems = [
    { icon: Settings, label: "Configurações", path: "/dashboard/configuracoes" },
    ...(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? [{ icon: UserPlus, label: "Registros", path: "/dashboard/registro" }]
      : []),
  ];

  const NavSection = ({
    title,
    items,
  }: {
    title: string;
    items: { icon: React.ElementType; label: string; path: string }[];
  }) => (
    <div className="mb-4">
      <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
        {title}
      </p>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="font-medium text-sm">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-background font-['Inter']">
      {/* Sidebar */}
      <aside className="w-[260px] bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-lg">
        {/* Logo + Restaurant Name */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            <img
              src="https://6a11010be92048e6f022f1f5.imgix.net/pedido-certo-w/pcw.png"
              alt="logo-pedido-certo"
              className="h-20 w-auto object-cover"
            />
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
          {/* Dashboard standalone */}
          <div className="mb-4">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-sm">Dashboard</span>
            </NavLink>
          </div>

          <NavSection title="Restaurante" items={restaurantMenuItems} />
          <NavSection title="Utilitários" items={utilitiesMenuItems} />
          <NavSection title="Sistema" items={systemMenuItems} />
        </nav>

        {/* Footer */}
          {/* Footer Branding */}
          <div className="px-4 py-3 border-t border-sidebar-border">
            <p className="text-xs text-center text-sidebar-foreground/40">
              Powered by{" "}
              <span className="font-semibold text-sidebar-foreground/60">
                Cablobo
              </span>{" "}
              - 2026
            </p>
          </div>
        <div className="border-t border-sidebar-border space-y-2">
          {user?.role === "SUPER_ADMIN" && (
            <Button
              variant="outline"
              onClick={() => navigate("/superadmin")}
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border-sidebar-border"
            >
              <ArrowLeftCircle className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Restaurant Name Box */}
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl border border-border bg-card">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-semibold text-foreground">
                {user?.estabelecimentoNome || "Estabelecimento"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                  <Bell className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-secondary transition-colors border border-border"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className="text-white text-xs font-semibold"
                      style={{ backgroundColor: "#114d77" }}
                    >
                      {user?.nome?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {user?.nome || "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {user?.role || "Usuário"}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-sm text-foreground">
                        {user?.nome || "Usuário"}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {user.email}
                        </p>
                      )}
                      <span
                        className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ backgroundColor: "#114d77" }}
                      >
                        {user?.role || "Usuário"}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/dashboard/perfil");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Meu Perfil
                      </button>

                      {/* Dark Mode Toggle */}
                      <button
                        onClick={() => {
                          toggleDarkMode();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        {darkMode ? (
                          <Sun className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Moon className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="flex-1 text-left">
                          {darkMode ? "Modo Claro" : "Modo Escuro"}
                        </span>
                        {/* Toggle Switch */}
                        <div
                          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                            darkMode ? "bg-[#114d77]" : "bg-muted"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                              darkMode ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="py-1.5 border-t border-border">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-secondary transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
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
