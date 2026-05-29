import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Clock, ChefHat, CheckCircle, Truck, User } from "lucide-react";
import { api } from "../../lib/axios";

interface ItemPedido {
  id: string;
  quantidade: number;
  precoUnitario: number;
  observacoes?: string;
  item: {
    id: string;
    nome: string;
    descricao?: string;
    preco: number;
  };
}

interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

interface Delivery {
  id: string;
  nomeCliente: string;
  telefone: string;
  enderecoEntrega: string;
  taxaEntrega: number;
  statusEntrega: string;
}

interface Pedido {
  id: string;
  tipo: "MESA" | "DELIVERY";
  status: string;
  subtotal: number;
  desconto: number;
  gorjeta: number;
  total: number;
  criadoEm: string;
  usuarioId: string;
  mesaId?: string;
  usuario: Usuario;
  mesa?: Mesa;
  itens: ItemPedido[];
  delivery?: Delivery;
}

const statusColors: Record<string, string> = {
  RECEBIDO: "bg-blue-100 text-blue-800",
  EM_PREPARO: "bg-yellow-100 text-yellow-800",
  PRONTO: "bg-green-100 text-green-800",
  ENTREGUE: "bg-gray-100 text-gray-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  RECEBIDO: <Clock className="w-4 h-4" />,
  EM_PREPARO: <ChefHat className="w-4 h-4" />,
  PRONTO: <CheckCircle className="w-4 h-4" />,
  ENTREGUE: <Truck className="w-4 h-4" />,
};

export function ListarPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");
  const [filtroData, setFiltroData] = useState<string>("TODOS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const lastChangeTimeRef = useRef<number>(Date.now());
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const previousPedidosRef = useRef<string>("");

  const setupSmartPolling = () => {
    const poll = async () => {
      await carregarPedidos();
      const timeSinceLastChange = Date.now() - lastChangeTimeRef.current;
      const interval = timeSinceLastChange > 300000 ? 300000 : 30000; // 5min ou 30s
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      intervalIdRef.current = setInterval(poll, interval);
    };
    intervalIdRef.current = setInterval(poll, 300000);
  };

  useEffect(() => {
    carregarPedidos();
    setupSmartPolling();
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [filtroStatus, filtroTipo, filtroData]);

  const detectarMudancas = (novosPedidos: Pedido[]) => {
    const novaString = JSON.stringify(novosPedidos.map(p => ({ id: p.id, status: p.status })));
    if (previousPedidosRef.current !== novaString) {
      previousPedidosRef.current = novaString;
      lastChangeTimeRef.current = Date.now();
      return true;
    }
    return false;
  };

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (filtroStatus && filtroStatus !== "TODOS") params.append("status", filtroStatus);
      if (filtroTipo && filtroTipo !== "TODOS") params.append("tipo", filtroTipo);

      const url = `/pedidos${params.toString() ? "?" + params.toString() : ""}`;
      const response = await api.get(url);
      const novosPedidos = response.data;
      detectarMudancas(novosPedidos);
      setPedidos(novosPedidos);
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error);
      setError(error.response?.data?.error || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (pedidoId: string, novoStatus: string) => {
    try {
      await api.patch(`/pedidos/${pedidoId}/status`, { status: novoStatus });
      
      // Se foi entregue e é uma mesa, liberar a mesa
      if (novoStatus === "ENTREGUE" && selectedPedido?.tipo === "MESA" && selectedPedido?.mesa?.id) {
        try {
          await api.patch(`/mesas/${selectedPedido.mesa.id}`, { status: "LIVRE" });
          console.log("Mesa liberada");
        } catch (mesaError: any) {
          console.error("Erro ao liberar mesa:", mesaError);
        }
      }
      
      carregarPedidos();
      if (selectedPedido?.id === pedidoId) {
        setSelectedPedido(null);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      const mensagemErro = error.response?.data?.error || "Erro ao atualizar status do pedido";
      setError(mensagemErro);
      alert(mensagemErro);
    }
  };

  const atualizarStatusEntrega = async (pedidoId: string, novoStatus: string) => {
    try {
      await api.patch(`/pedidos/${pedidoId}/delivery/status`, {
        status: novoStatus,
      });
      carregarPedidos();
      if (selectedPedido?.id === pedidoId) {
        setSelectedPedido(null);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar status de entrega:", error);
      const mensagemErro = error.response?.data?.error || "Erro ao atualizar status de entrega";
      setError(mensagemErro);
      alert(mensagemErro);
    }
  };

  const getProximoStatus = (status: string): string | null => {
    const sequencia: Record<string, string> = {
      RECEBIDO: "EM_PREPARO",
      EM_PREPARO: "PRONTO",
      PRONTO: "ENTREGUE",
    };
    return sequencia[status] || null;
  };

  const agruparPorData = (pedidos: Pedido[]): Record<string, Pedido[]> => {
    const grupos: Record<string, Pedido[]> = {};
    
    pedidos.forEach((pedido) => {
      const data = new Date(pedido.criadoEm);
      const chave = data.toLocaleDateString("pt-BR");
      
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(pedido);
    });

    // Ordenar as datas em ordem decrescente (mais recentes primeiro)
    const datasOrdenadas = Object.keys(grupos).sort((a, b) => {
      const dataA = new Date(a.split("/").reverse().join("-"));
      const dataB = new Date(b.split("/").reverse().join("-"));
      return dataB.getTime() - dataA.getTime();
    });

    const gruposOrdenados: Record<string, Pedido[]> = {};
    datasOrdenadas.forEach((data) => {
      gruposOrdenados[data] = grupos[data];
    });

    return gruposOrdenados;
  };

  const filtrarPorData = (pedidos: Pedido[]): Pedido[] => {
    if (filtroData === "HOJE") {
      const hoje = new Date().toLocaleDateString("pt-BR");
      return pedidos.filter((pedido) => {
        const dataPedido = new Date(pedido.criadoEm).toLocaleDateString("pt-BR");
        return dataPedido === hoje;
      });
    }
    return pedidos;
  };

  return (
    <div className="space-y-6 px-2">
      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os status</SelectItem>
            <SelectItem value="RECEBIDO">Recebido</SelectItem>
            <SelectItem value="EM_PREPARO">Em Preparação</SelectItem>
            <SelectItem value="PRONTO">Pronto</SelectItem>
            <SelectItem value="ENTREGUE">Entregue</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os tipos</SelectItem>
            <SelectItem value="MESA">Mesa</SelectItem>
            <SelectItem value="DELIVERY">Delivery</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroData} onValueChange={setFiltroData}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os pedidos</SelectItem>
            <SelectItem value="HOJE">Pedidos do dia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Erro</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="space-y-8">
        {loading ? (
          <p className="text-center py-12 text-slate-500">Carregando pedidos...</p>
        ) : filtrarPorData(pedidos).length === 0 ? (
          <p className="text-center py-12 text-slate-500">Nenhum pedido encontrado</p>
        ) : (
          Object.entries(agruparPorData(filtrarPorData(pedidos))).map(([data, pedidosDoDia]) => (
            <div key={data} className="space-y-4">
              {/* Header de Data */}
              <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-l-4 border-accent p-5 rounded-lg">
                <h3 className="text-lg font-bold text-slate-900">
                  📅 Pedidos do dia {data}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {pedidosDoDia.length} pedido{pedidosDoDia.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Cards de Pedidos */}
              <div className="grid grid-cols-1 gap-4 px-1">
                {pedidosDoDia.map((pedido) => (
                  <Card key={pedido.id} className="cursor-pointer hover:shadow-md transition">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg">#{pedido.id.slice(0, 8)}</span>
                            <Badge variant="outline">{pedido.tipo}</Badge>
                            <Badge className={statusColors[pedido.status]}>
                              {statusIcons[pedido.status] && (
                                <span className="mr-1">{statusIcons[pedido.status]}</span>
                              )}
                              {pedido.status}
                            </Badge>
                          </div>

                    <div className="text-sm text-slate-600 space-y-1">
                      {pedido.tipo === "MESA" ? (
                        <p>
                          <strong>Mesa:</strong> {pedido.mesa?.numero}
                        </p>
                      ) : (
                        <>
                          <p>
                            <strong>Cliente:</strong> {pedido.delivery?.nomeCliente}
                          </p>
                          <p>
                            <strong>Entrega:</strong> {pedido.delivery?.enderecoEntrega}
                          </p>
                        </>
                      )}
                      <p className="flex items-center gap-2 bg-accent/10 px-2 py-1 rounded">
                        <User className="w-4 h-4 text-accent" />
                        <strong>Responsável:</strong> <span className="text-accent font-semibold">{pedido.usuario.nome}</span>
                      </p>
                      <p>
                        <strong>Itens:</strong> {pedido.itens.length} item
                        {pedido.itens.length !== 1 ? "ns" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      R$ {pedido.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(pedido.criadoEm).toLocaleTimeString("pt-BR")}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPedido(pedido);
                        setShowDetails(true);
                      }}
                      className="mt-2"
                    >
                      Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog de Detalhes */}
      {selectedPedido && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido #{selectedPedido.id.slice(0, 8)}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tipo:</span>
                    <Badge>{selectedPedido.tipo}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <Badge className={statusColors[selectedPedido.status]}>
                      {selectedPedido.status}
                    </Badge>
                  </div>
                  {selectedPedido.tipo === "MESA" ? (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mesa:</span>
                      <span>{selectedPedido.mesa?.numero}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cliente:</span>
                        <span>{selectedPedido.delivery?.nomeCliente}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Telefone:</span>
                        <span>{selectedPedido.delivery?.telefone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Endereço:</span>
                        <span>{selectedPedido.delivery?.enderecoEntrega}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status Entrega:</span>
                        <Badge variant="outline">
                          {selectedPedido.delivery?.statusEntrega}
                        </Badge>
                      </div>
                    </>
                  )}
                  <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-accent" />
                      <span className="text-slate-600 font-semibold">Responsável pelo Pedido:</span>
                    </div>
                    <div className="ml-6">
                      <p className="text-accent font-bold text-base">{selectedPedido.usuario.nome}</p>
                      <p className="text-xs text-slate-500">{selectedPedido.usuario.email}</p>
                      <p className="text-xs text-slate-500">Perfil: <span className="font-semibold">{selectedPedido.usuario.perfil}</span></p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Horário:</span>
                    <span>
                      {new Date(selectedPedido.criadoEm).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Itens */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedPedido.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start p-2 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.item.nome}</p>
                        {item.observacoes && (
                          <p className="text-xs text-slate-500 italic">
                            Obs: {item.observacoes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                        </p>
                        <p className="font-medium">
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Resumo Financeiro */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {selectedPedido.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedPedido.desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>-R$ {selectedPedido.desconto.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedPedido.delivery && selectedPedido.delivery.taxaEntrega > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa Entrega:</span>
                      <span>R$ {selectedPedido.delivery.taxaEntrega.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedPedido.gorjeta > 0 && (
                    <div className="flex justify-between">
                      <span>Gorjeta:</span>
                      <span>R$ {selectedPedido.gorjeta.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>R$ {selectedPedido.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              {selectedPedido.status !== "CANCELADO" &&
                selectedPedido.status !== "ENTREGUE" && (
                  <div className="space-y-2">
                    {selectedPedido.status === "PRONTO" && (
                      <Button
                        onClick={() => {
                          atualizarStatus(selectedPedido.id, "ENTREGUE");
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Entregar Pedido
                      </Button>
                    )}

                    {selectedPedido.tipo === "DELIVERY" &&
                      selectedPedido.delivery?.statusEntrega !== "ENTREGUE" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const proximoStatus = selectedPedido.delivery?.statusEntrega;
                            if (proximoStatus === "PENDENTE") {
                              atualizarStatusEntrega(
                                selectedPedido.id,
                                "EM_ROTA"
                              );
                            } else if (proximoStatus === "EM_ROTA") {
                              atualizarStatusEntrega(
                                selectedPedido.id,
                                "ENTREGUE"
                              );
                            }
                          }}
                          className="w-full"
                        >
                          Atualizar Entrega
                        </Button>
                      )}

                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja cancelar este pedido?")) {
                          atualizarStatus(selectedPedido.id, "CANCELADO");
                        }
                      }}
                      className="w-full"
                    >
                      Cancelar Pedido
                    </Button>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
