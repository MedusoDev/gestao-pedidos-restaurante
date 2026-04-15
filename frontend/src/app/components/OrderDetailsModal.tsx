import { X, Clock, User, MapPin, CreditCard } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const orderDetails = {
    id: orderId,
    table: "Mesa 5",
    customer: "Carlos Silva",
    status: "Pendente",
    time: "14:35",
    waiter: "Maria Santos",
    paymentMethod: "Cartão de Crédito",
    items: [
      { name: "Picanha Grelhada", quantity: 2, price: 39.90, total: 79.80 },
      { name: "Água Mineral 500ml", quantity: 1, price: 5.00, total: 5.00 },
      { name: "Batata Frita", quantity: 1, price: 12.00, total: 12.00 },
    ],
    subtotal: 96.80,
    tax: 9.68,
    total: 106.48,
  };

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Detalhes do Pedido {orderDetails.id}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize todas as informações do pedido
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Mesa</span>
              </div>
              <p className="font-semibold text-foreground">
                {orderDetails.table}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Cliente</span>
              </div>
              <p className="font-semibold text-foreground">
                {orderDetails.customer}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Horário</span>
              </div>
              <p className="font-semibold text-foreground">{orderDetails.time}</p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Garçom</span>
              </div>
              <p className="font-semibold text-foreground">
                {orderDetails.waiter}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
            <span className="text-sm text-muted-foreground">Status do Pedido</span>
            {getStatusBadge(orderDetails.status)}
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Itens do Pedido</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-secondary/30 rounded-xl p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.quantity}x R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    R$ {item.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">
                R$ {orderDetails.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Taxa de Serviço (10%)</span>
              <span className="font-medium text-foreground">
                R$ {orderDetails.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-foreground">
                R$ {orderDetails.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
              <p className="font-semibold text-foreground">
                {orderDetails.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
            Iniciar Preparação
          </Button>
        </div>
      </div>
    </div>
  );
}
