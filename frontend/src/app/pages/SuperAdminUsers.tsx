import { useState, useEffect } from "react";
import { Plus, User, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "../components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Estabelecimento { id: string; nome: string; }
interface UsuarioAdmin {
  id: string; nome: string; email: string; role: string; estabelecimentoNome: string;
}

const roleConfig: Record<string, string> = {
  SUPER_ADMIN: "bg-[#2373ab]/10 text-[#114d77]",
  ADMIN:       "bg-[#93cc4c]/10 text-[#3a6312]",
  GERENTE:     "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  GARCOM:      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  perfil: z.string().min(1, "Selecione o perfil do usuário"),
  estabelecimentoId: z.string().optional(),
});

export function SuperAdminUsers() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("TODOS");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  // ✅ NOVO: estado para confirmação de exclusão
  const [deleteTarget, setDeleteTarget] = useState<UsuarioAdmin | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", senha: "", perfil: "ADMIN", estabelecimentoId: "" },
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const estabRes = await api.get("/estabelecimentos");
      setEstabelecimentos(estabRes.data);
      const usersRes = await api.get("/usuarios");
      setUsuarios(usersRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.perfil !== "SUPER_ADMIN" && !values.estabelecimentoId) {
        alert("Selecione um estabelecimento para este usuário.");
        return;
      }
      await api.post("/usuarios", values);
      await fetchData();
      setIsAddOpen(false);
      form.reset();
    } catch {
      alert("Erro ao criar usuário. Verifique se o e-mail já existe.");
    }
  };

  // ✅ NOVO: executa a exclusão após confirmação
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/usuarios/${deleteTarget.id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch {
      alert("Erro ao deletar usuário.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = usuarios.filter((u) => {
    const matchesSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "TODOS" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <User className="w-6 h-6 text-[#114d77]" />
            Registros de usuários
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Crie administradores vinculados a estabelecimentos
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2373ab] hover:bg-[#0d3d61] text-white border-0 gap-2 rounded-xl px-5">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo Usuário</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl><Input placeholder="João da Silva" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (login)</FormLabel>
                    <FormControl><Input placeholder="joao@gmail.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="senha" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha temporária</FormLabel>
                    <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="perfil" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione o perfil..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="GERENTE">Gerente</SelectItem>
                        <SelectItem value="GARCOM">Garçom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="estabelecimentoId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estabelecimento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={form.watch("perfil") === "SUPER_ADMIN"}
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estabelecimentos.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#2373ab] hover:bg-[#0d3d61] text-white border-0">
                    Cadastrar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ✅ Filters — busca à esquerda, filtro à direita */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
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

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-8 h-8 border-4 border-[#2373ab] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((usuario) => (
            <Card key={usuario.id} className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#2373ab]/10 flex items-center justify-center text-[#2373ab] font-semibold text-base">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </div>
                  {/* ✅ Agora abre o AlertDialog em vez de deletar direto */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1 -mr-1"
                    onClick={() => setDeleteTarget(usuario)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-base font-medium text-foreground truncate">{usuario.nome}</p>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{usuario.email}</p>

                <div className="mt-3 text-sm bg-muted/50 p-2.5 rounded-xl">
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Perfil</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig[usuario.role] ?? "bg-muted text-muted-foreground"}`}>
                    {usuario.role}
                  </span>
                </div>

                <div className="mt-2 text-sm bg-muted/50 p-2.5 rounded-xl">
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Estabelecimento</span>
                  <span className="text-sm text-foreground">{usuario.estabelecimentoNome || "Nenhum (Global)"}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Nenhum administrador encontrado.</p>
              <p className="text-xs text-muted-foreground mt-1">Tente ajustar os filtros de busca.</p>
            </div>
          )}
        </div>
      )}

      {/* ✅ AlertDialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{deleteTarget?.nome}</strong>? Essa ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-colors">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white border-0"
              onClick={handleDelete}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}