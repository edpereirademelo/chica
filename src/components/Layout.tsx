import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { DesktopSidebar, MobileDrawer } from './Sidebar'
import { activeNav, lockedNav } from '../lib/nav'
import { brand } from '../data/menu'

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const all = [...activeNav, ...lockedNav]
  const current = all.find(
    (n) => n.to === location.pathname || (n.to !== '/' && location.pathname.startsWith(n.to))
  )

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <DesktopSidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar mobile */}
        <header className="flex items-center justify-between border-b border-edge bg-surface px-4 py-3 lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-ink hover:bg-ink/5"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/logo-chica.png"
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-display text-sm font-extrabold text-ink">
              {current?.label ?? brand.name}
            </span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
