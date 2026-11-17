import { useEffect, useState, type FC } from 'react'
import type { LookupItem, LookupKind } from '~/types/expense'
import { createLookup, deleteLookup, fetchLookup, updateLookup } from '~/services/expenseSettingsService'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { TextInputBasic } from '~/global/components/form-controls/text-input-fields'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

interface LookupListProps {
  /** Lower-case singular, e.g. "payment account". */
  entity: string
  hint: string
  kind: LookupKind
  placeholder: string
}

/** Add, rename, hide and delete the entries of one managed list (Expense UAT req. 26–28). */
export const LookupList: FC<LookupListProps> = ({ entity, hint, kind, placeholder }) => {
  const confirm = useConfirmation()
  const [items, setItems] = useState<LookupItem[]>([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLookup(kind).then(setItems).catch((err: unknown) => setError(getErrorMessage(err)))
  }, [kind])

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true)
    setError(null)
    try {
      await action()
      setItems(await fetchLookup(kind))
      toast.success(success)
      return true
    } catch (err) {
      setError(getErrorMessage(err))
      return false
    } finally {
      setBusy(false)
    }
  }

  async function remove(item: LookupItem) {
    const ok = await confirm({
      cancelText: 'Keep it',
      description: `If any record uses it, it is hidden instead so old records keep the name.`,
      okayText: `Delete ${entity}`,
      title: `Delete "${item.name}"?`,
      type: 'error',
    })
    if (ok) await run(() => deleteLookup(kind, item.id), `"${item.name}" removed`)
  }

  return (
    <Card variant="panel" className="space-y-4">
      <p className="text-sm text-muted-foreground">{hint}</p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          void run(() => createLookup(kind, name.trim()), `"${name.trim()}" added`).then((ok) => ok && setName(''))
        }}
      >
        <div className="min-w-56 flex-1">
          <TextInputBasic aria-label={`New ${entity}`} placeholder={placeholder} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button type="submit" disabled={!name.trim()} loading={busy} loadingText="Saving…" className="px-5">
          Add {entity}
        </Button>
      </form>
      <ModalFormError className="mt-0" message={error ?? undefined} />

      <ul className="divide-y divide-outline rounded-lg ring-1 ring-border">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-3 px-3 py-2">
            {editing?.id === item.id ? (
              <form
                className="flex flex-1 gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  void run(() => updateLookup(kind, item.id, { name: editing.name.trim() }), 'Name saved').then((ok) => ok && setEditing(null))
                }}
              >
                <TextInputBasic aria-label={`Rename ${item.name}`} value={editing.name} maxLength={60} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                <Button type="submit" variant="tonal" disabled={!editing.name.trim()} className="px-3">Save</Button>
                <Button type="button" variant="text" onClick={() => setEditing(null)} className="px-3">Cancel</Button>
              </form>
            ) : (
              <>
                <span className="flex-1 text-sm text-foreground">{item.name}</span>
                <Badge hideDotIndicator variant={item.is_active ? 'success' : 'disabled'} label={item.is_active ? 'Active' : 'Hidden'} />
                <div className="flex gap-3 text-xs font-medium">
                  <button type="button" onClick={() => setEditing({ id: item.id, name: item.name })} className="text-primary hover:underline">Rename</button>
                  <button
                    type="button"
                    onClick={() => void run(() => updateLookup(kind, item.id, { is_active: !item.is_active }), item.is_active ? `"${item.name}" hidden` : `"${item.name}" shown`)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button type="button" onClick={() => void remove(item)} className="text-status-red-pc hover:underline">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted-foreground">Nothing added yet.</li>}
      </ul>
    </Card>
  )
}
