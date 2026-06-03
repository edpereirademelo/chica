import { useMemo, useState } from 'react'
import {
  Search,
  Phone,
  ShoppingBag,
  Receipt,
  CalendarDays,
  X,
  Users,
  Plus,
} from 'lucide-react'
import { Card, Badge, Button, PageHeader, Modal, EmptyState } from '../components/ui'
import { useStore } from '../store/useStore'
import { brl } from '../lib/format'
import type { Customer, CustomerTag } from '../data/types'

function NewCustomerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addCustomer = useStore((s) => s.addCustomer)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const reset = () => {
    setName('')
    setPhone('')
  }

  const submit = () => {
    if (!name.trim()) return
    addCustomer({ name, phone })
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo cliente"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={!name.trim()}>Cadastrar cliente</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Joana da Silva"
            autoFocus
            className="w-full rounded-xl border border-edge bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Telefone / WhatsApp</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(18) 99999-0000"
            inputMode="tel"
            className="w-full rounded-xl border border-edge bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
          />
        </div>
        <p className="rounded-xl bg-cream px-3 py-2.5 text-xs text-muted">
          O cliente entra como <strong className="text-ink">Novo</strong> e já fica disponível na busca ao criar um pedido.
        </p>
      </div>
    </Modal>
  )
}

const tagTone: Record<CustomerTag, 'leaf' | 'peach' | 'muted'> = {
  Frequente: 'leaf',
  Novo: 'peach',
  Inativo: 'muted',
}

function CustomerPanel({
  customer,
  onClose,
}: {
  customer: Customer
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm">
      <div
        className="flex h-full w-full max-w-md flex-col bg-surface shadow-card animate-[slideUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-edge px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">Ficha do cliente</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracota/10 font-display text-xl font-extrabold text-terracota">
              {customer.name.charAt(0)}
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink">{customer.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted">
                <Phone size={13} /> {customer.phone}
              </p>
              <Badge tone={tagTone[customer.tag]} className="mt-1">
                {customer.tag}
              </Badge>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-cream p-3 text-center">
              <ShoppingBag size={16} className="mx-auto text-terracota" />
              <p className="mt-1 font-display text-lg font-bold text-ink">{customer.totalOrders}</p>
              <p className="text-[11px] text-muted">Pedidos</p>
            </div>
            <div className="rounded-xl bg-cream p-3 text-center">
              <Receipt size={16} className="mx-auto text-leaf" />
              <p className="mt-1 font-display text-lg font-bold text-ink">{brl(customer.avgTicket)}</p>
              <p className="text-[11px] text-muted">Ticket médio</p>
            </div>
            <div className="rounded-xl bg-cream p-3 text-center">
              <CalendarDays size={16} className="mx-auto text-[#8a6a1f]" />
              <p className="mt-1 font-display text-sm font-bold text-ink">{customer.lastOrder}</p>
              <p className="text-[11px] text-muted">Último pedido</p>
            </div>
          </div>

          <p className="mb-2 mt-6 text-sm font-bold text-ink">Histórico de compras</p>
          {customer.history.length === 0 ? (
            <p className="text-sm text-muted">Sem compras registradas ainda.</p>
          ) : (
            <div className="space-y-2">
              {customer.history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-edge px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{h.items}</p>
                    <p className="text-xs text-muted">{h.date}</p>
                  </div>
                  <span className="font-semibold text-ink">{brl(h.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Clientes() {
  const customers = useStore((s) => s.customers)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Customer | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    )
  }, [customers, query])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        subtitle={`${customers.length} clientes cadastrados. Clique para ver o histórico completo.`}
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={18} /> Novo cliente
          </Button>
        }
      />

      <NewCustomerModal open={addOpen} onClose={() => setAddOpen(false)} />

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou telefone…"
          className="w-full rounded-xl border border-edge bg-surface py-2.5 pl-10 pr-3 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="Nenhum cliente encontrado"
          description="Tente buscar por outro nome ou telefone."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1fr_7rem_8rem_8rem_7rem] gap-4 border-b border-edge bg-cream/60 px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted md:grid">
            <span>Cliente</span>
            <span>Pedidos</span>
            <span>Ticket médio</span>
            <span>Último pedido</span>
            <span>Segmento</span>
          </div>
          <div className="divide-y divide-edge">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="grid w-full grid-cols-1 gap-1 px-5 py-3 text-left transition-colors hover:bg-cream/60 md:grid-cols-[1fr_7rem_8rem_8rem_7rem] md:items-center md:gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracota/10 font-display text-sm font-bold text-terracota">
                    {c.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-muted">{c.phone}</p>
                  </div>
                </div>
                <span className="text-sm text-muted md:text-ink">
                  <span className="md:hidden">Pedidos: </span>{c.totalOrders}
                </span>
                <span className="text-sm text-muted md:text-ink">
                  <span className="md:hidden">Ticket: </span>{brl(c.avgTicket)}
                </span>
                <span className="text-sm text-muted md:text-ink">{c.lastOrder}</span>
                <span>
                  <Badge tone={tagTone[c.tag]}>{c.tag}</Badge>
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {selected && (
        <div onClick={() => setSelected(null)}>
          <CustomerPanel customer={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  )
}
