import {
  BarChart3,
  Clock3,
  ClipboardList,
  Plus,
  LayoutGrid,
  UtensilsCrossed,
  Store,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const metrics = [
  {
    title: "Pedidos hoje",
    value: "0",
    description: "Total de pedidos recebidos hoje",
    icon: ClipboardList,
    color: "text-[#93cc4c]",
    bg: "bg-[#93cc4c]/10",
  },
  {
    title: "Tempo médio",
    value: "0 min",
    description: "Tempo médio de preparo",
    icon: Clock3,
    color: "text-[#93cc4c]",
    bg: "bg-[#93cc4c]/10",
  },
];

type OrderStatus =
  | "pendente"
  | "preparando"
  | "pronto"
  | "entregue"
  | "cancelado";

type OrderType = "delivery" | "local";

interface Order {
  id: string;
  customer: string;
  items: string;
  status: OrderStatus;
  type: OrderType;
  time: string;
  total: string;
}

const recentOrders: Order[] = [];

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pendente: {
    label: "Pendente",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  preparando: {
    label: "Preparando",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  pronto: {
    label: "Pronto",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  entregue: {
    label: "Entregue",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  cancelado: {
    label: "Cancelado",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-8">
      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => navigate("/dashboard/pedidos/novo")}
          className="bg-[#2373ab] hover:bg-[#0d3d61] text-white border-0 gap-2 rounded-xl px-5"
        >
          <Plus className="w-4 h-4" />
          Novo Pedido
        </Button>

        <Button
          onClick={() => navigate("/dashboard/mesas")}
          variant="outline"
          className="gap-2 rounded-xl px-5 transition-all duration-200 hover:bg-[#114d77] hover:text-white hover:border-[#114d77]"
        >
          <LayoutGrid className="w-4 h-4" />
          Listar Mesas
        </Button>

        <Button
          onClick={() => navigate("/dashboard/cardapio")}
          variant="outline"
          className="gap-2 rounded-xl px-5 transition-all duration-200 hover:bg-[#114d77] hover:text-white hover:border-[#114d77]"
        >
          <UtensilsCrossed className="w-4 h-4" />
          Ver Cardápio
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className="rounded-2xl border-border shadow-sm"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {metric.title}
                </p>

                <h3 className="text-4xl font-bold text-foreground">
                  {metric.value}
                </h3>

                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>

              <div className={`rounded-2xl ${metric.bg} p-4`}>
                <metric.icon className={`h-7 w-7 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <BarChart3 className="h-5 w-5 text-[#114d77]" />
            Últimos pedidos
          </CardTitle>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/pedidos")}
            className="text-sm text-muted-foreground transition-all duration-200 hover:text-[#114d77] hover:bg-[#114d77]/10"
          >
            Ver todos →
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium text-foreground">
                Nenhum pedido ainda
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Os pedidos recebidos aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/pedidos/${order.id}`)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                      {order.type === "delivery" ? (
                        <Truck className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Store className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {order.customer}
                      </p>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.items}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {order.time}
                    </span>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[order.status].className
                      }`}
                    >
                      {statusConfig[order.status].label}
                    </span>

                    <span className="text-sm font-semibold text-foreground min-w-[60px] text-right">
                      {order.total}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.type === "delivery"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                      }`}
                    >
                      {order.type === "delivery" ? (
                        <>
                          <Truck className="w-3 h-3" />
                          Delivery
                        </>
                      ) : (
                        <>
                          <Store className="w-3 h-3" />
                          Restaurante
                        </>
                      )}
                    </span>
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