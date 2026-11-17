import { useEffect, useState, type FC } from 'react'
import type { UsdRate } from '~/types/expense'
import { createUsdRate, deleteUsdRate, fetchUsdRates } from '~/services/expenseSettingsService'
import { Button } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { TextInputBasic } from '~/global/components/form-controls/text-input-fields'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const EMPTY = { ends_on: '', rate: '', starts_on: '' }

/** USD→TZS rate per period, used only by the profit report (Expense UAT req. 18). */
export const UsdRatesList: FC = () => {
  const confirm = useConfirmation()
  const [rates, setRates] = useState<UsdRate[]>([])
  const [draft, setDraft] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsdRates().then(setRates).catch((err: unknown) => setError(getErrorMessage(err)))
  }, [])

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true)
    setError(null)
    try {
      await action()
      setRates(await fetchUsdRates())
      toast.success(success)
      return true
    } catch (err) {
      setError(getErrorMessage(err))
      return false
    } finally {
      setBusy(false)
    }
  }

  async function remove(rate: UsdRate) {
    const ok = await confirm({ cancelText: 'Keep it', description: 'Profit reports for this period will no longer use it.', okayText: 'Delete rate', title: `Delete the rate for ${rate.starts_on} – ${rate.ends_on}?`, type: 'error' })
    if (ok) await run(() => deleteUsdRate(rate.id), 'Rate deleted')
  }

  return (
    <Card variant="panel" className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The rate used to turn USD expenses into TZS on the profit report for a period, e.g. 2,600 from 10 to 20 February. It is never printed on expense forms. Periods cannot overlap.
      </p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          void run(() => createUsdRate(draft), 'Rate added').then((ok) => ok && setDraft(EMPTY))
        }}
      >
        <label className="text-xs text-muted-foreground">
          From
          <TextInputBasic type="date" value={draft.starts_on} onChange={(e) => setDraft({ ...draft, starts_on: e.target.value })} />
        </label>
        <label className="text-xs text-muted-foreground">
          To
          <TextInputBasic type="date" value={draft.ends_on} onChange={(e) => setDraft({ ...draft, ends_on: e.target.value })} />
        </label>
        <label className="text-xs text-muted-foreground">
          TZS per USD
          <TextInputBasic inputMode="decimal" placeholder="e.g. 2600" value={draft.rate} onChange={(e) => setDraft({ ...draft, rate: e.target.value })} />
        </label>
        <Button type="submit" disabled={!draft.starts_on || !draft.ends_on || !draft.rate} loading={busy} loadingText="Saving…" className="px-5">
          Add rate
        </Button>
      </form>
      <ModalFormError className="mt-0" message={error ?? undefined} />

      <ul className="divide-y divide-outline rounded-lg ring-1 ring-border">
        {rates.map((rate) => (
          <li key={rate.id} className="flex items-center gap-3 px-3 py-2 text-sm">
            <span className="flex-1 text-foreground">
              {rate.starts_on} – {rate.ends_on}
            </span>
            <span className="font-medium text-foreground">TZS {Number(rate.rate).toLocaleString()}</span>
            <button type="button" onClick={() => void remove(rate)} className="text-xs font-medium text-status-red-pc hover:underline">Delete</button>
          </li>
        ))}
        {rates.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted-foreground">No USD rates yet.</li>}
      </ul>
    </Card>
  )
}
