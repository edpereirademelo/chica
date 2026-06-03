import { useState, type ReactNode } from 'react'
import { Lock, Sparkles, Rocket, MessageCircle } from 'lucide-react'
import { Button, Modal, Badge } from './ui'

export function TeaserShell({
  phase,
  title,
  description,
  children,
}: {
  phase: 2 | 3
  title: string
  description: string
  children: ReactNode // o mockup do módulo
}) {
  const [modal, setModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Ribbon */}
      <div className="flex flex-col gap-4 rounded-2xl border border-peach/50 bg-gradient-to-r from-peach/25 to-peach/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-peach/50 p-2.5 text-[#8a6a1f]">
            <Lock size={22} strokeWidth={2.2} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                {title}
              </h1>
              <Badge tone="peach">Disponível na Fase {phase}</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
          </div>
        </div>
        <Button onClick={() => setModal(true)} className="shrink-0">
          <Sparkles size={16} /> Quero desbloquear este módulo
        </Button>
      </div>

      {/* Mockup com overlay de preview */}
      <div className="relative">
        <div className="pointer-events-none select-none blur-[1.5px] saturate-[0.85] opacity-90">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cream/30">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-edge bg-surface/95 px-6 py-5 text-center shadow-card backdrop-blur">
            <span className="rounded-full bg-terracota/10 p-3 text-terracota">
              <Rocket size={24} />
            </span>
            <div>
              <p className="font-display font-bold text-ink">Prévia do módulo</p>
              <p className="max-w-xs text-sm text-muted">
                Desbloqueie na Fase {phase} para usar com seus dados reais.
              </p>
            </div>
            <Button variant="outline" onClick={() => setModal(true)}>
              Saiba mais
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Fale com a Plyvo para liberar"
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(false)}>
              Agora não
            </Button>
            <a
              href="https://wa.me/5518992371799"
              target="_blank"
              rel="noreferrer"
            >
              <Button>
                <MessageCircle size={16} /> Falar no WhatsApp
              </Button>
            </a>
          </>
        }
      >
        <div className="space-y-3 text-sm text-ink">
          <p>
            O módulo <strong>{title}</strong> faz parte da{' '}
            <strong>Fase {phase}</strong> do sistema da Marmitaria da Chica.
          </p>
          <p className="text-muted">{description}</p>
          <div className="rounded-xl bg-cream p-3 text-muted">
            Quer ativar agora? A equipe da <strong className="text-terracota">Plyvo</strong> libera
            este módulo e cuida de toda a configuração para você. É só chamar! 🚀
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Helpers de mockup ------------------------------------------------------

export function MockCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-edge bg-surface p-5 shadow-soft ${className}`}>
      {children}
    </div>
  )
}

export function MockBars({ data }: { data: number[] }) {
  const max = Math.max(...data)
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg bg-gradient-to-t from-terracota to-[#e06848]"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}
