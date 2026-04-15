import { useState } from "react";
import {
  Clock,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { OrderDetailsModal } from "../components/OrderDetailsModal";

const chartData = [
  { hour: "08:00", pedidos: 5 },
  { hour: "09:00", pedidos: 12 },
  { hour: "10:00", pedidos: 18 },
  { hour: "11:00", pedidos: 28 },
  { hour: "12:00", pedidos: 45 },
  { hour: "13:00", pedidos: 52 },
  { hour: "14:00", pedidos: 38 },
  { hour: "15:00", pedidos: 22 },
];

const pendingOrders = [
  {
    id: "#1234",
    table: "Mesa 5",
    customer: "Carlos Silva",
    items: "2x Picanha, 1x Água",
    total: "R$ 89,90",
    status: "Pendente",
    time: "14:35",
  },
  {
    id: "#1235",
    table: "Mesa 12",
    customer: "Ana Costa",
    items: "3x Pizza Margherita, 2x Refrigerante",
    total: "R$ 142,00",
    status: "Pendente",
    time: "14:42",
  },
  {
    id: "#1236",
    table: "Mesa 3",
    customer: "Roberto Lima",
    items: "1x Salada Caesar, 1x Suco",
    total: "R$ 35,50",
    status: "Pendente",
    time: "14:48",
  },
  {
    id: "#1237",
    table: "Mesa 8",
    customer: "Mariana Souza",
    items: "2x Hambúrguer Gourmet, 2x Batata Frita",
    total: "R$ 98,00",
    status: "Pendente",
    time: "14:52",
  },
];

const preparingOrders = [
  {
    id: "#1230",
    table: "Mesa 2",
    items: ["2x Filé Mignon", "1x Risoto de Funghi"],
    time: "12 min",
    status: "Em Preparação",
  },
  {
    id: "#1231",
    table: "Mesa 7",
    items: ["3x Salmão Grelhado", "2x Legumes"],
    time: "8 min",
    status: "Em Preparação",
  },
  {
    id: "#1232",
    table: "Mesa 15",
    items: ["4x Lasagna", "1x Bruschetta"],
    time: "15 min",
    status: "Em Preparação",
  },
];

export function Dashboard() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      Pendente: { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Em Preparação": { bg: "bg-orange-100", text: "text-orange-800" },
      Pronto: { bg: "bg-green-100", text: "text-green-800" },
      Entregue: { bg: "bg-blue-100", text: "text-blue-800" },
    };

    const variant = variants[status] || variants.Pendente;
    return (
      <Badge
        className={`${variant.bg} ${variant.text} border-0 px-3 py-1 rounded-lg`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Pedidos Hoje
                </p>
                <h3 className="text-3xl font-bold text-foreground">142</h3>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs ontem
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Ticket Médio
                </p>
                <h3 className="text-3xl font-bold text-foreground">R$ 78,50</h3>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% vs ontem
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Tempo Médio Preparo
                </p>
                <h3 className="text-3xl font-bold text-foreground">18 min</h3>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  -3 min vs ontem
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Pedidos em Atraso
                </p>
                <h3 className="text-3xl font-bold text-foreground">3</h3>
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Requer atenção
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="rounded-xl shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle>Pedidos por Hora - Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="pedidos"
                stroke="#FF6B00"
                strokeWidth={3}
                dot={{ fill: "#FF6B00", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card className="rounded-xl shadow-sm border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Pedidos Pendentes</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800 border-0">
                {pendingOrders.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {order.id}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • {order.table}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.time}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-3">{order.items}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {order.total}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preparing Orders - Kanban Style */}
        <Card className="rounded-xl shadow-sm border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Em Preparação / Cozinha</CardTitle>
              <Badge className="bg-orange-100 text-orange-800 border-0">
                {preparingOrders.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-accent rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {order.id}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • {order.table}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">
                          {order.time}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-foreground flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
