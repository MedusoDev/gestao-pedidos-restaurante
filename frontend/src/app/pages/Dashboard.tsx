import { useContext } from "react";
import { BarChart3, Clock3, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AuthContext } from "../contexts/AuthContext";
import { EstablishmentOverview } from "../components/EstablishmentOverview";

const metrics = [
  {
    title: "Pedidos hoje",
    value: "0",
    description: "Dados consolidados do estabelecimento",
    icon: ClipboardList,
  },
  {
    title: "Tempo médio",
    value: "0",
    description: "Média de preparo em tempo real",
    icon: Clock3,
  },
  {
    title: "Crescimento",
    value: "0",
    description: "Comparado com o período anterior",
    icon: TrendingUp,
  },
];

export function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold">
          {user?.estabelecimentoNome || "Estabelecimento"}
        </h1>
        <p className="mt-2 max-w-2xl text-white/75">
          Visão centralizada dos números do restaurante, com as principais informações do
          estabelecimento e atalhos de operação em um único lugar.
        </p>
      </div>

      <EstablishmentOverview />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="rounded-2xl border-border shadow-sm">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <h3 className="mt-1 text-3xl font-bold text-foreground">{metric.value}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p>
              </div>
              <div className="rounded-2xl bg-accent/10 p-3 text-accent">
                <metric.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Resumo operacional
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Pedidos pendentes</p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Pedidos em preparação</p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
