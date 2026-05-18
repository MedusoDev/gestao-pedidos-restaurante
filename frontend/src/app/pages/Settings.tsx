import { useContext } from "react";
import { Bell, Lock, Store, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AuthContext } from "../contexts/AuthContext";
import { EstablishmentOverview } from "../components/EstablishmentOverview";

const settingsSections = [
  {
    title: "Notificações",
    description: "Alertas de pedidos novos e mudanças de status.",
    icon: Bell,
  },
  {
    title: "Acessos",
    description: "Perfis de usuário e permissões por função.",
    icon: Users,
  },
  {
    title: "Segurança",
    description: "Autenticação e proteção da conta do estabelecimento.",
    icon: Lock,
  },
];

export function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Configurações</p>
        <h1 className="mt-3 text-3xl font-bold">
          {user?.estabelecimentoNome || "Estabelecimento"}
        </h1>
        <p className="mt-2 max-w-2xl text-white/75">
          Gerencie as configurações e preferências do seu estabelecimento de forma centralizada.
        </p>
      </div>

      <EstablishmentOverview />

      <div className="grid gap-4 md:grid-cols-3">
        {settingsSections.map((section) => (
          <Card key={section.title} className="rounded-2xl border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <section.icon className="h-5 w-5 text-accent" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  );
}
