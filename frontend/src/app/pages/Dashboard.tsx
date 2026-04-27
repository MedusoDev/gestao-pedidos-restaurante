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
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Página principal do dashboard.</p>
    </div>
  );
}
