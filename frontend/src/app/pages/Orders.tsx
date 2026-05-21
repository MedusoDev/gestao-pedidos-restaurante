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
  return (
    <div>
      <h1 className="text-2xl font-bold">Pedidos</h1>
      <p>Página de gerenciamento de pedidos.</p>
    </div>
  );
}
