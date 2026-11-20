import { useState, type FC, type FormEvent } from 'react'
import type { ExpenseOrder } from '~/types/expense'
import { markExpensePaid } from '~/services/expenseService'
import { FormModal } from '~/components/common/form-modal'
import { Button } from '~/global/components/button'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

interface MarkPaidDialogProps {
  expense: PaidOrder | null
  onClose: () => void
  onSaved: () => void
}

type PaidOrder = Pick<ExpenseOrder, 'form_number' | 'id' | 'total_amount'>

const fieldClass = 'w-full rounded-lg bg-secondary px-3 py-2 text-sm text-foreground ring-1 ring-border'
const today = () => new Date().toISOString().slice(0, 10)

/** Mark an approved order as paid on the day it was actually paid (UAT 20 Nov; default today, never in the future). */
export const MarkPaidDialog: FC<MarkPaidDialogProps> = ({ expense, onClose, onSaved }) => (
  <FormModal open={!!expense} onClose={onClose} title={expense ? `Mark ${expense.form_number} as paid` : ''}>
    {expense && <MarkPaidForm key={expense.id} expense={expense} onSaved={onSaved} />}
  </FormModal>
)

const MarkPaidForm: FC<{ expense: PaidOrder; onSaved: () => void }> = ({ expense, onSaved }) => {
  const [paidAt, setPaidAt] = useState(today)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!paidAt || paidAt > today()) return setError('Choose the payment date (today or earlier).')
    setSaving(true)
    setError(null)
    try {
      await markExpensePaid(expense.id, paidAt)
      toast.success(`${expense.form_number} marked as paid`)
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Confirm TZS {Number(expense.total_amount).toLocaleString()} has been paid, and on which day.</p>
      <div>
        <label htmlFor="paid-at" className="mb-1 block text-sm font-medium text-foreground">Payment date</label>
        <input id="paid-at" type="date" max={today()} value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className={fieldClass} />
      </div>
      <ModalFormError className="mt-0" message={error ?? undefined} />
      <Button type="submit" variant="success" className="w-full" loading={saving} loadingText="Saving…">
        Mark as paid
      </Button>
    </form>
  )
}
