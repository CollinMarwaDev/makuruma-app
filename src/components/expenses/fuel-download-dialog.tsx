import { useState, type FC } from 'react'
import type { ExpenseOrder } from '~/types/expense'
import { downloadExpenseOrder } from '~/services/expenseService'
import { FormModal } from '~/components/common/form-modal'
import { Button } from '~/global/components/button'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

/** Asks whether the fuel PDF shows prices, so nobody has to edit the PDF before sending it (req. 11). */
export const FuelDownloadDialog: FC<{ expense: Pick<ExpenseOrder, 'form_number' | 'id' | 'pending_price'> | null; onClose: () => void }> = ({ expense, onClose }) => {
  const [busy, setBusy] = useState<'with' | 'without' | null>(null)

  async function download(showPrice: boolean) {
    if (!expense) return
    setBusy(showPrice ? 'with' : 'without')
    try {
      await downloadExpenseOrder(expense, showPrice)
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <FormModal open={!!expense} onClose={onClose} title={expense ? `Download ${expense.form_number}` : ''}>
      <p className="mb-4 text-sm text-muted-foreground">
        Show the price per litre and amounts on the PDF?
        {expense?.pending_price && ' Some prices are still pending and will show as "Pending".'}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="outline" loading={busy === 'without'} loadingText="Preparing…" onClick={() => void download(false)}>
          Without prices
        </Button>
        <Button loading={busy === 'with'} loadingText="Preparing…" onClick={() => void download(true)}>
          With prices
        </Button>
      </div>
    </FormModal>
  )
}
