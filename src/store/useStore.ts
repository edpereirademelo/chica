import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Conversation,
  Customer,
  CustomerTag,
  MenuCategory,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  SizeId,
  SizeOption,
} from '../data/types'
import { menuCatalog, sizeOptions } from '../data/menu'
import { initialOrders } from '../data/orders'
import { initialCustomers } from '../data/customers'
import { initialConversations } from '../data/conversations'
import { nowTime } from '../lib/format'

export const STATUS_FLOW: OrderStatus[] = [
  'Recebido',
  'Em produção',
  'Pronto',
  'Saiu para entrega',
  'Entregue',
]

export interface NewOrderItemInput {
  sizeId: SizeId
  mistura: string
  guarnicoes: string[]
  salada?: string
  quantity: number
  observation?: string
}

export interface NewOrderInput {
  customer: string
  items: NewOrderItemInput[]
  payment: PaymentMethod
  fromAI?: boolean
}

export interface NewMenuItemInput {
  name: string
  category: MenuCategory
  description: string
}

export interface NewCustomerInput {
  name: string
  phone: string
}

interface StoreState {
  menu: MenuItem[]
  sizes: SizeOption[]
  orders: Order[]
  customers: Customer[]
  conversations: Conversation[]

  // Cardápio
  toggleMenuActive: (id: string) => void
  toggleSoldOut: (id: string) => void
  addMenuItem: (input: NewMenuItemInput) => MenuItem

  // Tamanhos & preços
  updatePrice: (id: SizeId, price: number) => void

  // Pedidos
  advanceOrder: (id: string) => void
  addOrder: (input: NewOrderInput) => Order

  // Clientes
  addCustomer: (input: NewCustomerInput) => Customer

  // WhatsApp
  convertConversation: (id: string) => Order | null
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/** próximo código de pedido (#1234) a partir do maior existente */
function nextCode(orders: Order[]): string {
  const max = orders.reduce((m, o) => {
    const n = parseInt(o.code.replace('#', ''), 10)
    return isNaN(n) ? m : Math.max(m, n)
  }, 1040)
  return `#${max + 1}`
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      menu: menuCatalog,
      sizes: sizeOptions,
      orders: initialOrders,
      customers: initialCustomers,
      conversations: initialConversations,

      toggleMenuActive: (id) =>
        set((s) => ({
          menu: s.menu.map((m) => (m.id === id ? { ...m, active: !m.active } : m)),
        })),

      toggleSoldOut: (id) =>
        set((s) => ({
          menu: s.menu.map((m) => (m.id === id ? { ...m, soldOut: !m.soldOut } : m)),
        })),

      addMenuItem: (input) => {
        const item: MenuItem = {
          id: `menu-${uid()}`,
          name: input.name.trim(),
          description: input.description.trim(),
          category: input.category,
          active: true,
          soldOut: false,
        }
        set((s) => ({ menu: [...s.menu, item] }))
        return item
      },

      updatePrice: (id, price) =>
        set((s) => ({
          sizes: s.sizes.map((sz) =>
            sz.id === id ? { ...sz, price: Math.max(0, price) } : sz
          ),
        })),

      advanceOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o
            const idx = STATUS_FLOW.indexOf(o.status)
            if (idx >= STATUS_FLOW.length - 1) return o
            return { ...o, status: STATUS_FLOW[idx + 1] }
          }),
        })),

      addOrder: (input) => {
        const sizes = get().sizes
        const orderId = `ord-${uid()}`
        const items: OrderItem[] = input.items.map((it, idx) => {
          const size = sizes.find((s) => s.id === it.sizeId)
          return {
            id: `${orderId}-i${idx + 1}`,
            sizeId: it.sizeId,
            mistura: it.mistura,
            guarnicoes: it.guarnicoes,
            salada: it.salada,
            quantity: Math.max(1, it.quantity),
            observation: it.observation?.trim() || undefined,
            unitPrice: size?.price ?? 0,
          }
        })
        const total = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0)
        const order: Order = {
          id: orderId,
          code: nextCode(get().orders),
          customer: input.customer.trim(),
          items,
          total,
          payment: input.payment,
          paymentConfirmed: input.payment === 'PIX',
          status: 'Recebido',
          time: nowTime(),
          createdAt: Date.now(),
          fromAI: input.fromAI,
        }
        set((s) => ({ orders: [order, ...s.orders] }))
        return order
      },

      addCustomer: (input) => {
        const customer: Customer = {
          id: `cli-${uid()}`,
          name: input.name.trim(),
          phone: input.phone.trim(),
          totalOrders: 0,
          avgTicket: 0,
          lastOrder: '—',
          tag: 'Novo' as CustomerTag,
          history: [],
        }
        set((s) => ({ customers: [customer, ...s.customers] }))
        return customer
      },

      convertConversation: (id) => {
        const conv = get().conversations.find((c) => c.id === id)
        if (!conv || !conv.draftOrder) return null
        const order = get().addOrder({
          customer: conv.customer,
          payment: conv.draftOrder.payment,
          fromAI: true,
          items: [
            {
              sizeId: conv.draftOrder.sizeId,
              mistura: conv.draftOrder.mistura,
              guarnicoes: conv.draftOrder.guarnicoes,
              salada: conv.draftOrder.salada,
              quantity: 1,
            },
          ],
        })
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, status: 'Convertido', unread: 0 } : c
          ),
        }))
        return order
      },
    }),
    {
      name: 'chica-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        menu: s.menu,
        sizes: s.sizes,
        orders: s.orders,
        customers: s.customers,
        conversations: s.conversations,
      }),
    }
  )
)

// Seletores derivados ----------------------------------------------------

function marmitasOf(order: Order): number {
  return order.items.reduce((s, i) => s + i.quantity, 0)
}

export function todayStats(orders: Order[]) {
  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  const marmitas = orders.reduce((sum, o) => sum + marmitasOf(o), 0)
  const open = orders.filter((o) => o.status !== 'Entregue').length
  const avgTicket = orders.length > 0 ? revenue / orders.length : 0
  return { revenue, marmitas, open, avgTicket }
}

export function misturaRanking(orders: Order[]) {
  const map = new Map<string, number>()
  for (const o of orders) {
    for (const it of o.items) {
      map.set(it.mistura, (map.get(it.mistura) ?? 0) + it.quantity)
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
