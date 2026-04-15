import { useState } from "react";
import { Search, Filter, Download, Eye, MoreVertical } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { OrderDetailsModal } from "../components/OrderDetailsModal";

const allOrders = [
  {
    id: "#1237",
    table: "Mesa 8",
    customer: "Mariana Souza",
    items: "2x Hambúrguer Gourmet, 2x Batata Frita",
    itemCount: 4,
    total: "R$ 98,00",
    status: "Pendente",
    time: "14:52",
  },
  {
    id: "#1236",
    table: "Mesa 3",
    customer: "Roberto Lima",
    items: "1x Salada Caesar, 1x Suco",
    itemCount: 2,
    total: "R$ 35,50",
    status: "Pendente",
    time: "14:48",
  },
  {
    id: "#1235",
    table: "Mesa 12",
    customer: "Ana Costa",
    items: "3x Pizza Margherita, 2x Refrigerante",
    itemCount: 5,
    total: "R$ 142,00",
    status: "Em Preparação",
    time: "14:42",
  },
  {
    id: "#1234",
    table: "Mesa 5",
    customer: "Carlos Silva",
    items: "2x Picanha, 1x Água",
    itemCount: 3,
    total: "R$ 89,90",
    status: "Em Preparação",
    time: "14:35",
  },
  {
    id: "#1233",
    table: "Mesa 9",
    customer: "Patricia Oliveira",
    items: "1x Salmão Grelhado, 1x Vinho Tinto",
    itemCount: 2,
    total: "R$ 156,00",
    status: "Pronto",
    time: "14:28",
  },
  {
    id: "#1232",
    table: "Mesa 15",
    customer: "Fernando Alves",
    items: "4x Lasagna, 1x Bruschetta",
    itemCount: 5,
    total: "R$ 185,50",
    status: "Pronto",
    time: "14:20",
  },
  {
    id: "#1231",
    table: "Mesa 7",
    customer: "Julia Martins",
    items: "3x Salmão Grelhado, 2x Legumes",
    itemCount: 5,
    total: "R$ 198,00",
    status: "Entregue",
    time: "14:15",
  },
  {
    id: "#1230",
    table: "Mesa 2",
    customer: "Lucas Ferreira",
    items: "2x Filé Mignon, 1x Risoto de Funghi",
    itemCount: 3,
    total: "R$ 175,00",
    status: "Entregue",
    time: "14:10",
  },
  {
    id: "#1229",
    table: "Mesa 11",
    customer: "Beatriz Santos",
    items: "1x Frango Grelhado, 1x Salada Verde",
    itemCount: 2,
    total: "R$ 45,00",
    status: "Entregue",
    time: "14:05",
  },
  {
    id: "#1228",
    table: "Mesa 6",
    customer: "Rafael Costa",
    items: "2x Costela BBQ, 1x Cerveja",
    itemCount: 3,
    total: "R$ 125,00",
    status: "Entregue",
    time: "13:58",
  },
];

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredOrders = allOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Todos os Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe todos os pedidos do restaurante
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-border"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-border">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente ou mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input-background border-border rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-yellow-300 text-yellow-800 hover:bg-yellow-50"
              >
                Pendente ({allOrders.filter((o) => o.status === "Pendente").length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-orange-300 text-orange-800 hover:bg-orange-50"
              >
                Em Preparação (
                {allOrders.filter((o) => o.status === "Em Preparação").length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-green-300 text-green-800 hover:bg-green-50"
              >
                Pronto ({allOrders.filter((o) => o.status === "Pronto").length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-blue-300 text-blue-800 hover:bg-blue-50"
              >
                Entregue ({allOrders.filter((o) => o.status === "Entregue").length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="rounded-xl shadow-sm border-border">
        <CardHeader>
          <CardTitle>
            Lista de Pedidos ({filteredOrders.length} pedidos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Mesa</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Itens</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Horário</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.table}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary border-primary/20 rounded-lg"
                        >
                          {order.itemCount} itens
                        </Badge>
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {order.items}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{order.total}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.time}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-lg p-2"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
