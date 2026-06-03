import {
  DollarSign,
  UtensilsCrossed,
  Clock,
  Receipt,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Card, Badge, PageHeader } from '../components/ui'
import { useStore, todayStats, misturaRanking } from '../store/useStore'
import { salesLast7Days } from '../data/sales'
import { brand } from '../data/menu'
import { brl, cx } from '../lib/format'
import { orderSummary } from '../lib/orders'
import type { OrderStatus } from '../data/types'

const statusTone: Record<OrderStatus, string> = {
  Recebido: 'bg-ink/5 text-muted',
  'Em produção': 'bg-peach/30 text-[#8a6a1f]',
  Pronto: 'bg-leaf/12 text-leaf',
  'Saiu para entrega': 'bg-terracota/10 text-terracota',
  Entregue: 'bg-ink/5 text-muted',
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof DollarSign
  label: string
  value: string
  hint?: string
  tone: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-extrabold text-ink">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        <div className={cx('rounded-xl p-2.5', tone)}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
    </Card>
  )
}

export function Dashboard() {
  const orders = useStore((s) => s.orders)
  const stats = todayStats(orders)
  const ranking = misturaRanking(orders)
  const maxRank = ranking[0]?.count ?? 1
  const goalPct = Math.min(100, Math.round((stats.marmitas / brand.dailyGoal) * 100))

  // série dos 7 dias com hoje preenchido a partir dos pedidos
  const chartData = salesLast7Days.map((p) =>
    p.date === '03/06'
      ? { ...p, revenue: stats.revenue, marmitas: stats.marmitas }
      : p
  )

  const recent = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bom dia, Chica! ☀️"
        subtitle="Aqui está o resumo do seu dia — 03 de junho de 2026"
      />

      {/* Cards do topo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Faturamento de hoje"
          value={brl(stats.revenue)}
          hint="Atualizado em tempo real"
          tone="bg-terracota/10 text-terracota"
        />
        <StatCard
          icon={UtensilsCrossed}
          label="Marmitas vendidas"
          value={`${stats.marmitas} / ${brand.dailyGoal}`}
          hint={`${goalPct}% da meta do dia`}
          tone="bg-leaf/12 text-leaf"
        />
        <StatCard
          icon={Clock}
          label="Pedidos em aberto"
          value={String(stats.open)}
          hint="Aguardando produção ou entrega"
          tone="bg-peach/40 text-[#8a6a1f]"
        />
        <StatCard
          icon={Receipt}
          label="Ticket médio"
          value={brl(stats.avgTicket)}
          hint="Por pedido"
          tone="bg-ink/5 text-ink"
        />
      </div>

      {/* Meta */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Meta de marmitas do dia</p>
          <Badge tone="leaf">{goalPct}%</Badge>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-ink/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf to-[#7a9c63] transition-all duration-500"
            style={{ width: `${goalPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Faltam <strong className="text-ink">{Math.max(0, brand.dailyGoal - stats.marmitas)}</strong> marmitas para bater a meta de {brand.dailyGoal}.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico de vendas */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Vendas dos últimos 7 dias
              </h2>
              <p className="text-xs text-muted">Faturamento diário (R$)</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-leaf">
              <TrendingUp size={16} /> +12% na semana
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8472A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C8472A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE0CD" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#8A7866', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8A7866', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [brl(v), 'Faturamento']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #EAE0CD',
                    boxShadow: '0 8px 24px rgba(46,27,16,0.08)',
                    fontSize: 13,
                  }}
                  labelStyle={{ color: '#2E1B10', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C8472A"
                  strokeWidth={2.5}
                  fill="url(#rev)"
                  dot={{ r: 3, fill: '#C8472A' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Ranking de misturas */}
        <Card className="p-5">
          <h2 className="font-display text-lg font-bold text-ink">
            Misturas mais pedidas hoje
          </h2>
          <p className="text-xs text-muted">Ranking por número de pedidos</p>
          <div className="mt-4 space-y-4">
            {ranking.map((r, i) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracota/10 text-xs font-bold text-terracota">
                      {i + 1}
                    </span>
                    {r.name}
                  </span>
                  <span className="font-semibold text-muted">{r.count}</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full bg-terracota transition-all duration-500"
                    style={{ width: `${(r.count / maxRank) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Últimos pedidos */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-edge px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">
            Últimos pedidos recebidos
          </h2>
          <a href="/pedidos" className="flex items-center gap-1 text-sm font-semibold text-terracota hover:text-terracota-dark">
            Ver todos <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="divide-y divide-edge">
          {recent.map((o) => (
            <div key={o.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm font-bold text-terracota">
                {o.customer.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {o.customer} <span className="font-normal text-muted">· {o.code}</span>
                </p>
                <p className="truncate text-xs text-muted">{orderSummary(o)}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-ink">{brl(o.total)}</p>
                <p className="text-xs text-muted">{o.time}</p>
              </div>
              <span className={cx('rounded-full px-2.5 py-1 text-xs font-semibold', statusTone[o.status])}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
