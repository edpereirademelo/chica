import { useState } from 'react'
import { Tags, Check, Pencil } from 'lucide-react'
import { Card, Badge, Button, PageHeader } from '../components/ui'
import { useStore } from '../store/useStore'
import { brl } from '../lib/format'
import type { SizeId } from '../data/types'

export function Precos() {
  const sizes = useStore((s) => s.sizes)
  const updatePrice = useStore((s) => s.updatePrice)
  const [editing, setEditing] = useState<SizeId | null>(null)
  const [draft, setDraft] = useState('')

  const startEdit = (id: SizeId, price: number) => {
    setEditing(id)
    setDraft(String(price).replace('.', ','))
  }

  const save = (id: SizeId) => {
    const parsed = parseFloat(draft.replace(',', '.'))
    if (!isNaN(parsed)) updatePrice(id, parsed)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tamanhos & Preços"
        subtitle="Ajuste os preços das marmitas. As mudanças valem na hora para novos pedidos."
      />

      <Card className="overflow-hidden">
        {/* cabeçalho desktop */}
        <div className="hidden grid-cols-[1fr_8rem_1fr_8rem] gap-4 border-b border-edge bg-cream/60 px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted sm:grid">
          <span>Tamanho</span>
          <span>Preço</span>
          <span>Regra de composição</span>
          <span className="text-right">Ação</span>
        </div>

        <div className="divide-y divide-edge">
          {sizes.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[1fr_8rem_1fr_8rem] sm:items-center sm:gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracota/10 font-display text-sm font-extrabold text-terracota">
                  {s.id === 'PE' ? 'PE' : s.id}
                </span>
                <div>
                  <p className="font-semibold text-ink">{s.name}</p>
                  <p className="text-xs text-muted sm:hidden">{s.rule}</p>
                </div>
              </div>

              <div>
                {editing === s.id ? (
                  <div className="flex items-center gap-1 rounded-xl border border-terracota bg-cream px-2 py-1.5 focus-within:ring-2 focus-within:ring-terracota/20">
                    <span className="text-sm text-muted">R$</span>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && save(s.id)}
                      autoFocus
                      inputMode="decimal"
                      className="w-16 bg-transparent text-sm font-semibold text-ink outline-none"
                    />
                  </div>
                ) : (
                  <span className="font-display text-lg font-bold text-ink">
                    {brl(s.price)}
                  </span>
                )}
              </div>

              <p className="hidden text-sm text-muted sm:block">{s.rule}</p>

              <div className="flex sm:justify-end">
                {editing === s.id ? (
                  <Button className="py-2" onClick={() => save(s.id)}>
                    <Check size={15} /> Salvar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="py-2"
                    onClick={() => startEdit(s.id, s.price)}
                  >
                    <Pencil size={14} /> Editar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex items-start gap-3 border-peach/40 bg-peach/10 p-5">
        <span className="rounded-lg bg-peach/40 p-2 text-[#8a6a1f]">
          <Tags size={18} />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-ink">Como funcionam os tamanhos</p>
          <p className="mt-1 text-muted">
            As marmitas <Badge tone="peach">P</Badge> e <Badge tone="peach">M</Badge> vêm com 1 mistura e todas as guarnições.
            As versões <Badge tone="peach">P Especial</Badge> e <Badge tone="peach">G</Badge> vêm completas, com tudo do cardápio do dia.
          </p>
        </div>
      </Card>
    </div>
  )
}
