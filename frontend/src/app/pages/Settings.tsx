import { useContext, useEffect, useState } from "react";
import { Building2, Database, PlugZap, Users } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "@/lib/axios";

import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EstabelecimentoData {
  id: string;
  nome: string;
  cnpj: string;
  telefone?: string;
  endereco: string;
}

interface UsuarioEstab {
  id: string;
  nome: string;
  email: string;
  role: string;
  estabelecimentoId: string;
  estabelecimentoNome: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCNPJ = (cnpj: string) =>
  cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

// ─── Role config ──────────────────────────────────────────────────────────────

const roleConfig: Record<string, string> = {
  SUPER_ADMIN: "bg-[#2373ab]/10 text-[#114d77]",
  ADMIN: "bg-[#93cc4c]/10 text-[#3a6312]",
  GERENTE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  GARCOM: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

// ─── Tab: Dados do restaurante (somente leitura) ──────────────────────────────

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground bg-muted/50 rounded-xl px-3 py-2.5 min-h-[38px] flex items-center">
        {value || <span className="text-muted-foreground/50 italic">Não informado</span>}
      </span>
    </div>
  );
}

function TabDados({
  nome,
  estabelecimentoId,
}: {
  nome?: string;
  estabelecimentoId?: string;
}) {
  const [dados, setDados] = useState<Omit<EstabelecimentoData, "nome"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!estabelecimentoId) return;
    (async () => {
      try {
        setIsLoading(true);
        // Reutiliza a mesma rota do SuperAdminDashboard e filtra pelo id
        const res = await api.get("/estabelecimentos");
        const lista: EstabelecimentoData[] = res.data;
        const encontrado = lista.find((e) => e.id === estabelecimentoId) ?? null;
        setDados(encontrado);
      } catch (err) {
        console.error("Erro ao buscar dados do estabelecimento", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [estabelecimentoId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <div className="w-6 h-6 border-4 border-[#2373ab] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Dados do estabelecimento não encontrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
        Informações gerais
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* Nome vem do AuthContext, igual ao hero */}
        <InfoField label="Nome do estabelecimento" value={nome ?? ""} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField
          label="CNPJ"
          value={dados.cnpj ? formatCNPJ(dados.cnpj.replace(/[^\d]/g, "")) : ""}
        />
        <InfoField label="Telefone" value={dados.telefone ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InfoField label="Endereço completo" value={dados.endereco} />
      </div>
    </div>
  );
}

// ─── Tab: Integrações ─────────────────────────────────────────────────────────

interface IntegrationCardProps {
  title: string;
  icon: React.ReactNode;
  status: "ativa" | "parcial" | "inativa" | "conectado";
  details: { label: string; value: string }[];
}

function statusBadge(status: IntegrationCardProps["status"]) {
  const map: Record<
    IntegrationCardProps["status"],
    { label: string; className: string }
  > = {
    ativa:     { label: "Ativa",      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    conectado: { label: "Conectado",  className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    parcial:   { label: "Parcial",    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    inativa:   { label: "Inativa",    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function IntegrationCard({ title, icon, status, details }: IntegrationCardProps) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            {icon}
            {title}
          </div>
          {statusBadge(status)}
        </div>
        <div className="space-y-1.5">
          {details.map((d) => (
            <div key={d.label} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{d.label}</span>
              <span className="text-foreground font-mono">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TabIntegracoes() {
  return (
    <div className="space-y-6">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
        Status dos serviços
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IntegrationCard
          title="Licença do sistema"
          icon={<PlugZap className="w-4 h-4 text-green-600" />}
          status="ativa"
          details={[
            { label: "Plano", value: "Pro" },
            { label: "Validade", value: "31/12/2025" },
            { label: "Renovação", value: "Automática" },
          ]}
        />

        <IntegrationCard
          title="Banco de dados"
          icon={<Database className="w-4 h-4 text-[#2373ab]" />}
          status="conectado"
          details={[
            { label: "Host", value: "proxy.rlwy.net" },
            { label: "Porta", value: "3333" },
            { label: "Latência", value: "4 ms" },
          ]}
        />
      </div>
    </div>
  );
}

// ─── Tab: Usuários ────────────────────────────────────────────────────────────

function TabUsuarios({ estabelecimentoId }: { estabelecimentoId?: string }) {
  const [usuarios, setUsuarios] = useState<UsuarioEstab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/usuarios");
        const data: UsuarioEstab[] = res.data;
        setUsuarios(
          estabelecimentoId
            ? data.filter((u) => u.estabelecimentoId === estabelecimentoId)
            : data
        );
      } catch (err) {
        console.error("Erro ao buscar usuários", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [estabelecimentoId]);

  const filtered = usuarios.filter((u) => {
    const matchSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "TODOS" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <div className="w-6 h-6 border-4 border-[#2373ab] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="w-full md:w-52">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os perfis</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="GERENTE">Gerente</SelectItem>
              <SelectItem value="GARCOM">Garçom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
        Membros com acesso
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <Card key={u.id} className="rounded-2xl border-border shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2373ab]/10 flex items-center justify-center text-[#2373ab] font-semibold text-sm flex-shrink-0">
                  {u.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="bg-muted/50 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Perfil</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      roleConfig[u.role] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                <div className="bg-muted/50 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Estabelecimento</span>
                  <span className="text-xs text-foreground truncate max-w-[120px] text-right">
                    {u.estabelecimentoNome || "Global"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhum usuário encontrado.</p>
            <p className="text-xs text-muted-foreground mt-1">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 p-8">
      {/* Tabs */}
      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="mb-6 bg-muted/50 rounded-xl p-1 w-full md:w-auto">
          <TabsTrigger value="dados" className="rounded-lg gap-2 text-sm">
            <Building2 className="w-4 h-4" />
            Dados do restaurante
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="rounded-lg gap-2 text-sm">
            <PlugZap className="w-4 h-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="rounded-lg gap-2 text-sm">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <TabDados nome={user?.estabelecimentoNome} estabelecimentoId={user?.estabelecimentoId} />
        </TabsContent>

        <TabsContent value="integracoes">
          <TabIntegracoes />
        </TabsContent>

        <TabsContent value="usuarios">
          <TabUsuarios estabelecimentoId={user?.estabelecimentoId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}