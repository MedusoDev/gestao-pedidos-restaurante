import { useState, useEffect } from "react";
import { Plus, User, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Estabelecimento {
  id: string;
  nome: string;
}

interface UsuarioAdmin {
  id: string;
  nome: string;
  email: string;
  role: string;
  estabelecimentoNome: string;
}

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      perfil: "ADMIN",
      estabelecimentoId: "",
    },
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.perfil !== "SUPER_ADMIN" && !values.estabelecimentoId) {
        alert("Selecione um estabelecimento para este usuário.");
        return;
      }

      await api.post("/usuarios", values);
      
      await fetchData(); // Atualiza a lista após criar

      setIsAddOpen(false);
      form.reset();
    } catch (err) {
      console.error("Erro ao criar usuário", err);
      alert("Erro ao criar usuário. Verifique se o e-mail já existe.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erro ao deletar usuário", err);
      alert("Erro ao deletar usuário. Super Admins não podem ser excluídos por aqui ou ele possui dependências.");
    }
  };

  const filtered = usuarios.filter((u) => {
    const matchesSearch = u.nome.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "TODOS" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Registros de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Crie administradores vinculados a estabelecimentos
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Administrador</DialogTitle>
              <DialogDescription>
                Este usuário terá acesso total ao painel do estabelecimento vinculado.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail (Login)</FormLabel>
                      <FormControl>
                        <Input placeholder="joao@restaurante.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Temporária</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o perfil..." />
                          </SelectTrigger>
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
                  )}
                />

                <FormField
                  control={form.control}
                  name="estabelecimentoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vincular ao Estabelecimento (Opcional p/ Super Admin)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={form.watch('perfil') === 'SUPER_ADMIN'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {estabelecimentos.map(estab => (
                            <SelectItem key={estab.id} value={estab.id}>
                              {estab.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 bg-input-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
           <Select value={roleFilter} onValueChange={setRoleFilter}>
             <SelectTrigger>
               <SelectValue placeholder="Filtrar por perfil" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="TODOS">Todos os Perfis</SelectItem>
               <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
               <SelectItem value="ADMIN">Admin</SelectItem>
               <SelectItem value="GERENTE">Gerente</SelectItem>
               <SelectItem value="GARCOM">Garçom</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((usuario) => (
            <Card key={usuario.id} className="relative overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-foreground font-semibold">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="mt-2 text-lg line-clamp-1">{usuario.nome}</CardTitle>
                <CardDescription className="line-clamp-1">{usuario.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md mb-2">
                  <span className="font-semibold block mb-1">Perfil:</span>
                  {usuario.role}
                </div>
                <div className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">
                  <span className="font-semibold block mb-1">Estabelecimento:</span>
                  {usuario.estabelecimentoNome || "Nenhum (Global)"}
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Nenhum administrador encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}