import { useState, type FC } from 'react'
import type { LookupItem } from '~/types/expense'
import { createLookup } from '~/services/expenseSettingsService'
import { Button } from '~/global/components/button'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

interface PaymentAccountFieldProps {
  accounts: LookupItem[]
  className: string
  onAdded: (account: LookupItem) => void
  onChange: (id: string) => void
  value: string
}

/** Payment account dropdown with "Add account" inline (Expense UAT req. 27). */
export const PaymentAccountField: FC<PaymentAccountFieldProps> = ({ accounts, className, onAdded, onChange, value }) => {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const options = accounts.filter((a) => a.is_active || String(a.id) === value)

  async function add() {
    setSaving(true)
    try {
      onAdded(await createLookup('payment-accounts', name.trim()))
      toast.success(`Account "${name.trim()}" added`)
      setName('')
      setAdding(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor="payment-account" className="text-sm font-medium text-foreground">Payment account</label>
        <button type="button" onClick={() => setAdding((v) => !v)} className="text-xs font-medium text-primary hover:underline">
          {adding ? 'Cancel' : 'Add account'}
        </button>
      </div>
      {adding ? (
        <div className="flex gap-2">
          <input aria-label="New account name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NMB 2010002" maxLength={60} className={className} />
          <Button type="button" variant="tonal" disabled={!name.trim()} loading={saving} loadingText="Adding…" onClick={() => void add()} className="px-3">
            Add
          </Button>
        </div>
      ) : (
        <select id="payment-account" value={value} onChange={(e) => onChange(e.target.value)} className={className}>
          <option value="">— Select —</option>
          {options.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}
