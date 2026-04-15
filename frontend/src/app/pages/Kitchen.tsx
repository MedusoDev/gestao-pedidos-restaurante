import { Clock, ChefHat, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const kitchenOrders = [
  {
    id: "#1237",
    table: "Mesa 8",
    time: "2 min",
    priority: "high",
    items: [
      { name: "Hambúrguer Gourmet", quantity: 2, notes: "Ponto mal passado" },
      { name: "Batata Frita", quantity: 2, notes: "" },
    ],
  },
  {
    id: "#1236",
    table: "Mesa 3",
    time: "5 min",
    priority: "normal",
    items: [
      { name: "Salada Caesar", quantity: 1, notes: "Sem croutons" },
      { name: "Suco de Laranja", quantity: 1, notes: "" },
    ],
  },
  {
    id: "#1235",
    table: "Mesa 12",
    time: "10 min",
    priority: "normal",
    items: [
      { name: "Pizza Margherita", quantity: 3, notes: "" },
      { name: "Refrigerante", quantity: 2, notes: "" },
    ],
  },
  {
    id: "#1234",
    table: "Mesa 5",
    time: "12 min",
    priority: "normal",
    items: [
      { name: "Picanha Grelhada", quantity: 2, notes: "Ponto ao ponto" },
      { name: "Água Mineral", quantity: 1, notes: "" },
    ],
  },
];

const preparingOrders = [
  {
    id: "#1233",
    table: "Mesa 9",
    time: "8 min",
    progress: 60,
    items: [
      { name: "Salmão Grelhado", quantity: 1, done: true },
      { name: "Vinho Tinto", quantity: 1, done: false },
    ],
  },
  {
    id: "#1232",
    table: "Mesa 15",
    time: "15 min",
    progress: 40,
    items: [
      { name: "Lasagna", quantity: 4, done: false },
      { name: "Bruschetta", quantity: 1, done: true },
    ],
  },
  {
    id: "#1231",
    table: "Mesa 7",
    time: "18 min",
    progress: 75,
    items: [
      { name: "Salmão Grelhado", quantity: 3, done: true },
      { name: "Legumes Grelhados", quantity: 2, done: true },
    ],
  },
];

const readyOrders = [
  {
    id: "#1230",
    table: "Mesa 2",
    time: "Aguardando",
    items: [
      { name: "Filé Mignon", quantity: 2 },
      { name: "Risoto de Funghi", quantity: 1 },
    ],
  },
  {
    id: "#1229",
    table: "Mesa 11",
    time: "Aguardando",
    items: [
      { name: "Frango Grelhado", quantity: 1 },
      { name: "Salada Verde", quantity: 1 },
    ],
  },
];

export function Kitchen() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitchen Display System</h1>
          <p className="text-muted-foreground mt-1">
            Monitor e gerencie os pedidos em preparação
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card border border-border rounded-xl px-4 py-2">
            <p className="text-sm text-muted-foreground">Tempo Médio</p>
            <p className="text-xl font-bold text-foreground">18 min</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2">
            <p className="text-sm text-muted-foreground">Em Fila</p>
            <p className="text-xl font-bold text-accent">{kitchenOrders.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2">
            <p className="text-sm text-muted-foreground">Preparando</p>
            <p className="text-xl font-bold text-orange-600">{preparingOrders.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2">
            <p className="text-sm text-muted-foreground">Prontos</p>
            <p className="text-xl font-bold text-green-600">{readyOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {/* New Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              Novos Pedidos
            </h2>
            <Badge className="bg-accent/10 text-accent border-0">
              {kitchenOrders.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {kitchenOrders.map((order) => (
              <Card
                key={order.id}
                className={`rounded-xl shadow-md border-l-4 ${
                  order.priority === "high"
                    ? "border-l-red-500 bg-red-50/50"
                    : "border-l-accent"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.table}
                      </p>
                    </div>
                    {order.priority === "high" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      {order.time}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-card rounded-lg p-3 border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {item.quantity}x {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              Obs: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg mt-3">
                    <ChefHat className="w-4 h-4 mr-2" />
                    Iniciar Preparo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preparing */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              Em Preparação
            </h2>
            <Badge className="bg-orange-100 text-orange-800 border-0">
              {preparingOrders.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {preparingOrders.map((order) => (
              <Card
                key={order.id}
                className="rounded-xl shadow-md border-l-4 border-l-orange-500 bg-orange-50/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.table}
                      </p>
                    </div>
                    <ChefHat className="w-5 h-5 text-orange-600 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">
                      {order.time}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium text-orange-600">
                        {order.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-card rounded-lg p-3 border ${
                        item.done
                          ? "border-green-300 bg-green-50"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {item.done && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          <p
                            className={`font-medium ${
                              item.done
                                ? "text-green-700 line-through"
                                : "text-foreground"
                            }`}
                          >
                            {item.quantity}x {item.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg mt-3">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Marcar como Pronto
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ready */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              Prontos para Servir
            </h2>
            <Badge className="bg-green-100 text-green-800 border-0">
              {readyOrders.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {readyOrders.map((order) => (
              <Card
                key={order.id}
                className="rounded-xl shadow-md border-l-4 border-l-green-500 bg-green-50/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.table}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1">
                      {order.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-card rounded-lg p-3 border border-green-300"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="font-medium text-foreground">
                          {item.quantity}x {item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 rounded-lg mt-3"
                  >
                    Pedido Entregue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
