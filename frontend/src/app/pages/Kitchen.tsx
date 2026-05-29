import { useState, useEffect, useRef } from "react";
import { Clock, ChefHat, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Notification from "../components/Notification";
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

interface Pedido {
  id: string;
  tipo: 'MESA' | 'DELIVERY';
  status: 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
  subtotal: number;
  total: number;
  criadoEm: string;
  itens: ItemPedido[];
  mesa?: {
    id: string;
    numero: number;
  };
  delivery?: {
    nomeCliente: string;
  };
}

export function Kitchen() {
  const [pedidosRecebidos, setPedidosRecebidos] = useState<Pedido[]>([]);
  const [pedidosEmPreparo, setPedidosEmPreparo] = useState<Pedido[]>([]);
  const [pedidosProntos, setPedidosProntos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const previousProntosRef = useRef<string[]>([]);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastChangeTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    carregarPedidos();
    setupSmartPolling();
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

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

  const carregarPedidos = async () => {
    try {
      const response = await api.get("/pedidos");
      const todos = response.data;

      // Filtrar por status
      const recebidos = todos.filter((p: Pedido) => p.status === "RECEBIDO");
      const emPreparo = todos.filter((p: Pedido) => p.status === "EM_PREPARO");
      const prontos = todos.filter((p: Pedido) => p.status === "PRONTO");

      setPedidosRecebidos(recebidos);
      setPedidosEmPreparo(emPreparo);
      setPedidosProntos(prontos);

      // Detectar pedidos que ficaram prontos
      const prontosIds = prontos.map((p: Pedido) => p.id);
      const newProntos = prontosIds.filter(id => !previousProntosRef.current.includes(id));
      if (newProntos.length > 0) {
        setNotification({ message: `🔔 ${newProntos.length} pedido(s) pronto(s)!`, type: 'success' });
        setTimeout(() => setNotification(null), 5000);
        lastChangeTimeRef.current = Date.now();
      }
      previousProntosRef.current = prontosIds;
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (pedidoId: string, novoStatus: string) => {
    try {
      await api.patch(`/pedidos/${pedidoId}/status`, { status: novoStatus });
      await carregarPedidos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  const renderPedido = (pedido: Pedido) => (
    <Card key={pedido.id} className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {pedido.tipo === "MESA" ? `Mesa ${pedido.mesa?.numero}` : `Delivery: ${pedido.delivery?.nomeCliente}`}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(pedido.criadoEm).toLocaleTimeString("pt-BR")}
            </p>
          </div>
          <Badge variant="outline">#{pedido.id.slice(0, 8)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Itens */}
        <div className="space-y-2">
          {pedido.itens.map((item) => (
            <div key={item.id} className="flex justify-between text-sm bg-slate-50 p-2 rounded">
              <div>
                <p className="font-medium">{item.item.nome}</p>
                {item.observacoes && (
                  <p className="text-xs text-slate-600 italic">Obs: {item.observacoes}</p>
                )}
              </div>
              <p className="font-semibold text-slate-900">{item.quantidade}x</p>
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 pt-2">
          {pedido.status === "RECEBIDO" && (
            <Button
              size="sm"
              onClick={() => atualizarStatus(pedido.id, "EM_PREPARO")}
              className="flex-1"
            >
              <ChefHat className="w-4 h-4 mr-1" />
              Iniciar Preparo
            </Button>
          )}
          {pedido.status === "EM_PREPARO" && (
            <Button
              size="sm"
              onClick={() => atualizarStatus(pedido.id, "PRONTO")}
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Marcar Pronto
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-96">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <div>
        <h1 className="text-3xl font-bold">Cozinha</h1>
        <p className="text-slate-600">Gerenciamento de pedidos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos Recebidos */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold">Novos Pedidos ({pedidosRecebidos.length})</h2>
          </div>
          <div className="space-y-3">
            {pedidosRecebidos.length > 0 ? (
              pedidosRecebidos.map(renderPedido)
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum pedido novo</p>
            )}
          </div>
        </div>

        {/* Pedidos em Preparo */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-yellow-200">
            <ChefHat className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">Preparando ({pedidosEmPreparo.length})</h2>
          </div>
          <div className="space-y-3">
            {pedidosEmPreparo.length > 0 ? (
              pedidosEmPreparo.map(renderPedido)
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum pedido em preparo</p>
            )}
          </div>
        </div>

        {/* Pedidos Prontos */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">Prontos ({pedidosProntos.length})</h2>
          </div>
          <div className="space-y-3">
            {pedidosProntos.length > 0 ? (
              pedidosProntos.map((pedido) => (
                <Card key={pedido.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {pedido.tipo === "MESA" ? `Mesa ${pedido.mesa?.numero}` : `Delivery: ${pedido.delivery?.nomeCliente}`}
                        </CardTitle>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(pedido.criadoEm).toLocaleTimeString("pt-BR")}
                        </p>
                      </div>
                      <Badge className="bg-green-500">Pronto</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Itens */}
                    <div className="space-y-2">
                      {pedido.itens.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm bg-slate-50 p-2 rounded">
                          <div>
                            <p className="font-medium">{item.item.nome}</p>
                            {item.observacoes && (
                              <p className="text-xs text-slate-600 italic">Obs: {item.observacoes}</p>
                            )}
                          </div>
                          <p className="font-semibold text-slate-900">{item.quantidade}x</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum pedido pronto</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
