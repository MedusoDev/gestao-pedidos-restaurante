import { useContext, useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  Building2,
  Moon,
  Sun,
  Bell,
  UtensilsCrossed,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { AuthContext } from "../contexts/AuthContext";

export function SuperAdminLayout() {
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
    { icon: Building2, label: "Estabelecimentos", path: "/superadmin" },
    { icon: Users, label: "Registros", path: "/superadmin/usuarios" },
  ];

  return (
    <div className="flex h-screen bg-background font-['Inter']">
      {/* Sidebar */}
      <aside className="w-[280px] bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Rápido Pedidos</h1>
              <span className="text-xs text-primary/80 font-semibold tracking-wider">SUPER ADMIN</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/superadmin"}
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
          <div className="flex items-center justify-end">
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
                    {user?.nome?.slice(0, 2).toUpperCase() || "SA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.nome || "Super Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrador Geral</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
