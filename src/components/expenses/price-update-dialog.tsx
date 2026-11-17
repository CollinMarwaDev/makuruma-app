import { useMemo, useState, type FC, type FormEvent } from 'react'
import type { ExpenseLine, ExpenseOrder } from '~/types/expense'
import { updateExpensePrices } from '~/services/expenseService'
import { FormModal } from '~/components/common/form-modal'
import { Button } from '~/global/components/button'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

interface PriceUpdateDialogProps {
  expense: ExpenseOrder | null
  onClose: () => void
  onSaved: () => void
}

interface PriceGroup {
  key: string
  label: string
  lines: ExpenseLine[]
  litres: number
  saved: string
}

const fieldClass = 'w-full rounded-lg bg-secondary px-3 py-2 text-sm text-foreground ring-1 ring-border'

/** Fill in or correct fuel prices on a pending or approved order; a set price needs a reason to change (req. 9). */
export const PriceUpdateDialog: FC<PriceUpdateDialogProps> = ({ expense, onClose, onSaved }) => (
  <FormModal open={!!expense} onClose={onClose} title={expense ? `Fuel prices — ${expense.order_number}` : ''}>
    {expense && <PriceForm key={expense.id} expense={expense} onSaved={onSaved} />}
  </FormModal>
)

const PriceForm: FC<{ expense: ExpenseOrder; onSaved: () => void }> = ({ expense, onSaved }) => {
  const groups = useMemo<PriceGroup[]>(() => {
    const byKey = new Map<string, ExpenseLine[]>()
    expense.lines.forEach((l) => byKey.set(l.group_key ?? `line-${l.id}`, [...(byKey.get(l.group_key ?? `line-${l.id}`) ?? []), l]))
    return [...byKey.entries()].map(([key, lines]) => ({
      key,
      label: `${lines[0].description} · ${lines.map((l) => l.booking_truck?.truck.reg_no ?? l.truck?.reg_no ?? expense.truck?.reg_no ?? '').filter(Boolean).join(', ')}`,
      lines,
      litres: lines.reduce((sum, l) => sum + Number(l.quantity ?? 0), 0),
      saved: lines[0].unit_rate ?? '',
    }))
  }, [expense])

  const [prices, setPrices] = useState<Record<string, string>>(() => Object.fromEntries(groups.map((g) => [g.key, g.saved === '' ? '' : String(Number(g.saved))])))
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changed = groups.filter((g) => prices[g.key].trim() !== '' && (g.saved === '' || Math.abs(Number(prices[g.key]) - Number(g.saved)) > 0.001))
  const needsReason = changed.some((g) => g.saved !== '')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (needsReason && !reason.trim()) return setError('Give a reason for changing a price that was already set.')
    setSaving(true)
    setError(null)
    try {
      await updateExpensePrices(expense.id, {
        prices: changed.flatMap((g) => g.lines.map((l) => ({ line_id: l.id, unit_rate: prices[g.key] }))),
        reason: needsReason ? reason.trim() : undefined,
      })
      toast.success(`Prices saved on ${expense.order_number}`)
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Enter the price per litre. Filling a missing price needs no reason; changing a price that was already set does.</p>
      <ul className="space-y-3">
        {groups.map((g) => (
          <li key={g.key} className="flex flex-wrap items-end gap-3 rounded-lg p-3 ring-1 ring-border">
            <div className="min-w-48 flex-1">
              <p className="text-sm font-medium text-foreground">{g.label}</p>
              <p className="text-xs text-muted-foreground">
                {g.litres.toLocaleString()} litres · {g.saved === '' ? 'price pending' : `saved price ${Number(g.saved).toLocaleString()}`}
              </p>
            </div>
            <div className="w-44">
              <label htmlFor={`price-${g.key}`} className="mb-1 block text-xs text-muted-foreground">Price per litre ({g.lines[0].currency})</label>
              <input id={`price-${g.key}`} inputMode="decimal" value={prices[g.key]} onChange={(e) => setPrices({ ...prices, [g.key]: e.target.value })} className={fieldClass} />
            </div>
          </li>
        ))}
      </ul>
      {needsReason && (
        <div>
          <label htmlFor="price-change-reason" className="mb-1 block text-sm font-medium text-foreground">Reason for the change</label>
          <input id="price-change-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={255} placeholder="e.g. Price board changed on the first Wednesday" className={fieldClass} />
        </div>
      )}
      <ModalFormError className="mt-0" message={error ?? undefined} />
      <Button type="submit" className="w-full" disabled={changed.length === 0} loading={saving} loadingText="Saving…">
        Save prices
      </Button>
    </form>
  )
}
