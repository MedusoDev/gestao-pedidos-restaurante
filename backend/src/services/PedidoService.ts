import { PrismaClient } from '@prisma/client';

interface CreatePedidoRequest {
  tipo: 'MESA' | 'DELIVERY';
  mesaId?: string;
  nomeCliente?: string;
  telefone?: string;
  enderecoEntrega?: string;
  taxaEntrega?: number;
  itens: Array<{
    itemId: string;
    quantidade: number;
    observacoes?: string;
  }>;
  usuarioId: string;
  estabelecimentoId: string;
}

interface ListPedidosRequest {
  estabelecimentoId: string;
  status?: string;
  tipo?: string;
}

const prisma = new PrismaClient();

// Helper function to convert decimal strings to numbers
function convertPedidoDecimals(pedido: any): any {
  if (!pedido) return pedido;
  
  const converted = { ...pedido };
  
  // Convert main pedido numeric fields
  if (converted.total !== undefined) converted.total = Number(converted.total);
  if (converted.subtotal !== undefined) converted.subtotal = Number(converted.subtotal);
  if (converted.desconto !== undefined) converted.desconto = Number(converted.desconto);
  if (converted.gorjeta !== undefined) converted.gorjeta = Number(converted.gorjeta);
  
  // Convert itens prices
  if (converted.itens && Array.isArray(converted.itens)) {
    converted.itens = converted.itens.map((item: any) => ({
      ...item,
      precoUnitario: Number(item.precoUnitario),
      item: item.item ? {
        ...item.item,
        preco: Number(item.item.preco)
      } : item.item
    }));
  }
  
  // Convert delivery taxa
  if (converted.delivery) {
    converted.delivery = {
      ...converted.delivery,
      taxaEntrega: Number(converted.delivery.taxaEntrega)
    };
  }
  
  return converted;
}

export class PedidoService {
  async criar(data: CreatePedidoRequest) {
    // Validações
    if (!data.itens || data.itens.length === 0) {
      throw new Error('Pedido deve conter pelo menos um item');
    }

    if (data.tipo === 'MESA' && !data.mesaId) {
      throw new Error('Mesa é obrigatória para pedidos locais');
    }

    if (data.tipo === 'DELIVERY') {
      if (!data.nomeCliente || !data.telefone || !data.enderecoEntrega) {
        throw new Error('Nome cliente, telefone e endereço são obrigatórios para delivery');
      }
    }

    // Buscar preços dos itens
    const itensList = await prisma.itemCardapio.findMany({
      where: {
        id: {
          in: data.itens.map(i => i.itemId)
        }
      }
    });

    // Criar mapa de itens para acesso rápido
    const itensMap = new Map(itensList.map(i => [i.id, i]));

    // Calcular subtotal
    let subtotal = 0;
    for (const item of data.itens) {
      const itemCardapio = itensMap.get(item.itemId);
      if (!itemCardapio) {
        throw new Error(`Item ${item.itemId} não encontrado`);
      }
      subtotal += Number(itemCardapio.preco) * item.quantidade;
    }

    // Calcular total (subtotal + taxa de entrega se for delivery)
    let total = subtotal;
    const taxaEntrega = data.tipo === 'DELIVERY' ? (data.taxaEntrega || 0) : 0;
    total += taxaEntrega;

    // Criar pedido com itens
    const pedido = await prisma.pedido.create({
      data: {
        tipo: data.tipo as any,
        subtotal,
        total,
        usuarioId: data.usuarioId,
        mesaId: data.tipo === 'MESA' ? data.mesaId : null,
        itens: {
          create: data.itens.map(item => ({
            quantidade: item.quantidade,
            precoUnitario: Number(itensMap.get(item.itemId)!.preco),
            observacoes: item.observacoes,
            itemId: item.itemId
          }))
        },
        ...(data.tipo === 'DELIVERY' && {
          delivery: {
            create: {
              nomeCliente: data.nomeCliente!,
              telefone: data.telefone!,
              enderecoEntrega: data.enderecoEntrega!,
              taxaEntrega: taxaEntrega,
              statusEntrega: 'PENDENTE' as any
            }
          }
        })
      },
      include: {
        itens: {
          include: {
            item: true
          }
        },
        delivery: true,
        mesa: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      }
    });

    return convertPedidoDecimals(pedido);
  }

  async listar(data: ListPedidosRequest) {
    // Agrupar pedidos por estabelecimento através da mesa
    // Para isso, precisamos buscar mesas do estabelecimento
    const mesas = await prisma.mesa.findMany({
      where: {
        estabelecimentoId: data.estabelecimentoId
      },
      select: {
        id: true
      }
    });

    const mesasIds = mesas.map(m => m.id);

    // Construir filtros com sintaxe correta do Prisma
    const andFilters: any[] = [
      {
        OR: [
          {
            mesaId: {
              in: mesasIds
            }
          },
          // Também adicionar pedidos delivery do mesmo estabelecimento
          {
            usuario: {
              estabelecimentoId: data.estabelecimentoId
            }
          }
        ]
      }
    ];

    if (data.status) {
      andFilters.push({ status: data.status });
    }

    if (data.tipo) {
      andFilters.push({ tipo: data.tipo });
    }

    const filters = andFilters.length > 1 ? { AND: andFilters } : andFilters[0];

    const pedidos = await prisma.pedido.findMany({
      where: filters,
      include: {
        itens: {
          include: {
            item: true
          }
        },
        delivery: true,
        mesa: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return pedidos.map(convertPedidoDecimals);
  }

  async obterPorId(pedidoId: string) {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        itens: {
          include: {
            item: true
          }
        },
        delivery: true,
        mesa: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      }
    });

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    return convertPedidoDecimals(pedido);
  }

  async atualizarStatus(pedidoId: string, novoStatus: string) {
    const statusValidos = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO'];
    
    if (!statusValidos.includes(novoStatus)) {
      throw new Error('Status inválido');
    }

    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        status: novoStatus as any
      },
      include: {
        itens: {
          include: {
            item: true
          }
        },
        delivery: true,
        mesa: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      }
    });

    return convertPedidoDecimals(pedido);
  }

  async atualizarStatusEntrega(pedidoId: string, novoStatus: string) {
    const statusValidos = ['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'CANCELADA'];
    
    if (!statusValidos.includes(novoStatus)) {
      throw new Error('Status de entrega inválido');
    }

    const delivery = await prisma.delivery.update({
      where: { pedidoId },
      data: {
        statusEntrega: novoStatus as any
      },
      include: {
        pedido: {
          include: {
            itens: {
              include: {
                item: true
              }
            },
            delivery: true,
            mesa: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                perfil: true
              }
            }
          }
        }
      }
    });

    return {
      ...delivery,
      pedido: convertPedidoDecimals(delivery.pedido)
    };
  }

  async cancelarPedido(pedidoId: string) {
    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        status: 'CANCELADO'
      },
      include: {
        itens: {
          include: {
            item: true
          }
        },
        delivery: true,
        mesa: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      }
    });

    return convertPedidoDecimals(pedido);
  }

  async deletarPedido(pedidoId: string) {
    const pedido = await prisma.pedido.delete({
      where: { id: pedidoId }
    });

    return pedido;
  }
}
