import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CriarPedido } from "../components/CriarPedido";
import { ListarPedidos } from "../components/ListarPedidos";
import { ShoppingCart } from "lucide-react";

export function Pedidos() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-accent/20 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold">Pedidos</h1>
          </div>
          <p className="text-muted-foreground">
            Crie e acompanhe os pedidos do seu restaurante
          </p>
        </div>
        <CriarPedido />
      </div>

      {/* Main Content */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-accent" />
              Todos os Pedidos
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ListarPedidos />
        </CardContent>
      </Card>
    </div>
  );
}
