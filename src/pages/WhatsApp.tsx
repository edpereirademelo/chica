import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Send,
  CheckCheck,
  ArrowRight,
  Bot,
  ArrowLeft,
} from 'lucide-react'
import { Card, Badge, Button, PageHeader } from '../components/ui'
import { useStore } from '../store/useStore'
import { brand, sizeOptions } from '../data/menu'
import { brl, cx } from '../lib/format'
import type { Conversation } from '../data/types'

const statusTone: Record<Conversation['status'], 'terracota' | 'leaf' | 'muted'> = {
  'Em atendimento': 'terracota',
  'Pedido pronto': 'leaf',
  Convertido: 'muted',
}

function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="divide-y divide-edge">
      {conversations.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cx(
            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
            selectedId === c.id ? 'bg-cream' : 'hover:bg-cream/60'
          )}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white"
            style={{ backgroundColor: c.avatarColor }}
          >
            {c.customer.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-ink">{c.customer}</p>
              <span className="shrink-0 text-xs text-muted">{c.lastTime}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs text-muted">{c.lastMessage}</p>
              {c.unread > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-terracota px-1 text-[10px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </div>
            <Badge tone={statusTone[c.status]} className="mt-1">
              {c.status}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  )
}

function ChatView({
  conv,
  onBack,
  onConvert,
}: {
  conv: Conversation
  onBack: () => void
  onConvert: () => void
}) {
  const size = conv.draftOrder
    ? sizeOptions.find((s) => s.id === conv.draftOrder!.sizeId)
    : undefined
  const converted = conv.status === 'Convertido'

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-edge px-4 py-3">
        <button onClick={onBack} className="rounded-lg p-1 text-muted hover:bg-ink/5 md:hidden">
          <ArrowLeft size={20} />
        </button>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full font-display font-bold text-white"
          style={{ backgroundColor: conv.avatarColor }}
        >
          {conv.customer.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{conv.customer}</p>
          <p className="text-xs text-muted">{conv.phone}</p>
        </div>
        <Badge tone="terracota">
          <Bot size={12} /> Atendido por IA
        </Badge>
      </div>

      {/* mensagens */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 px-4 py-4">
        {conv.messages.map((m, i) => (
          <div
            key={i}
            className={cx('flex', m.role === 'ia' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cx(
                'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-soft',
                m.role === 'ia'
                  ? 'rounded-br-md bg-terracota text-white'
                  : 'rounded-bl-md bg-surface text-ink'
              )}
            >
              {m.role === 'ia' && (
                <p className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/80">
                  <Sparkles size={10} /> IA da Chica
                </p>
              )}
              <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
              <p
                className={cx(
                  'mt-1 flex items-center justify-end gap-1 text-[10px]',
                  m.role === 'ia' ? 'text-white/70' : 'text-muted'
                )}
              >
                {m.time}
                {m.role === 'ia' && <CheckCheck size={12} />}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* rodapé: converter em pedido */}
      <div className="border-t border-edge bg-surface px-4 py-3">
        {conv.draftOrder && size ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="font-semibold text-ink">
                Pedido montado pela IA:
              </p>
              <p className="text-muted">
                Marmita {size.name} · {conv.draftOrder.mistura} · {brl(size.price)} · {conv.draftOrder.payment}
              </p>
            </div>
            <Button onClick={onConvert} disabled={converted}>
              {converted ? (
                <>
                  <CheckCheck size={16} /> Convertido
                </>
              ) : (
                <>
                  Converter em pedido <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Send size={15} />
            A IA ainda está coletando os dados do pedido…
          </div>
        )}
      </div>
    </div>
  )
}

export function WhatsApp() {
  const conversations = useStore((s) => s.conversations)
  const convert = useStore((s) => s.convertConversation)
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? '')
  const [mobileChat, setMobileChat] = useState(false)

  const selected = conversations.find((c) => c.id === selectedId)

  const handleConvert = () => {
    if (!selected) return
    convert(selected.id)
    navigate('/pedidos')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atendimento WhatsApp"
        subtitle="Sua IA atende os clientes, monta o pedido e você só confirma. Funciona das 11h às 14h."
        action={
          <Badge tone="terracota" className="px-3 py-1.5">
            <Bot size={14} /> IA atendendo agora
          </Badge>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid h-[calc(100vh-16rem)] min-h-[480px] grid-cols-1 md:grid-cols-[20rem_1fr]">
          {/* Lista */}
          <div
            className={cx(
              'flex flex-col border-edge md:border-r',
              mobileChat && 'hidden md:flex'
            )}
          >
            <div className="border-b border-edge px-4 py-3">
              <p className="font-display font-bold text-ink">Conversas</p>
              <p className="text-xs text-muted">{brand.whatsapp}</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id)
                  setMobileChat(true)
                }}
              />
            </div>
          </div>

          {/* Chat */}
          <div className={cx('min-h-0', !mobileChat && 'hidden md:block')}>
            {selected ? (
              <ChatView
                conv={selected}
                onBack={() => setMobileChat(false)}
                onConvert={handleConvert}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                Selecione uma conversa
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
