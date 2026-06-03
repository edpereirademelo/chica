import type { SalesPoint } from './types'

// Série dos últimos 7 dias (hoje = 03/06, quarta)
export const salesLast7Days: SalesPoint[] = [
  { day: 'Qui', date: '28/05', revenue: 742, marmitas: 44 },
  { day: 'Sex', date: '29/05', revenue: 968, marmitas: 57 },
  { day: 'Sáb', date: '30/05', revenue: 1124, marmitas: 66 },
  { day: 'Dom', date: '31/05', revenue: 0, marmitas: 0 },
  { day: 'Seg', date: '01/06', revenue: 815, marmitas: 49 },
  { day: 'Ter', date: '02/06', revenue: 902, marmitas: 53 },
  { day: 'Qua', date: '03/06', revenue: 0, marmitas: 0 }, // preenchido com os pedidos de hoje
]
