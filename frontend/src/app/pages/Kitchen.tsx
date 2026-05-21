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
    <div>
      <h1 className="text-2xl font-bold">Cozinha</h1>
      <p>Página de gerenciamento da cozinha.</p>
    </div>
  );
}
