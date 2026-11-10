import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Route as RouteIcon, MapPin, Package,
  UserCog, IdCard, Building2, Store, Receipt, FileText, BarChart3, Scale,
  Users as UsersIcon, LogOut, ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'
import { ThemeToggle } from '~/global/components/theme-toggle'
import { NotificationBell } from '~/components/notifications/notification-bell'

const primaryNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bookings', label: 'Bookings', icon: ClipboardList },
  { to: '/trips', label: 'Trips', icon: RouteIcon },
  { to: '/tracking', label: 'Tracking', icon: MapPin },
]

const secondaryNavItems = [
  { to: '/assets', label: 'Assets', icon: Package },
  { to: '/staff', label: 'Staff', icon: UserCog },
  { to: '/drivers', label: 'Drivers', icon: IdCard },
  { to: '/clients', label: 'Clients', icon: Building2 },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/reconciliation', label: 'Reconciliation', icon: Scale },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: UsersIcon },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-hairline bg-background transition-transform duration-200 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:sticky md:top-0 md:translate-x-0 md:transition-all ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
    >
      <div
        className={`flex h-20 items-center justify-between border-b border-hairline px-4 ${
          isCollapsed ? 'md:justify-center' : 'md:justify-between'
        }`}
      >
        <img src={logo} alt="Makuruma Logistics" className={`h-9 w-auto ${isCollapsed ? 'md:hidden' : ''}`} />

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground md:grid"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile drawer close */}
        <button
          onClick={onMobileClose}
          className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground md:hidden"
          title="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {primaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} isCollapsed={isCollapsed} onNavigate={onMobileClose} />
        ))}

        <div className="my-4 h-px bg-hairline/60" />

        {secondaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} isCollapsed={isCollapsed} onNavigate={onMobileClose} />
        ))}
      </nav>

      <div className="mt-auto border-t border-hairline p-3">
        <NavLink
          to="/profile"
          onClick={onMobileClose}
          title={isCollapsed ? 'Profile' : undefined}
          className={({ isActive }) =>
            `block rounded-md py-2 mb-1 px-2 transition-colors ${isCollapsed ? 'md:text-center' : ''} ${
              isActive ? 'bg-brand/10 ring-1 ring-brand/20' : 'hover:bg-surface'
            }`
          }
        >
          <span className={isCollapsed ? 'md:hidden' : ''}>
            <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.role?.name ?? 'No role'}</p>
          </span>
          <span className={`hidden ${isCollapsed ? 'md:block' : ''}`}>
            <UserCog size={16} className="mx-auto text-muted-foreground" />
          </span>
        </NavLink>
        <NotificationBell
          showLabel={!isCollapsed}
          className={`mb-1 w-full ${isCollapsed ? 'md:justify-center' : ''}`}
        />
        <ThemeToggle
          showLabel={!isCollapsed}
          className={`mb-1 w-full ${isCollapsed ? 'md:justify-center' : ''}`}
        />
        <button
          onClick={() => {
            onMobileClose()
            logout()
          }}
          title={isCollapsed ? 'Log Out' : undefined}
          className={`flex w-full items-center gap-3 rounded-md py-2 px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${
            isCollapsed ? 'md:justify-center' : ''
          }`}
        >
          <LogOut size={16} className="shrink-0" />
          <span className={isCollapsed ? 'md:hidden' : ''}>Log Out</span>
        </button>
      </div>
    </aside>
  )
}

function SidebarLink({
  item,
  isCollapsed,
  onNavigate,
}: {
  item: { to: string; label: string; icon: typeof LayoutDashboard }
  isCollapsed: boolean
  onNavigate: () => void
}) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onNavigate}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors pl-2 pr-3 ${
          isCollapsed ? 'md:justify-center' : ''
        } ${
          isActive
            ? 'bg-brand/10 text-brand ring-1 ring-brand/20'
            : 'text-muted-foreground hover:bg-surface hover:text-foreground'
        }`
      }
    >
      <Icon size={16} className="shrink-0" />
      <span className={isCollapsed ? 'md:hidden' : ''}>{item.label}</span>
    </NavLink>
  )
}

export default Sidebar
