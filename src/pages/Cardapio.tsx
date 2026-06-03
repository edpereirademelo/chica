import { useState } from 'react'
import {
  UtensilsCrossed,
  Soup,
  Salad,
  Wheat,
  Check,
  Ban,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import { Card, Badge, Button, PageHeader, Modal } from '../components/ui'
import { useStore } from '../store/useStore'
import { categoryOrder } from '../data/menu'
import { cx } from '../lib/format'
import type { MenuCategory } from '../data/types'

const categoryIcon: Record<MenuCategory, typeof Soup> = {
  Base: Wheat,
  Mistura: Soup,
  Guarnição: UtensilsCrossed,
  Salada: Salad,
}

function AddDishModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addMenuItem = useStore((s) => s.addMenuItem)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<MenuCategory>('Mistura')
  const [description, setDescription] = useState('')

  const reset = () => {
    setName('')
    setCategory('Mistura')
    setDescription('')
  }

  const submit = () => {
    if (!name.trim()) return
    addMenuItem({ name, category, description })
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adicionar prato"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={!name.trim()}>
            Adicionar ao cardápio de hoje
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Nome do prato</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Frango Grelhado"
            autoFocus
            className="w-full rounded-xl border border-edge bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Categoria</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categoryOrder.map((c) => {
              const Icon = categoryIcon[c]
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cx(
                    'flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors',
                    category === c
                      ? 'border-terracota bg-terracota/10 text-ink'
                      : 'border-edge bg-surface text-muted hover:bg-cream'
                  )}
                >
                  <Icon size={16} />
                  {c}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Descrição (opcional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex.: Suculento, temperado na brasa"
            className="w-full rounded-xl border border-edge bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-terracota focus:ring-2 focus:ring-terracota/20"
          />
        </div>
        <p className="rounded-xl bg-cream px-3 py-2.5 text-xs text-muted">
          O prato entra no catálogo e já fica ativo no cardápio de hoje. Você pode desativar ou marcar como esgotado quando quiser.
        </p>
      </div>
    </Modal>
  )
}

export function Cardapio() {
  const menu = useStore((s) => s.menu)
  const toggleActive = useStore((s) => s.toggleMenuActive)
  const toggleSoldOut = useStore((s) => s.toggleSoldOut)
  const [addOpen, setAddOpen] = useState(false)

  const published = menu.filter((m) => m.active && !m.soldOut)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cardápio do Dia"
        subtitle="Monte o cardápio de hoje. As alterações refletem na hora nas outras telas."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={18} /> Adicionar prato
          </Button>
        }
      />

      <AddDishModal open={addOpen} onClose={() => setAddOpen(false)} />

      {/* Resumo publicado */}
      <Card className="border-leaf/30 bg-leaf/5 p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-leaf" />
          <h2 className="font-display font-bold text-ink">
            Cardápio publicado para hoje
          </h2>
          <Badge tone="leaf">{published.length} itens ativos</Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {published.length === 0 && (
            <p className="text-sm text-muted">
              Nenhum item ativo ainda. Ative os pratos abaixo.
            </p>
          )}
          {published.map((m) => (
            <span
              key={m.id}
              className="rounded-full border border-leaf/30 bg-surface px-3 py-1 text-sm font-medium text-ink"
            >
              {m.name}
            </span>
          ))}
        </div>
      </Card>

      {/* Categorias */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categoryOrder.map((cat) => {
          const Icon = categoryIcon[cat]
          const items = menu.filter((m) => m.category === cat)
          return (
            <Card key={cat} className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-edge px-5 py-3.5">
                <span className="rounded-lg bg-terracota/10 p-1.5 text-terracota">
                  <Icon size={18} />
                </span>
                <h3 className="font-display font-bold text-ink">{cat}</h3>
              </div>
              <div className="divide-y divide-edge">
                {items.map((m) => (
                  <div
                    key={m.id}
                    className={cx(
                      'flex items-start gap-3 px-5 py-4 transition-colors',
                      !m.active && 'opacity-50',
                      m.soldOut && 'bg-terracota/5'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{m.name}</p>
                        {m.soldOut && <Badge tone="terracota">Esgotado</Badge>}
                        {!m.active && !m.soldOut && (
                          <Badge tone="muted">Fora do cardápio</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">{m.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {/* Toggle ativo */}
                      <button
                        onClick={() => toggleActive(m.id)}
                        className={cx(
                          'flex h-6 w-11 items-center rounded-full px-0.5 transition-colors',
                          m.active ? 'bg-leaf justify-end' : 'bg-ink/15 justify-start'
                        )}
                        aria-label={m.active ? 'Remover do cardápio' : 'Adicionar ao cardápio'}
                        title={m.active ? 'No cardápio' : 'Fora do cardápio'}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                          {m.active && <Check size={12} className="text-leaf" strokeWidth={3} />}
                        </span>
                      </button>
                      {/* Esgotado */}
                      <button
                        onClick={() => toggleSoldOut(m.id)}
                        disabled={!m.active}
                        className={cx(
                          'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors disabled:opacity-40',
                          m.soldOut
                            ? 'bg-terracota text-white hover:bg-terracota-dark'
                            : 'border border-edge text-muted hover:bg-cream'
                        )}
                      >
                        <Ban size={12} />
                        {m.soldOut ? 'Esgotado' : 'Marcar esgotado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
