import type { Order, SizeId } from '../data/types'

export function sizeLabel(id: SizeId): string {
  return id === 'PE' ? 'P Especial' : id
}

/** total de marmitas (somando quantidades de todos os itens) */
export function orderMarmitas(order: Order): number {
  return order.items.reduce((s, i) => s + i.quantity, 0)
}

/** descrição curta do pedido para listas */
export function orderSummary(order: Order): string {
  const [first, ...rest] = order.items
  if (!first) return '—'
  const base = `${first.quantity > 1 ? `${first.quantity}× ` : ''}Marmita ${sizeLabel(
    first.sizeId
  )} · ${first.mistura}`
  if (rest.length === 0) return base
  const extra = rest.reduce((s, i) => s + i.quantity, 0)
  return `${base} +${extra} item${extra > 1 ? 's' : ''}`
}

export function itemLabel(item: { quantity: number; sizeId: SizeId }): string {
  return `${item.quantity > 1 ? `${item.quantity}× ` : ''}Marmita ${sizeLabel(item.sizeId)}`
}
