import type { FC, ReactNode } from 'react'
import { Card } from '~/global/components/card'
import { ModalFormError } from '~/global/components/modal/modal-form-error'

/** Titled block inside the tracking slide-over (kit Card). */
export const LegSection: FC<{ action?: ReactNode; children: ReactNode; description?: string; title: string }> = ({
  action,
  children,
  description,
  title,
}) => (
  <Card as="section" className="space-y-3 p-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </Card>
)

/** Server error for a section, shown with the kit's form error banner. */
export const InlineError: FC<{ message: string | null }> = ({ message }) => <ModalFormError className="mt-0" message={message ?? undefined} />
