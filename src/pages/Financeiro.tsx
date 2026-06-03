import { useMemo, useState } from 'react'
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  PiggyBank,
  QrCode,
  Banknote,
  CreditCard,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building2,
  Receipt,
  Percent,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, Badge, PageHeader } from '../components/ui'
import { brl, cx } from '../lib/format'
import {
  periodOptions,
  financeByPeriod,
  saldoEmCaixa,
  dreMes,
  payables,
  receivables,
  type PeriodId,
  type PayableStatus,
} from '../data/finance'

const COLORS = {
  entradas: '#5B7B4A',
  saidas: '#C8472A',
}

const paymentMeta = {
  PIX: { color: '#C8472A', icon: QrCode },
  Dinheiro: { color: '#5B7B4A', icon: Banknote },
  Cartão: { color: '#EFC987', icon: CreditCard },
}

const statusTone: Record<PayableStatus, 'leaf' | 'peach' | 'terracota'> = {
  Pago: 'leaf',
  Pendente: 'peach',
  Atrasado: 'terracota',
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Wallet
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
          <p className="mt-1.5 font-display text-2xl font-extrabold text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        <div className={cx('rounded-xl p-2.5', tone)}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
    </Card>
  )
}

export function Financeiro() {
  const [period, setPeriod] = useState<PeriodId>('mes')
  const data = financeByPeriod[period]

  const { entradas, saidas, lucro, margem, ticket } = useMemo(() => {
    const entradas = data.cashflow.reduce((s, p) => s + p.entradas, 0)
    const saidas = data.cashflow.reduce((s, p) => s + p.saidas, 0)
    const lucro = entradas - saidas
    const margem = entradas > 0 ? (lucro / entradas) * 100 : 0
    const ticket = data.marmitas > 0 ? entradas / data.marmitas : 0
    return { entradas, saidas, lucro, margem, ticket }
  }, [data])

  const cmvSlice = data.expenses.find((e) => e.category.startsWith('Insumos'))
  const cmvPorMarmita = cmvSlice && data.marmitas ? cmvSlice.value / data.marmitas : 0
  const maxExpense = Math.max(...data.expenses.map((e) => e.value))

  const totalPagar = payables.reduce((s, p) => s + p.value, 0)
  const atrasadas = payables.filter((p) => p.status === 'Atrasado')
  const totalReceber = receivables.reduce((s, r) => s + r.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        subtitle={`Visão do dinheiro do negócio · ${data.rangeLabel}`}
        action={
          <div className="flex flex-wrap gap-1 rounded-xl border border-edge bg-surface p-1">
            {periodOptions.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cx(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  period === p.id
                    ? 'bg-terracota text-white shadow-soft'
                    : 'text-muted hover:bg-ink/5 hover:text-ink'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={Wallet}
          label="Saldo em caixa"
          value={brl(saldoEmCaixa)}
          hint="Conta da marmitaria hoje"
          tone="bg-ink/5 text-ink"
        />
        <Kpi
          icon={ArrowDownCircle}
          label="Entradas no período"
          value={brl(entradas)}
          hint={`${data.marmitas} marmitas vendidas`}
          tone="bg-leaf/12 text-leaf"
        />
        <Kpi
          icon={ArrowUpCircle}
          label="Saídas no período"
          value={brl(saidas)}
          hint="Custos e despesas pagos"
          tone="bg-terracota/10 text-terracota"
        />
        <Kpi
          icon={PiggyBank}
          label="Lucro líquido"
          value={brl(lucro)}
          hint={`Margem de ${margem.toFixed(1).replace('.', ',')}%`}
          tone="bg-peach/40 text-[#8a6a1f]"
        />
      </div>

      {/* Fluxo de caixa */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Fluxo de caixa</h2>
            <p className="text-xs text-muted">Entradas e saídas — {data.rangeLabel}</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-leaf">
            <TrendingUp size={16} /> Saldo positivo
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.cashflow} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE0CD" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#8A7866', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8A7866', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number, n) => [brl(v), n === 'entradas' ? 'Entradas' : 'Saídas']}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #EAE0CD',
                  boxShadow: '0 8px 24px rgba(46,27,16,0.08)',
                  fontSize: 13,
                }}
                labelStyle={{ color: '#2E1B10', fontWeight: 600 }}
                cursor={{ fill: 'rgba(46,27,16,0.04)' }}
              />
              <Legend
                formatter={(v) => (v === 'entradas' ? 'Entradas' : 'Saídas')}
                wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
              />
              <Bar dataKey="entradas" fill={COLORS.entradas} radius={[6, 6, 0, 0]} maxBarSize={48} />
              <Bar dataKey="saidas" fill={COLORS.saidas} radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recebimentos + Despesas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Forma de pagamento */}
        <Card className="p-5">
          <h2 className="font-display text-lg font-bold text-ink">Recebimentos por forma de pagamento</h2>
          <p className="text-xs text-muted">Como os clientes pagaram no período</p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.payments}
                    dataKey="value"
                    nameKey="method"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.payments.map((p) => (
                      <Cell key={p.method} fill={paymentMeta[p.method].color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => brl(v)}
                    contentStyle={{ borderRadius: 12, border: '1px solid #EAE0CD', fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {data.payments.map((p) => {
                const PayIcon = paymentMeta[p.method].icon
                const pct = entradas > 0 ? (p.value / entradas) * 100 : 0
                return (
                  <div key={p.method} className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${paymentMeta[p.method].color}1a`, color: paymentMeta[p.method].color }}
                    >
                      <PayIcon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-ink">{p.method}</span>
                        <span className="font-semibold text-ink">{brl(p.value)}</span>
                      </div>
                      <p className="text-xs text-muted">{pct.toFixed(0)}% do total</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-leaf/30 bg-leaf/5 px-3 py-2.5 text-sm">
            <CheckCircle2 size={16} className="shrink-0 text-leaf" />
            <span className="text-ink">
              <strong>{data.pixConciliados.ok}/{data.pixConciliados.total}</strong> PIX conciliados automaticamente
              {data.pixConciliados.ok < data.pixConciliados.total && (
                <span className="text-terracota"> · {data.pixConciliados.total - data.pixConciliados.ok} a verificar</span>
              )}
            </span>
          </div>
        </Card>

        {/* Despesas por categoria */}
        <Card className="p-5">
          <h2 className="font-display text-lg font-bold text-ink">Despesas por categoria</h2>
          <p className="text-xs text-muted">Para onde foi o dinheiro no período</p>
          <div className="mt-4 space-y-3.5">
            {data.expenses.map((e) => {
              const pct = saidas > 0 ? (e.value / saidas) * 100 : 0
              return (
                <div key={e.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{e.category}</span>
                    <span className="text-muted">
                      {brl(e.value)} <span className="text-xs">· {pct.toFixed(0)}%</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ink/5">
                    <div
                      className="h-full rounded-full bg-terracota transition-all duration-500"
                      style={{ width: `${(e.value / maxExpense) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-5">
          <span className="rounded-xl bg-leaf/12 p-2.5 text-leaf"><Percent size={20} /></span>
          <div>
            <p className="text-sm text-muted">Margem líquida</p>
            <p className="font-display text-xl font-extrabold text-ink">
              {margem.toFixed(1).replace('.', ',')}%
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-5">
          <span className="rounded-xl bg-terracota/10 p-2.5 text-terracota"><Receipt size={20} /></span>
          <div>
            <p className="text-sm text-muted">Ticket médio</p>
            <p className="font-display text-xl font-extrabold text-ink">{brl(ticket)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-5">
          <span className="rounded-xl bg-peach/40 p-2.5 text-[#8a6a1f]"><PiggyBank size={20} /></span>
          <div>
            <p className="text-sm text-muted">Custo médio por marmita (CMV)</p>
            <p className="font-display text-xl font-extrabold text-ink">{brl(cmvPorMarmita)}</p>
          </div>
        </Card>
      </div>

      {/* DRE */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <FileText size={18} className="text-terracota" />
          <h2 className="font-display text-lg font-bold text-ink">Demonstrativo de Resultado (DRE)</h2>
          <Badge tone="muted">{dreMes.mesLabel}</Badge>
        </div>
        <div className="divide-y divide-edge">
          {dreMes.lines.map((l) => (
            <div
              key={l.label}
              className={cx(
                'flex items-center justify-between py-2.5',
                l.strong && 'font-bold',
                l.result && 'rounded-lg bg-leaf/5 px-2'
              )}
            >
              <span className={cx('text-ink', l.result && 'text-leaf')}>{l.label}</span>
              <div className="flex items-center gap-2">
                {l.margin !== undefined && (
                  <Badge tone={l.result ? 'leaf' : 'muted'}>margem {l.margin}%</Badge>
                )}
                <span
                  className={cx(
                    'font-display tabular-nums',
                    l.value < 0 ? 'text-terracota' : l.result ? 'text-leaf' : 'text-ink'
                  )}
                >
                  {brl(l.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contas a pagar + a receber */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* A pagar */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-edge px-5 py-4">
            <div className="flex items-center gap-2">
              <ArrowUpCircle size={18} className="text-terracota" />
              <h2 className="font-display text-lg font-bold text-ink">Contas a pagar</h2>
            </div>
            <span className="text-right">
              <span className="block font-display font-bold text-ink">{brl(totalPagar)}</span>
              <span className="text-xs text-muted">próximos vencimentos</span>
            </span>
          </div>
          {atrasadas.length > 0 && (
            <div className="flex items-center gap-2 border-b border-edge bg-terracota/5 px-5 py-2.5 text-sm text-terracota">
              <AlertTriangle size={15} />
              {atrasadas.length} conta(s) vencendo/atrasada(s) — atenção!
            </div>
          )}
          <div className="divide-y divide-edge">
            {payables.map((p) => (
              <div key={p.desc} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{p.desc}</p>
                  <p className="text-xs text-muted">Vence {p.due}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                  <span className="font-semibold text-ink tabular-nums">{brl(p.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* A receber */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-edge px-5 py-4">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-leaf" />
              <h2 className="font-display text-lg font-bold text-ink">Contas a receber</h2>
            </div>
            <span className="text-right">
              <span className="block font-display font-bold text-ink">{brl(totalReceber)}</span>
              <span className="text-xs text-muted">faturas corporativas</span>
            </span>
          </div>
          <div className="divide-y divide-edge">
            {receivables.map((r) => (
              <div key={r.client} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{r.client}</p>
                  <p className="text-xs text-muted">Vence {r.due}</p>
                </div>
                <span className="font-semibold text-ink tabular-nums">{brl(r.value)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-edge px-5 py-3 text-xs text-muted">
            Faturas mensais de clientes corporativos (integra com o módulo de Assinaturas & Corporativo).
          </div>
        </Card>
      </div>
    </div>
  )
}
