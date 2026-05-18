import { useContext, useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, Clock3, ClipboardList, RefreshCw, TrendingUp } from "lucide-react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AuthContext } from "../contexts/AuthContext";

type Mesa = {
  id: string;
  numero: number;
  capacidade: number;
  status: "LIVRE" | "OCUPADA" | "RESERVADA" | "MANUTENCAO";
}

const statusLabels = {
  LIVRE: "Livre",
  OCUPADA: "Ocupada",
  RESERVADA: "Reservada",
  MANUTENCAO: "Manutenção",
} as const

const statusStyles = {
  LIVRE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  OCUPADA: "border-rose-200 bg-rose-50 text-rose-700",
  RESERVADA: "border-amber-200 bg-amber-50 text-amber-700",
  MANUTENCAO: "border-slate-200 bg-slate-100 text-slate-700",
} as const

export function Mesas() {
  const { user } = useContext(AuthContext);
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadMesas() {
    if (!user?.estabelecimentoId) {
      setErrorMessage('Não foi possível identificar o estabelecimento.')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage('')

      const response = await api.get('/mesas')
      setMesas(response.data.mesas ?? [])
    } catch (error) {
      console.error('Falha ao carregar mesas:', error)
      setErrorMessage('Não foi possível carregar as mesas cadastradas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMesas()
  }, [user?.estabelecimentoId])

  const totals = useMemo(() => {
    return mesas.reduce(
      (accumulator, mesa) => {
        accumulator[mesa.status] += 1
        return accumulator
      },
      { LIVRE: 0, OCUPADA: 0, RESERVADA: 0, MANUTENCAO: 0 },
    )
  }, [mesas])

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Mesas</p>
        <h1 className="mt-3 text-3xl font-bold">
          {user?.estabelecimentoNome || "Estabelecimento"}
        </h1>
        <p className="mt-2 max-w-2xl text-white/75">
          Painel de mesas do estabelecimento, com resumo e atalhos para acompanhar a operação.
        </p>
      </div>


      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Resumo das mesas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Mesas livres</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{totals.LIVRE}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Mesas ocupadas</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{totals.OCUPADA}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Mesas reservadas</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{totals.RESERVADA}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Em manutenção</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{totals.MANUTENCAO}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-accent" />
            Lista de mesas
          </CardTitle>
          <button
            type="button"
            onClick={loadMesas}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando mesas...</p>
          ) : mesas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma mesa cadastrada ainda.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mesas.map((mesa) => (
                <div
                  key={mesa.id}
                  className={`aspect-square rounded-2xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 ${statusStyles[mesa.status]}`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-70">
                        Mesa
                      </p>
                      <h3 className="mt-2 text-3xl font-bold">{mesa.numero}</h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Status: {statusLabels[mesa.status]}
                      </p>
                      <p className="text-sm opacity-80">Capacidade: {mesa.capacidade} pessoas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
