import { useState, useEffect, useContext } from "react";
import { Plus, Search, ArrowRight, Building2, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import InputMask from "react-input-mask";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Estabelecimento {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone?: string;
}

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  cnpj: z.string().refine(val => val.replace(/[^\d]/g, '').length === 14, {
    message: "CNPJ deve ter 14 dígitos.",
  }),
  endereco: z.string().min(5, "Endereço é obrigatório"),
  telefone: z.string().optional(),
});

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export function SuperAdminDashboard() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Estabelecimento | null>(null);
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", cnpj: "", endereco: "", telefone: "" },
  });

  const fetchEstabelecimentos = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/estabelecimentos");
      setEstabelecimentos(res.data);
    } catch (err) {
      console.error("Erro ao buscar estabelecimentos", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEstabelecimentos(); }, []);

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post("/estabelecimentos", {
        ...values,
        cnpj: values.cnpj.replace(/[^\d]/g, ''),
      });
      setEstabelecimentos((prev) => [...prev, response.data]);
      setIsAddOpen(false);
      form.reset();
    } catch (err) {
      console.error("Erro ao criar", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/estabelecimentos/${deleteTarget.id}`);
      setEstabelecimentos((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } catch (err: any) {
      console.error("Erro ao deletar", err);
      alert(err.response?.data?.error || "Erro ao excluir estabelecimento.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleAccess = (estabelecimento: Estabelecimento) => {
    if (user) {
      updateUser({ ...user, estabelecimentoId: estabelecimento.id, estabelecimentoNome: estabelecimento.nome });
      navigate("/dashboard");
    }
  };

  const filtered = estabelecimentos.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase()) || e.cnpj.includes(search)
  );

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#114d77]" />
            Estabelecimentos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as empresas cadastradas na plataforma
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2373ab] hover:bg-[#0d3d61] text-white border-0 gap-2 rounded-xl px-5">
              <Plus className="w-4 h-4" />
              Novo Estabelecimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Estabelecimento</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova empresa a usar o sistema.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl><Input placeholder="Restaurante Saboroso..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cnpj" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <InputMask mask="99.999.999/9999-99" value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                        {(inputProps: any) => <Input {...inputProps} placeholder="00.000.000/0000-00" />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endereco" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl><Input placeholder="Rua 1, Centro, Cidade..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                        {(inputProps: any) => <Input {...inputProps} placeholder="(99) 99999-9999" />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                    className="border-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-colors"
                  >
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

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-8 h-8 border-4 border-[#2373ab] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((estab) => (
            <Card
              key={estab.id}
              className="relative rounded-2xl border-border shadow-sm hover:border-[#114d77] transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {/* Avatar inicial */}
                  <div className="w-12 h-12 rounded-2xl bg-[#114d77]/10 flex items-center justify-center mb-3">
                    <span className="text-[#114d77] font-bold text-xl">
                      {estab.nome.charAt(0)}
                    </span>
                  </div>

                  {/* Botão lixeira */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    onClick={() => setDeleteTarget(estab)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <CardTitle className="line-clamp-1 text-base">{estab.nome}</CardTitle>
                <CardDescription className="text-xs">CNPJ: {formatCNPJ(estab.cnpj)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    className="w-full gap-2 rounded-xl bg-[#2373ab] hover:bg-[#0d3d61] text-white border-0 shadow-sm"
                    onClick={() => handleAccess(estab)}
                  >
                    Acessar Painel
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Nenhum estabelecimento encontrado
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cadastre um novo estabelecimento para começar.
              </p>
            </div>
          )}
        </div>
      )}

      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir estabelecimento?</AlertDialogTitle>
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
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}