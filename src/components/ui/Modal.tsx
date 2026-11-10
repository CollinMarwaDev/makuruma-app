import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** `wide` for forms with tables (e.g. the booking form). */
  size?: 'default' | 'wide'
}

function Modal({ isOpen, onClose, title, children, size = 'default' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative bg-card ring-1 ring-white/10 w-full h-full sm:h-auto sm:rounded-xl ${size === 'wide' ? 'sm:max-w-6xl' : 'sm:max-w-2xl'} sm:max-h-[90vh] overflow-y-auto`}>
        <div className="sticky z-10 top-0 bg-card border-b border-hairline px-4 py-4 sm:px-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
