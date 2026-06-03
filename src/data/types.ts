// Tipos centrais do domínio da Marmitaria da Chica

export type MenuCategory = 'Base' | 'Mistura' | 'Guarnição' | 'Salada'

export interface MenuItem {
  id: string
  name: string
  description: string
  category: MenuCategory
  /** Está incluído no cardápio publicado de hoje? */
  active: boolean
  /** Marcado como esgotado pelo dono */
  soldOut: boolean
}

export type SizeId = 'P' | 'PE' | 'M' | 'G'

export interface SizeOption {
  id: SizeId
  name: string
  price: number
  rule: string
}

export type PaymentMethod = 'PIX' | 'Dinheiro' | 'Cartão'

export type OrderStatus =
  | 'Recebido'
  | 'Em produção'
  | 'Pronto'
  | 'Saiu para entrega'
  | 'Entregue'

export interface OrderItem {
  id: string
  sizeId: SizeId
  mistura: string
  guarnicoes: string[]
  salada?: string
  quantity: number
  observation?: string
  unitPrice: number
}

export interface Order {
  id: string
  code: string // ex.: #1042
  customer: string
  items: OrderItem[]
  total: number
  payment: PaymentMethod
  paymentConfirmed: boolean
  status: OrderStatus
  time: string // "11:42"
  createdAt: number // timestamp para ordenação
  fromAI?: boolean
}

export type CustomerTag = 'Frequente' | 'Novo' | 'Inativo'

export interface CustomerPurchase {
  date: string // "28/05"
  items: string
  total: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  totalOrders: number
  avgTicket: number
  lastOrder: string
  tag: CustomerTag
  history: CustomerPurchase[]
}

export interface SalesPoint {
  day: string // "Qui"
  date: string // "28/05"
  revenue: number
  marmitas: number
}

export type ChatRole = 'cliente' | 'ia'

export interface ChatMessage {
  role: ChatRole
  text: string
  time: string
}

export interface Conversation {
  id: string
  customer: string
  phone: string
  lastMessage: string
  lastTime: string
  unread: number
  status: 'Em atendimento' | 'Pedido pronto' | 'Convertido'
  avatarColor: string
  messages: ChatMessage[]
  /** Resumo do pedido montado pela IA, usado ao converter */
  draftOrder?: {
    sizeId: SizeId
    mistura: string
    guarnicoes: string[]
    salada?: string
    payment: PaymentMethod
  }
}
