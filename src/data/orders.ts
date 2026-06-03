import type { Order, OrderItem, OrderStatus, PaymentMethod, SizeId } from './types'

const guarnTodas = ['Mix Repolho com Couve', 'Macarrão Alho e Óleo']

function priceFor(sizeId: SizeId): number {
  return { P: 10, PE: 15, M: 18, G: 22 }[sizeId]
}

interface Seed {
  customer: string
  sizeId: SizeId
  mistura: string
  status: OrderStatus
  time: string
  payment: PaymentMethod
  paymentConfirmed: boolean
  salada?: string
  fromAI?: boolean
}

const seeds: Seed[] = [
  { customer: 'Maria Aparecida', sizeId: 'M', mistura: 'Bobó de Frango', status: 'Entregue', time: '11:05', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'João Batista', sizeId: 'G', mistura: 'Calabresa Acebolada', status: 'Entregue', time: '11:08', payment: 'Dinheiro', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Antônio Carlos', sizeId: 'P', mistura: 'Calabresa Acebolada', status: 'Entregue', time: '11:12', payment: 'PIX', paymentConfirmed: true },
  { customer: 'Rita de Cássia', sizeId: 'PE', mistura: 'Bobó de Frango', status: 'Entregue', time: '11:15', payment: 'Cartão', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Sebastião Pereira', sizeId: 'M', mistura: 'Calabresa Acebolada', status: 'Entregue', time: '11:20', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Cláudia Regina', sizeId: 'G', mistura: 'Bobó de Frango', status: 'Saiu para entrega', time: '11:28', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface', fromAI: true },
  { customer: 'Fernando Souza', sizeId: 'P', mistura: 'Bobó de Frango', status: 'Saiu para entrega', time: '11:32', payment: 'Dinheiro', paymentConfirmed: false },
  { customer: 'Patrícia Lima', sizeId: 'M', mistura: 'Calabresa Acebolada', status: 'Saiu para entrega', time: '11:35', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Roberto Alves', sizeId: 'PE', mistura: 'Calabresa Acebolada', status: 'Pronto', time: '11:40', payment: 'Cartão', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Juliana Martins', sizeId: 'M', mistura: 'Bobó de Frango', status: 'Pronto', time: '11:44', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface', fromAI: true },
  { customer: 'Carlos Eduardo', sizeId: 'G', mistura: 'Calabresa Acebolada', status: 'Pronto', time: '11:48', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Vanessa Oliveira', sizeId: 'P', mistura: 'Bobó de Frango', status: 'Em produção', time: '11:52', payment: 'Dinheiro', paymentConfirmed: false },
  { customer: 'Marcos Vinícius', sizeId: 'M', mistura: 'Calabresa Acebolada', status: 'Em produção', time: '11:56', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Luciana Ferreira', sizeId: 'PE', mistura: 'Bobó de Frango', status: 'Em produção', time: '12:01', payment: 'Cartão', paymentConfirmed: true, salada: 'Salada de Alface', fromAI: true },
  { customer: 'Paulo Henrique', sizeId: 'G', mistura: 'Bobó de Frango', status: 'Em produção', time: '12:05', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Adriana Costa', sizeId: 'M', mistura: 'Calabresa Acebolada', status: 'Recebido', time: '12:10', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Ricardo Gomes', sizeId: 'P', mistura: 'Calabresa Acebolada', status: 'Recebido', time: '12:14', payment: 'Dinheiro', paymentConfirmed: false },
  { customer: 'Tatiane Rocha', sizeId: 'M', mistura: 'Bobó de Frango', status: 'Recebido', time: '12:18', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface', fromAI: true },
  { customer: 'Eduardo Nunes', sizeId: 'G', mistura: 'Calabresa Acebolada', status: 'Recebido', time: '12:22', payment: 'Cartão', paymentConfirmed: true, salada: 'Salada de Alface' },
  { customer: 'Simone Barbosa', sizeId: 'PE', mistura: 'Bobó de Frango', status: 'Recebido', time: '12:27', payment: 'PIX', paymentConfirmed: true, salada: 'Salada de Alface' },
]

const baseTime = new Date('2026-06-03T11:00:00').getTime()

export const initialOrders: Order[] = seeds.map((s, i) => {
  const item: OrderItem = {
    id: `ord-${i + 1}-i1`,
    sizeId: s.sizeId,
    mistura: s.mistura,
    guarnicoes: guarnTodas,
    salada: s.salada,
    quantity: 1,
    unitPrice: priceFor(s.sizeId),
  }
  return {
    id: `ord-${i + 1}`,
    code: `#${1041 + i}`,
    customer: s.customer,
    items: [item],
    total: item.unitPrice * item.quantity,
    payment: s.payment,
    paymentConfirmed: s.paymentConfirmed,
    status: s.status,
    time: s.time,
    createdAt: baseTime + i * 60000,
    fromAI: s.fromAI,
  }
})
