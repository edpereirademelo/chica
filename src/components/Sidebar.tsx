import { NavLink } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { activeNav, lockedNav } from '../lib/nav'
import { brand } from '../data/menu'
import { cx } from '../lib/format'

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      <div>
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
          Ativo agora
        </p>
        <ul className="flex flex-col gap-1">
          {activeNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-terracota text-white shadow-soft'
                      : 'text-ink/80 hover:bg-ink/5 hover:text-ink'
                  )
                }
              >
                <item.icon size={18} strokeWidth={2.2} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
          Em breve
        </p>
        <ul className="flex flex-col gap-1">
          {lockedNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-ink/5 text-ink'
                      : 'text-muted hover:bg-ink/5 hover:text-ink'
                  )
                }
              >
                <item.icon size={18} strokeWidth={2} />
                <span className="flex-1 truncate">{item.label}</span>
                <span className="flex items-center gap-1 rounded-full bg-peach/40 px-1.5 py-0.5 text-[10px] font-bold text-[#8a6a1f]">
                  <Lock size={10} strokeWidth={2.6} />
                  F{item.phase}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3 border-b border-edge px-5 py-4">
      <img
        src="/logo-chica.png"
        alt="Marmitaria da Chica"
        className="h-12 w-12 rounded-full object-cover ring-1 ring-edge"
      />
      <div className="leading-tight">
        <p className="font-display text-base font-extrabold text-ink">
          Marmitaria da Chica
        </p>
        <p className="text-xs text-muted">{brand.subtitle}</p>
      </div>
    </div>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-edge bg-surface lg:flex">
      <Brand />
      <NavItems />
      <div className="border-t border-edge px-5 py-3 text-[11px] text-muted">
        <p>Funcionamento: {brand.hours}</p>
        <p className="mt-0.5">WhatsApp: {brand.whatsapp}</p>
      </div>
    </aside>
  )
}

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease]"
        onClick={onClose}
      />
      <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-surface shadow-card animate-[slideUp_0.2s_ease]">
        <Brand />
        <NavItems onNavigate={onClose} />
      </aside>
    </div>
  )
}
