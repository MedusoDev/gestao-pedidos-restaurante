import { useState, useEffect, useContext } from "react";
import { Plus, Trash2, Building, Search, ArrowRight, MoreVertical } from "lucide-react";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import InputMask from "react-input-mask";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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

// Função para formatar o CNPJ
const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export function SuperAdminDashboard() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      endereco: "",
      telefone: "",
    },
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

  useEffect(() => {
    fetchEstabelecimentos();
  }, []);

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post("/estabelecimentos", {
        ...values,
        cnpj: values.cnpj.replace(/[^\d]/g, '') // Envia somente os números
      });
      
      setEstabelecimentos((prev) => [...prev, response.data]);
      
      setIsAddOpen(false);
      form.reset();
    } catch (err) {
      console.error("Erro ao criar", err);
      // Adicionar notificação de erro para o usuário aqui
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este estabelecimento? Isso não poderá ser desfeito.")) return;
    try {
      await api.delete(`/estabelecimentos/${id}`);
      setEstabelecimentos((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error("Erro ao deletar", err);
      alert(err.response?.data?.error || "Erro ao excluir estabelecimento.");
    }
  };

  const handleAccess = (estabelecimento: Estabelecimento) => {
    if (user) {
      const updatedUser = {
        ...user,
        estabelecimentoId: estabelecimento.id,
        estabelecimentoNome: estabelecimento.nome,
      };
      updateUser(updatedUser);
      navigate("/dashboard");
    }
  };

  const filtered = estabelecimentos.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase()) ||
    e.cnpj.includes(search)
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building className="w-8 h-8 text-primary" />
            Estabelecimentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as empresas cadastradas na plataforma
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
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
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Restaurante Saboroso..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <InputMask
                          mask="99.999.999/9999-99"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        >
                          {(inputProps: any) => <Input {...inputProps} placeholder="00.000.000/0000-00" />}
                        </InputMask>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua 1, Centro, Cidade..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        >
                           {(inputProps: any) => <Input {...inputProps} placeholder="(99) 99999-9999" />}
                        </InputMask>
                      </FormControl>
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

      <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            className="pl-9 bg-input-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((estab) => (
            <Card key={estab.id} className="relative overflow-hidden group hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl mb-4">
                    {estab.nome.charAt(0)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        onClick={() => handleDelete(estab.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="line-clamp-1">{estab.nome}</CardTitle>
                <CardDescription>CNPJ: {formatCNPJ(estab.cnpj)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button 
                    variant="default" 
                    className="w-full gap-2 shadow-sm"
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
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Nenhum estabelecimento encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}