import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import api from "../../lib/axios";

interface ItemCardapio {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  disponivel: boolean;
}

interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: string;
}

interface PedidoItem {
  itemId: string;
  quantidade: number;
  observacoes?: string;
  item?: ItemCardapio;
}

export function CriarPedido() {
  const [tipo, setTipo] = useState<"MESA" | "DELIVERY">("MESA");
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [cardapio, setCardapio] = useState<ItemCardapio[]>([]);
  const [selectedMesa, setSelectedMesa] = useState<string>("");
  const [itensPedido, setItensPedido] = useState<PedidoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");

  // Dados para delivery
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState("");

  // Dados para adicionar item
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantidade, setQuantidade] = useState(1);
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setError("");
      
      // Carregar mesas
      let mesasArray: Mesa[] = [];
      try {
        const mesasRes = await api.get("/mesas");
        console.log("Resposta de mesas:", mesasRes);
        console.log("Tipo de mesas:", typeof mesasRes.data, Array.isArray(mesasRes.data));
        
        mesasArray = Array.isArray(mesasRes.data) ? mesasRes.data : mesasRes.data?.mesas || [];
        setMesas(mesasArray);
        console.log("Mesas carregadas:", mesasArray.length);
      } catch (mesasError: any) {
        console.error("Erro ao carregar mesas:", mesasError);
        setError(`Erro ao carregar mesas: ${mesasError.response?.data?.error || mesasError.message}`);
      }
      
      // Carregar cardápio
      let cardapioArray: ItemCardapio[] = [];
      try {
        const cardapioRes = await api.get("/itens");
        console.log("Resposta de cardápio:", cardapioRes);
        console.log("Tipo de cardápio:", typeof cardapioRes.data, Array.isArray(cardapioRes.data));
        
        cardapioArray = Array.isArray(cardapioRes.data) ? cardapioRes.data : cardapioRes.data?.itens || [];
        setCardapio(cardapioArray);
        console.log("Itens do cardápio carregados:", cardapioArray.length);
      } catch (cardapioError: any) {
        console.error("Erro ao carregar cardápio:", cardapioError);
        setError(`Erro ao carregar cardápio: ${cardapioError.response?.data?.error || cardapioError.message}`);
      }
      
    } catch (error: any) {
      console.error("Erro geral ao carregar dados:", error);
      const mensagemErro = error.response?.data?.error || "Erro ao carregar dados";
      setError(mensagemErro);
    }
  };

  const adicionarItem = () => {
    if (!selectedItem || quantidade < 1) return;

    const item = cardapio.find((i) => i.id === selectedItem);
    if (!item) return;

    setItensPedido([
      ...itensPedido,
      {
        itemId: selectedItem,
        quantidade,
        observacoes,
        item,
      },
    ]);

    setSelectedItem("");
    setQuantidade(1);
    setObservacoes("");
  };

  const removerItem = (index: number) => {
    setItensPedido(itensPedido.filter((_, i) => i !== index));
  };

  const calcularTotal = (): number => {
    let total = itensPedido.reduce((acc, item) => {
      const preco = parseFloat(item.item?.preco || 0);
      return acc + preco * item.quantidade;
    }, 0);

    if (tipo === "DELIVERY") {
      total += parseFloat(taxaEntrega || "0");
    }

    return total;
  };

  const criarPedido = async () => {
    try {
      setLoading(true);

      const payload =
        tipo === "MESA"
          ? {
              tipo,
              mesaId: selectedMesa,
              itens: itensPedido.map((i) => ({
                itemId: i.itemId,
                quantidade: i.quantidade,
                observacoes: i.observacoes,
              })),
            }
          : {
              tipo,
              nomeCliente,
              telefone,
              enderecoEntrega,
              taxaEntrega: parseFloat(taxaEntrega || "0"),
              itens: itensPedido.map((i) => ({
                itemId: i.itemId,
                quantidade: i.quantidade,
                observacoes: i.observacoes,
              })),
            };

      const response = await api.post("/pedidos", payload);
      console.log("Pedido criado:", response.data);

      // Resetar formulário
      setTipo("MESA");
      setSelectedMesa("");
      setItensPedido([]);
      setNomeCliente("");
      setTelefone("");
      setEnderecoEntrega("");
      setTaxaEntrega("");
      setError("");
      setOpen(false);

      // Mostrar notificação de sucesso (você pode adicionar toast aqui)
      alert("Pedido criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      const mensagemErro = error.response?.data?.error || "Erro ao criar pedido";
      setError(mensagemErro);
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const validarForm = (): boolean => {
    if (itensPedido.length === 0) {
      alert("Adicione pelo menos um item ao pedido");
      return false;
    }

    if (tipo === "MESA") {
      if (!selectedMesa) {
        alert("Selecione uma mesa");
        return false;
      }
    } else {
      if (!nomeCliente || !telefone || !enderecoEntrega) {
        alert("Preencha todos os dados de entrega");
        return false;
      }
    }

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alerta de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">Erro</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Seleção de Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Pedido</label>
            <div className="flex gap-2">
              <Button
                variant={tipo === "MESA" ? "default" : "outline"}
                onClick={() => setTipo("MESA")}
              >
                Mesa
              </Button>
              <Button
                variant={tipo === "DELIVERY" ? "default" : "outline"}
                onClick={() => setTipo("DELIVERY")}
              >
                Delivery
              </Button>
            </div>
          </div>

          {/* Dados Específicos do Tipo */}
          {tipo === "MESA" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mesa</label>
              <Select value={selectedMesa || ""} onValueChange={setSelectedMesa} disabled={!Array.isArray(mesas) || mesas.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma mesa" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(mesas) && mesas.length > 0 ? (
                    mesas.map((mesa) => (
                      <SelectItem key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} (Cap. {mesa.capacidade})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-slate-500">Nenhuma mesa disponível</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Nome Cliente</label>
                  <Input
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="11999999999"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Endereço Entrega</label>
                <Input
                  value={enderecoEntrega}
                  onChange={(e) => setEnderecoEntrega(e.target.value)}
                  placeholder="Rua das Flores, 123 - Apt 456"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Taxa Entrega (R$)</label>
                <Input
                  type="number"
                  value={taxaEntrega}
                  onChange={(e) => setTaxaEntrega(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Adicionar Itens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adicionar Itens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-sm font-medium">Item</label>
                  <Select value={selectedItem || ""} onValueChange={setSelectedItem} disabled={!Array.isArray(cardapio) || cardapio.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um item" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(cardapio) && cardapio.length > 0 ? (
                        cardapio
                          .filter((item) => item.disponivel)
                          .map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.nome} - R$ {parseFloat(item.preco || 0).toFixed(2)}
                            </SelectItem>
                          ))
                      ) : (
                        <div className="p-2 text-sm text-slate-500">Nenhum item disponível</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm font-medium">Quantidade</label>
                    <Input
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Input
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Sem cebola, bem passado..."
                    />
                  </div>
                </div>
              </div>
              <Button onClick={adicionarItem} className="w-full">
                Adicionar Item
              </Button>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          {itensPedido.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {itensPedido.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded bg-slate-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.item?.nome}</p>
                        <p className="text-xs text-slate-600">
                          {item.quantidade}x R${" "}
                          {(parseFloat(item.item?.preco || 0)).toFixed(2)} ={" "}
                          <strong>
                            R${" "}
                            {((parseFloat(item.item?.preco || 0)) * item.quantidade).toFixed(
                              2
                            )}
                          </strong>
                        </p>
                        {item.observacoes && (
                          <p className="text-xs text-slate-500 italic">
                            Obs: {item.observacoes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removerItem(index)}
                        className="ml-2 p-1 hover:bg-slate-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumo e Total */}
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    R${" "}
                    {itensPedido
                      .reduce((acc, item) => acc + (item.item?.preco || 0) * item.quantidade, 0)
                      .toFixed(2)}
                  </span>
                </div>
                {tipo === "DELIVERY" && taxaEntrega && (
                  <div className="flex justify-between">
                    <span>Taxa Entrega:</span>
                    <span>R$ {parseFloat(taxaEntrega).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>R$ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (validarForm()) {
                  criarPedido();
                }
              }}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Criando..." : "Criar Pedido"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
