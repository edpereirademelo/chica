import type { ReactNode } from 'react'
import { cx } from '../lib/format'

// ---------- Card ----------
export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'rounded-2xl bg-surface border border-edge shadow-soft',
        className
      )}
    >
      {children}
    </div>
  )
}

// ---------- Badge ----------
type BadgeTone = 'terracota' | 'peach' | 'leaf' | 'muted' | 'ink'
const badgeTones: Record<BadgeTone, string> = {
  terracota: 'bg-terracota/10 text-terracota',
  peach: 'bg-peach/30 text-[#8a6a1f]',
  leaf: 'bg-leaf/12 text-leaf',
  muted: 'bg-ink/5 text-muted',
  ink: 'bg-ink text-cream',
}

export function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

// ---------- Button ----------
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-terracota text-white hover:bg-terracota-dark shadow-soft active:scale-[0.98]',
  secondary: 'bg-peach/40 text-ink hover:bg-peach/60 active:scale-[0.98]',
  ghost: 'text-ink hover:bg-ink/5',
  outline: 'border border-edge text-ink bg-surface hover:bg-cream',
}

export function Button({
  children,
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: {
  children: ReactNode
  variant?: ButtonVariant
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota/40',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ---------- PageHeader ----------
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ---------- Modal ----------
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl bg-surface shadow-card sm:rounded-2xl animate-[slideUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-edge px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Fechar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-edge px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- EmptyState ----------
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-edge bg-surface/50 px-6 py-12 text-center">
      {icon && <div className="text-muted/60">{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
    </div>
  )
}
