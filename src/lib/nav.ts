import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  MessageCircle,
  Tags,
  Users,
  CalendarClock,
  Factory,
  PackageSearch,
  BarChart3,
  Wallet,
  Truck,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  phase?: 2 | 3 // indefinido = Fase 1 (ativo)
}

export const activeNav: NavItem[] = [
  { to: '/', label: 'Painel', icon: LayoutDashboard },
  { to: '/cardapio', label: 'Cardápio do Dia', icon: UtensilsCrossed },
  { to: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/whatsapp', label: 'Atendimento WhatsApp', icon: MessageCircle },
  { to: '/precos', label: 'Tamanhos & Preços', icon: Tags },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
]

export const lockedNav: NavItem[] = [
  { to: '/assinaturas', label: 'Assinaturas & Corporativo', icon: CalendarClock, phase: 2 },
  { to: '/producao', label: 'Planejamento de Produção', icon: Factory, phase: 2 },
  { to: '/estoque', label: 'Estoque & Ficha Técnica', icon: PackageSearch, phase: 2 },
  { to: '/relatorios', label: 'Relatórios & BI', icon: BarChart3, phase: 3 },
  { to: '/fornecedores', label: 'Fornecedores', icon: Truck, phase: 3 },
]
