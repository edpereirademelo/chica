import { useMemo, useState } from 'react'
import {
  Plus,
  ChevronRight,
  CheckCircle2,
  Banknote,
  CreditCard,
  Sparkles,
  QrCode,
  Search,
  Trash2,
  Minus,
  X,
} from 'lucide-react'
import { Card, Badge, Button, PageHeader, Modal, EmptyState } from '../components/ui'
import { useStore, STATUS_FLOW, type NewOrderItemInput } from '../store/useStore'
import { brl, cx } from '../lib/format'
import { sizeLabel, itemLabel } from '../lib/orders'
import type { Order, OrderStatus, PaymentMethod, SizeId } from '../data/types'

const columnAccent: Record<OrderStatus, string> = {
  Recebido: 'border-t-muted',
  'Em produção': 'border-t-peach',
  Pronto: 'border-t-leaf',
  'Saiu para entrega': 'border-t-terracota',
  Entregue: 'border-t-ink/20',
}

const payIcon = {
  PIX: QrCode,
  Dinheiro: Banknote,
  Cartão: CreditCard,
}

function OrderCard({ order }: { order: Order }) {
  const advance = useStore((s) => s.advanceOrder)
  const PayIcon = payIcon[order.payment]
  const isLast = order.status === 'Entregue'
  const marmitas = order.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <Card className="p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
            {order.customer}
            {order.fromAI && <Sparkles size={13} className="shrink-0 text-terracota" />}
          </p>
          <p className="text-xs text-muted">
            {order.code} · {order.time} · {marmitas} marmita{marmitas > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mt-2.5 space-y-2">
        {order.items.map((it) => (
          <div key={it.id} className="rounded-lg bg-cream/70 px-2.5 py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-ink">{itemLabel(it)}</span>
              <span className="font-display text-xs font-bold text-terracota">
                {sizeLabel(it.sizeId)}
              </span>
            </div>
            <p className="text-ink">{it.mistura}</p>
            {it.guarnicoes.length > 0 && (
              <p className="text-xs text-muted">{it.guarnicoes.join(' · ')}</p>
            )}
            {it.salada && <p className="text-xs text-leaf">+ {it.salada}</p>}
            {it.observation && (
              <p className="mt-1 text-xs italic text-[#8a6a1f]">Obs.: {it.observation}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-edge pt-3">
        <div className="flex items-center gap-1.5">
          <PayIcon size={14} className="text-muted" />
          <span className="text-xs font-medium text-muted">{order.payment}</span>
          {order.payment === 'PIX' && order.paymentConfirmed && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-leaf">
              <CheckCircle2 size={12} /> confirmado
            </span>
          )}
        </div>
        <span className="font-semibold text-ink">{brl(order.total)}</span>
      </div>

      {!isLast && (
        <Button
          variant="secondary"
          className="mt-3 w-full py-2 text-xs"
          onClick={() => advance(order.id)}
        >
          Avançar
          <ChevronRight size={14} />
        </Button>
      )}
    </Card>
  )
}

// ---------- Busca de cliente (combobox) ----------
function CustomerField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const customers = useStore((s) => s.customers)
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return []
    return customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q))
      .slice(0, 5)
  }, [customers, value])

  const exact = customers.some((c) => c.name.toLowerCase() === value.trim().toLowerCase())

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar ou digitar o nome do cliente…"
        autoFocus
        className="w-full rounded-xl border border-edge bg-cream py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
      />
      {open && matches.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-edge bg-surface shadow-card">
          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(c.name)
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-cream"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terracota/10 text-xs font-bold text-terracota">
                {c.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{c.name}</span>
                <span className="block truncate text-xs text-muted">{c.phone}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      {value.trim() && !exact && (
        <p className="mt-1 text-xs text-muted">
          Cliente novo: <strong className="text-ink">{value.trim()}</strong>
        </p>
      )}
    </div>
  )
}

// ---------- Construtor de item ----------
const emptyBuilder = (
  mistura: string,
  guarnicoes: string[],
  salada?: string
): NewOrderItemInput => ({
  sizeId: 'M',
  mistura,
  guarnicoes,
  salada,
  quantity: 1,
  observation: '',
})

function NewOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sizes = useStore((s) => s.sizes)
  const menu = useStore((s) => s.menu)
  const addOrder = useStore((s) => s.addOrder)

  const misturas = menu.filter((m) => m.category === 'Mistura' && m.active && !m.soldOut)
  const guarnicoes = menu.filter((m) => m.category === 'Guarnição' && m.active && !m.soldOut)
  const saladas = menu.filter((m) => m.category === 'Salada' && m.active && !m.soldOut)

  const defGuarn = guarnicoes.map((g) => g.name)
  const defSalada = saladas[0]?.name

  const [customer, setCustomer] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('PIX')
  const [items, setItems] = useState<NewOrderItemInput[]>([])
  const [builder, setBuilder] = useState<NewOrderItemInput>(
    emptyBuilder(misturas[0]?.name ?? '', defGuarn, defSalada)
  )

  const priceOf = (id: SizeId) => sizes.find((s) => s.id === id)?.price ?? 0
  const builderValid = builder.mistura.trim().length > 0
  const builderSubtotal = priceOf(builder.sizeId) * builder.quantity
  const itemsSubtotal = items.reduce((s, it) => s + priceOf(it.sizeId) * it.quantity, 0)
  const total = itemsSubtotal + (builderValid ? builderSubtotal : 0)

  const resetAll = () => {
    setCustomer('')
    setPayment('PIX')
    setItems([])
    setBuilder(emptyBuilder(misturas[0]?.name ?? '', defGuarn, defSalada))
  }

  const toggleGuarn = (name: string) =>
    setBuilder((b) => ({
      ...b,
      guarnicoes: b.guarnicoes.includes(name)
        ? b.guarnicoes.filter((g) => g !== name)
        : [...b.guarnicoes, name],
    }))

  const addAnother = () => {
    if (!builderValid) return
    setItems((arr) => [...arr, builder])
    setBuilder(emptyBuilder(misturas[0]?.name ?? '', defGuarn, defSalada))
  }

  const submit = () => {
    const finalItems = builderValid ? [...items, builder] : items
    if (!customer.trim() || finalItems.length === 0) return
    addOrder({ customer, payment, items: finalItems })
    resetAll()
    onClose()
  }

  const canSubmit = customer.trim().length > 0 && (items.length > 0 || builderValid)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo Pedido"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={!canSubmit}>
            Adicionar pedido · {brl(total)}
          </Button>
        </>
      }
    >
      <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
        {/* Cliente */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Cliente</label>
          <CustomerField value={customer} onChange={setCustomer} />
        </div>

        {/* Itens já adicionados */}
        {items.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink">Itens do pedido</p>
            {items.map((it, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-edge bg-cream/60 px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-ink">
                    {itemLabel(it)} · {it.mistura}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {it.guarnicoes.join(' · ') || 'sem guarnições'}
                    {it.salada ? ` + ${it.salada}` : ''}
                    {it.observation ? ` · Obs.: ${it.observation}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {brl(priceOf(it.sizeId) * it.quantity)}
                  </span>
                  <button
                    onClick={() => setItems((arr) => arr.filter((_, idx) => idx !== i))}
                    className="rounded-lg p-1 text-muted hover:bg-terracota/10 hover:text-terracota"
                    aria-label="Remover item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Construtor do item atual */}
        <div className="space-y-4 rounded-xl border border-dashed border-edge p-3.5">
          <p className="text-sm font-semibold text-ink">
            {items.length > 0 ? 'Próximo item' : 'Item do pedido'}
          </p>

          {/* Tamanho */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Tamanho</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setBuilder((b) => ({ ...b, sizeId: s.id }))}
                  className={cx(
                    'rounded-xl border px-2 py-2 text-center transition-colors',
                    builder.sizeId === s.id
                      ? 'border-terracota bg-terracota/10'
                      : 'border-edge bg-surface hover:bg-cream'
                  )}
                >
                  <p className="font-display text-sm font-bold text-ink">{s.name}</p>
                  <p className="text-xs text-muted">{brl(s.price)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Mistura */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Mistura</label>
            {misturas.length === 0 ? (
              <p className="text-sm text-muted">Nenhuma mistura disponível hoje.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {misturas.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setBuilder((b) => ({ ...b, mistura: m.name }))}
                    className={cx(
                      'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                      builder.mistura === m.name
                        ? 'border-terracota bg-terracota/10 text-ink'
                        : 'border-edge bg-surface text-muted hover:bg-cream'
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guarnições */}
          {guarnicoes.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Guarnições</label>
              <div className="flex flex-wrap gap-2">
                {guarnicoes.map((g) => {
                  const on = builder.guarnicoes.includes(g.name)
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGuarn(g.name)}
                      className={cx(
                        'flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                        on
                          ? 'border-leaf bg-leaf/10 text-ink'
                          : 'border-edge bg-surface text-muted hover:bg-cream'
                      )}
                    >
                      {on && <CheckCircle2 size={13} className="text-leaf" />}
                      {g.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Salada */}
          {saladas.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Salada</label>
              <div className="flex flex-wrap gap-2">
                {saladas.map((sl) => {
                  const on = builder.salada === sl.name
                  return (
                    <button
                      key={sl.id}
                      onClick={() =>
                        setBuilder((b) => ({ ...b, salada: on ? undefined : sl.name }))
                      }
                      className={cx(
                        'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                        on
                          ? 'border-leaf bg-leaf/10 text-ink'
                          : 'border-edge bg-surface text-muted hover:bg-cream'
                      )}
                    >
                      {sl.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantidade + Observação */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Quantidade</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBuilder((b) => ({ ...b, quantity: Math.max(1, b.quantity - 1) }))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-edge text-ink hover:bg-cream"
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center font-display text-lg font-bold text-ink">
                  {builder.quantity}
                </span>
                <button
                  onClick={() => setBuilder((b) => ({ ...b, quantity: b.quantity + 1 }))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-edge text-ink hover:bg-cream"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Observação</label>
              <input
                value={builder.observation ?? ''}
                onChange={(e) => setBuilder((b) => ({ ...b, observation: e.target.value }))}
                placeholder="Ex.: sem cebola, pouco arroz…"
                className="w-full rounded-xl border border-edge bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={addAnother}
            disabled={!builderValid}
          >
            <Plus size={16} /> Adicionar outro item ao pedido
          </Button>
        </div>

        {/* Pagamento */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Pagamento</label>
          <div className="grid grid-cols-3 gap-2">
            {(['PIX', 'Dinheiro', 'Cartão'] as PaymentMethod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPayment(p)}
                className={cx(
                  'rounded-xl border px-2 py-2 text-sm font-medium transition-colors',
                  payment === p
                    ? 'border-terracota bg-terracota/10 text-ink'
                    : 'border-edge bg-surface text-muted hover:bg-cream'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function Pedidos() {
  const orders = useStore((s) => s.orders)
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q) ||
        o.items.some((it) => it.mistura.toLowerCase().includes(q))
    )
  }, [orders, query])

  const byStatus = useMemo(() => {
    const map: Record<OrderStatus, Order[]> = {
      Recebido: [],
      'Em produção': [],
      Pronto: [],
      'Saiu para entrega': [],
      Entregue: [],
    }
    for (const o of filtered) map[o.status].push(o)
    for (const k of STATUS_FLOW) map[k].sort((a, b) => b.createdAt - a.createdAt)
    return map
  }, [filtered])

  const hasResults = filtered.length > 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos"
        subtitle="Acompanhe a cozinha em tempo real e avance cada pedido conforme fica pronto."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Novo Pedido
          </Button>
        }
      />

      {/* Busca */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por cliente, código (#1042) ou mistura…"
          className="w-full rounded-xl border border-edge bg-surface py-2.5 pl-10 pr-9 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted hover:bg-ink/5"
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {query && !hasResults ? (
        <EmptyState
          icon={<Search size={32} />}
          title="Nenhum pedido encontrado"
          description={`Nada corresponde a "${query}". Tente outro termo.`}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {STATUS_FLOW.map((status) => (
            <div key={status} className="w-72 shrink-0 lg:w-auto">
              <div
                className={cx(
                  'mb-3 flex items-center justify-between rounded-xl border-t-4 bg-surface px-3 py-2 shadow-soft',
                  columnAccent[status]
                )}
              >
                <span className="text-sm font-bold text-ink">{status}</span>
                <Badge tone="muted">{byStatus[status].length}</Badge>
              </div>
              <div className="space-y-3">
                {byStatus[status].length === 0 ? (
                  <div className="rounded-xl border border-dashed border-edge px-3 py-6 text-center text-xs text-muted">
                    Nenhum pedido
                  </div>
                ) : (
                  byStatus[status].map((o) => <OrderCard key={o.id} order={o} />)
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewOrderModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
