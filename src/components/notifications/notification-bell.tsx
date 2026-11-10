import { useEffect, useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellIcon } from '@heroicons/react/24/outline'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, type AppNotification } from '~/services/notificationService'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import Popover from '~/global/components/popover'
import { cn } from '~/global/utils/cn'

const REFRESH_MS = 60_000

/** In-app notifications (contract 2.2 D-6/D-7): auto-completed legs and overdue PODs. Polls every minute. */
export const NotificationBell: FC<{ className?: string; showLabel?: boolean }> = ({ className, showLabel = false }) => {
  const navigate = useNavigate()
  const [items, setItems] = useState<AppNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  const [tick, setTick] = useState(0)
  const reload = () => setTick((t) => t + 1)

  useEffect(() => {
    let cancelled = false
    fetchNotifications()
      .then((result) => {
        if (cancelled) return
        setItems(result.data)
        setUnread(result.unread_count)
      })
      .catch(() => undefined)
    const timer = window.setTimeout(reload, REFRESH_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [tick])

  async function openItem(item: AppNotification) {
    setOpen(false)
    if (!item.read_at) await markNotificationRead(item.id).catch(() => undefined)
    reload()
    if (item.data.booking_truck_id) navigate(`/tracking?leg=${item.data.booking_truck_id}`)
  }

  async function readAll() {
    await markAllNotificationsRead().catch(() => undefined)
    reload()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        title="Notifications"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className={cn(
          'relative flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground',
          className
        )}
      >
        <BellIcon className="size-4 shrink-0" />
        {showLabel && <span>Notifications</span>}
        {unread > 0 && (
          <Badge hideDotIndicator variant="danger" label={unread > 99 ? '99+' : String(unread)} className="ml-auto" />
        )}
      </Popover.Trigger>
      <Popover.Content side="right" align="end" responsive={false} className="w-80 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b border-outline px-4 py-3">
          <p className="font-semibold text-foreground">Notifications</p>
          {unread > 0 && (
            <Button variant="text" onClick={() => void readAll()} className="px-2 py-1 text-xs">
              Mark all read
            </Button>
          )}
        </div>
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">You're all caught up.</p>
        ) : (
          <ul className="max-h-96 divide-y divide-outline overflow-y-auto">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => void openItem(item)}
                  className={cn('w-full space-y-0.5 px-4 py-3 text-left hover:bg-surface-container', !item.read_at && 'bg-primary-50')}
                >
                  <p className="text-sm font-medium text-foreground">{item.data.title}</p>
                  <p className="text-xs text-muted-foreground">{item.data.message}</p>
                  <p className="text-[11px] text-muted-foreground">{item.created_at.slice(0, 16).replace('T', ' ')}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Popover.Content>
    </Popover>
  )
}
