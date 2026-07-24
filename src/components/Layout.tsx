import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import logo from '../assets/logo.png'

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex">
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-hairline bg-background px-4 md:hidden">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            title="Open menu"
          >
            <Menu size={20} />
          </button>
          <img src={logo} alt="Makuruma Logistics" className="h-7 w-auto" />
        </div>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
