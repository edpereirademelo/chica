import type { PaymentMethod } from './types'

export type PeriodId = 'hoje' | '7dias' | 'mes' | 'mesPassado'

export interface PeriodOption {
  id: PeriodId
  label: string
}

export const periodOptions: PeriodOption[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: '7dias', label: '7 dias' },
  { id: 'mes', label: 'Este mês' },
  { id: 'mesPassado', label: 'Mês passado' },
]

export interface CashflowPoint {
  label: string
  entradas: number
  saidas: number
}

export interface PaymentSlice {
  method: PaymentMethod
  value: number
}

export interface ExpenseSlice {
  category: string
  value: number
}

export interface PeriodFinance {
  /** descrição amigável do intervalo */
  rangeLabel: string
  /** nº de marmitas vendidas no período */
  marmitas: number
  cashflow: CashflowPoint[]
  payments: PaymentSlice[]
  expenses: ExpenseSlice[]
  /** PIX conciliados automaticamente */
  pixConciliados: { ok: number; total: number }
}

// Saldo atual em conta (independente do filtro)
export const saldoEmCaixa = 18430

export const financeByPeriod: Record<PeriodId, PeriodFinance> = {
  hoje: {
    rangeLabel: '03 de junho de 2026',
    marmitas: 66,
    cashflow: [
      { label: '11h', entradas: 260, saidas: 0 },
      { label: '12h', entradas: 420, saidas: 690 },
      { label: '13h', entradas: 310, saidas: 0 },
      { label: '14h', entradas: 140, saidas: 0 },
    ],
    payments: [
      { method: 'PIX', value: 700 },
      { method: 'Dinheiro', value: 230 },
      { method: 'Cartão', value: 200 },
    ],
    expenses: [
      { category: 'Insumos (CMV)', value: 540 },
      { category: 'Embalagens', value: 90 },
      { category: 'Gás', value: 60 },
    ],
    pixConciliados: { ok: 38, total: 38 },
  },
  '7dias': {
    rangeLabel: '28/05 a 03/06',
    marmitas: 345,
    cashflow: [
      { label: 'Qui', entradas: 742, saidas: 520 },
      { label: 'Sex', entradas: 968, saidas: 610 },
      { label: 'Sáb', entradas: 1124, saidas: 700 },
      { label: 'Dom', entradas: 0, saidas: 0 },
      { label: 'Seg', entradas: 815, saidas: 540 },
      { label: 'Ter', entradas: 902, saidas: 560 },
      { label: 'Qua', entradas: 1339, saidas: 540 },
    ],
    payments: [
      { method: 'PIX', value: 3534 },
      { method: 'Dinheiro', value: 1178 },
      { method: 'Cartão', value: 1178 },
    ],
    expenses: [
      { category: 'Insumos (CMV)', value: 2100 },
      { category: 'Equipe', value: 650 },
      { category: 'Energia & Gás', value: 240 },
      { category: 'Embalagens', value: 180 },
      { category: 'Outros', value: 300 },
    ],
    pixConciliados: { ok: 198, total: 198 },
  },
  mes: {
    rangeLabel: 'Junho de 2026',
    marmitas: 1450,
    cashflow: [
      { label: 'Sem 1', entradas: 6200, saidas: 4050 },
      { label: 'Sem 2', entradas: 6000, saidas: 4000 },
      { label: 'Sem 3', entradas: 6400, saidas: 4200 },
      { label: 'Sem 4', entradas: 6200, saidas: 4126 },
    ],
    payments: [
      { method: 'PIX', value: 14880 },
      { method: 'Dinheiro', value: 4960 },
      { method: 'Cartão', value: 4960 },
    ],
    expenses: [
      { category: 'Insumos (CMV)', value: 9100 },
      { category: 'Equipe', value: 2800 },
      { category: 'Aluguel', value: 1200 },
      { category: 'Energia & Gás', value: 980 },
      { category: 'Impostos', value: 1488 },
      { category: 'Embalagens', value: 508 },
      { category: 'Outros', value: 300 },
    ],
    pixConciliados: { ok: 842, total: 842 },
  },
  mesPassado: {
    rangeLabel: 'Maio de 2026',
    marmitas: 1320,
    cashflow: [
      { label: 'Sem 1', entradas: 5500, saidas: 3650 },
      { label: 'Sem 2', entradas: 5700, saidas: 3780 },
      { label: 'Sem 3', entradas: 5650, saidas: 3800 },
      { label: 'Sem 4', entradas: 5600, saidas: 3750 },
    ],
    payments: [
      { method: 'PIX', value: 13470 },
      { method: 'Dinheiro', value: 4490 },
      { method: 'Cartão', value: 4490 },
    ],
    expenses: [
      { category: 'Insumos (CMV)', value: 8233 },
      { category: 'Equipe', value: 2800 },
      { category: 'Aluguel', value: 1200 },
      { category: 'Energia & Gás', value: 940 },
      { category: 'Impostos', value: 1347 },
      { category: 'Embalagens', value: 460 },
    ],
    pixConciliados: { ok: 760, total: 762 },
  },
}

// DRE do mês atual (independente do filtro, sempre mostra o mês corrente)
export interface DRELine {
  label: string
  value: number
  /** linha de subtotal/resultado (negrito) */
  strong?: boolean
  /** linha de resultado final positivo (verde) */
  result?: boolean
  /** margem em % para exibir ao lado */
  margin?: number
}

export const dreMes: { mesLabel: string; lines: DRELine[] } = {
  mesLabel: 'Junho de 2026',
  lines: [
    { label: 'Receita bruta de vendas', value: 24800, strong: true },
    { label: '(–) Impostos sobre vendas (Simples)', value: -1488 },
    { label: '= Receita líquida', value: 23312, strong: true },
    { label: '(–) Custo dos insumos (CMV)', value: -9100 },
    { label: '= Lucro bruto', value: 14212, strong: true, margin: 57 },
    { label: '(–) Despesas operacionais', value: -5788 },
    { label: '= Lucro líquido', value: 8424, strong: true, result: true, margin: 34 },
  ],
}

// Contas a pagar (próximos vencimentos)
export type PayableStatus = 'Pago' | 'Pendente' | 'Atrasado'
export interface Payable {
  desc: string
  due: string
  value: number
  status: PayableStatus
}

export const payables: Payable[] = [
  { desc: 'Gás — Revenda Boa Chama', due: '04/06', value: 340, status: 'Atrasado' },
  { desc: 'Salário da equipe', due: '05/06', value: 2800, status: 'Pendente' },
  { desc: 'Aluguel do ponto', due: '05/06', value: 1200, status: 'Pendente' },
  { desc: 'Frango — Atacadão Central', due: '05/06', value: 1480, status: 'Pendente' },
  { desc: 'Energia elétrica — CPFL', due: '10/06', value: 640, status: 'Pendente' },
  { desc: 'Embalagens — Disk Embalagens', due: '12/06', value: 508, status: 'Pendente' },
  { desc: 'Simples Nacional (DAS)', due: '20/06', value: 1488, status: 'Pendente' },
]

// Contas a receber (faturas corporativas — Fase 2 integrada)
export interface Receivable {
  client: string
  due: string
  value: number
}

export const receivables: Receivable[] = [
  { client: 'Mercado São Jorge', due: '08/06', value: 13500 },
  { client: 'Construtora Horizonte', due: '10/06', value: 11250 },
  { client: 'Clínica Vida Plena', due: '10/06', value: 8100 },
  { client: 'Auto Peças Veloz', due: '15/06', value: 5400 },
]
