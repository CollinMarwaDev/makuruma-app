import type { ReactNode } from 'react'
import Modal from '~/components/ui/Modal'
import { GeneralErrorBoundary } from '~/global/components/error-boundary'

interface FormModalProps {
  children: ReactNode
  onClose: () => void
  open: boolean
  size?: 'default' | 'wide'
  title: string
}

/** Existing add/edit forms in their modal, wrapped in the global error boundary. */
export function FormModal({ children, onClose, open, size, title }: FormModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} title={title} size={size}>
      <GeneralErrorBoundary>{open ? children : null}</GeneralErrorBoundary>
    </Modal>
  )
}
