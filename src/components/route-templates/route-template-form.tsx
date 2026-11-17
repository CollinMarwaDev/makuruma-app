import { useState, type FC, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { Currency, RouteTemplate, RouteTemplateLine } from '~/types/expense'
import { createRouteTemplate, updateRouteTemplate } from '~/services/routeTemplateService'
import { CURRENCIES } from '~/constants/expenseLineCategories'
import { BORDERS } from '~/components/expense-form/vibali-form-utils'
import { Button } from '~/global/components/button'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { getErrorMessage } from '~/global/utils/r3/utils'

interface RouteTemplateFormProps {
  expenseType: RouteTemplate['expense_type']
  onSaved: () => void
  template: RouteTemplate | null
}

const SEGMENTS: { label: string; value: NonNullable<RouteTemplateLine['segment']> }[] = [
  { label: 'Dar – Tunduma', value: 'dar_tunduma' },
  { label: 'Zambia', value: 'zambia' },
  { label: 'Border – DRC offload', value: 'border_drc' },
]

const field = 'w-full rounded-lg bg-secondary px-2 py-1.5 text-sm text-foreground ring-1 ring-border'
const emptyLine = (): RouteTemplateLine => ({ currency: 'TZS', description: '', is_flat: false, multiplier: '1', segment: null, unit_amount: '' })

/** Create or edit a route template: borders and costs per segment (Expense UAT req. 12). */
export const RouteTemplateForm: FC<RouteTemplateFormProps> = ({ expenseType, onSaved, template }) => {
  const [name, setName] = useState(template?.name ?? '')
  const [outbound, setOutbound] = useState(template?.outbound_border ?? '')
  const [inbound, setInbound] = useState(template?.return_border ?? '')
  const [lines, setLines] = useState<RouteTemplateLine[]>(() =>
    template?.lines.length ? template.lines.map((l) => ({ ...l, multiplier: l.multiplier ?? '1', unit_amount: String(Number(l.unit_amount)) })) : [emptyLine()]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (i: number, patch: Partial<RouteTemplateLine>) => setLines((prev) => prev.map((l, j) => (j === i ? { ...l, ...patch } : l)))
  const move = (i: number, d: -1 | 1) =>
    setLines((prev) => {
      const next = [...prev]
      ;[next[i], next[i + d]] = [next[i + d], next[i]]
      return next
    })

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Give the template a name.')
    if (lines.some((l) => !l.description.trim() || !(Number(l.unit_amount) >= 0) || l.unit_amount === '')) return setError('Every line needs details and an amount.')
    setSaving(true)
    setError(null)
    const data = {
      expense_type: expenseType,
      lines: lines.map((l) => ({ ...l, multiplier: l.multiplier || null })),
      name: name.trim(),
      outbound_border: outbound || undefined,
      return_border: inbound || undefined,
    }
    try {
      if (template) await updateRouteTemplate(template.id, data)
      else await createRouteTemplate(data)
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="md:col-span-3">
          <label htmlFor="template-name" className="mb-1 block text-sm font-medium text-foreground">Name</label>
          <input id="template-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sakania – Sakania" maxLength={120} className={field} />
        </div>
        {[
          { id: 'tpl-out', label: 'Outbound border (kwenda)', set: setOutbound, value: outbound },
          { id: 'tpl-in', label: 'Return border (kurudi)', set: setInbound, value: inbound },
        ].map((b) => (
          <div key={b.id}>
            <label htmlFor={b.id} className="mb-1 block text-sm font-medium text-foreground">{b.label}</label>
            <select id={b.id} value={b.value} onChange={(e) => b.set(e.target.value)} className={field}>
              <option value="">—</option>
              {BORDERS.map((x) => <option key={x} value={x}>{x.charAt(0) + x.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Costs ({lines.length})</h3>
          <button type="button" onClick={() => setLines((p) => [...p, emptyLine()])} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Plus size={12} /> Add cost
          </button>
        </div>
        {lines.map((line, i) => (
          <div key={i} className="grid grid-cols-2 items-end gap-2 rounded-lg p-2 ring-1 ring-border md:grid-cols-12">
            <div className="col-span-2 md:col-span-4">
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`d-${i}`}>Details</label>
              <input id={`d-${i}`} value={line.description} onChange={(e) => update(i, { description: e.target.value })} className={field} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`s-${i}`}>Segment</label>
              <select id={`s-${i}`} value={line.segment ?? ''} onChange={(e) => update(i, { segment: (e.target.value || null) as RouteTemplateLine['segment'] })} className={field}>
                <option value="">—</option>
                {SEGMENTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`c-${i}`}>Currency</label>
              <select id={`c-${i}`} value={line.currency} onChange={(e) => update(i, { currency: e.target.value as Currency })} className={field}>
                {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.value}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`a-${i}`}>Amount</label>
              <input id={`a-${i}`} inputMode="decimal" value={line.unit_amount} onChange={(e) => update(i, { unit_amount: e.target.value })} className={field} />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`m-${i}`}>×</label>
              <input id={`m-${i}`} inputMode="decimal" value={line.multiplier ?? ''} onChange={(e) => update(i, { multiplier: e.target.value })} className={field} />
            </div>
            <label className="flex items-center gap-1 pb-2 text-xs text-muted-foreground md:col-span-1" title="One amount for the order, not per truck">
              <input type="checkbox" checked={line.is_flat} onChange={(e) => update(i, { is_flat: e.target.checked })} /> Flat
            </label>
            <div className="flex justify-end gap-1 pb-1 md:col-span-1">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp size={14} /></button>
              <button type="button" aria-label="Move down" disabled={i === lines.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown size={14} /></button>
              <button type="button" aria-label="Remove cost" disabled={lines.length === 1} onClick={() => setLines((p) => p.filter((_, j) => j !== i))} className="rounded p-1 text-muted-foreground hover:text-status-red-pc disabled:opacity-30"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <ModalFormError className="mt-0" message={error ?? undefined} />
      <Button type="submit" className="w-full" loading={saving} loadingText="Saving…">
        {template ? 'Save template' : 'Create template'}
      </Button>
      {template && <p className="text-center text-xs text-muted-foreground">Orders already created from this template keep their own costs.</p>}
    </form>
  )
}
