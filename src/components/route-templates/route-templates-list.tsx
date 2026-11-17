import { useEffect, useState, type FC } from 'react'
import type { RouteTemplate } from '~/types/expense'
import { deleteRouteTemplate, fetchRouteTemplates, updateRouteTemplate } from '~/services/routeTemplateService'
import { FormModal } from '~/components/common/form-modal'
import { RouteTemplateForm } from '~/components/route-templates/route-template-form'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const TYPES: { label: string; value: RouteTemplate['expense_type'] }[] = [
  { label: 'Vibali Tunduma', value: 'vibali_tunduma' },
  { label: 'Vibali Congo', value: 'vibali_congo' },
]

const lineSummary = (t: RouteTemplate) => {
  const byCurrency = t.lines.reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.currency]: (acc[l.currency] ?? 0) + 1 }), {})
  return Object.entries(byCurrency).map(([c, n]) => `${n} ${c}`).join(' · ')
}

/** Route templates users edit without a developer (Expense UAT req. 12). */
export const RouteTemplatesList: FC = () => {
  const confirm = useConfirmation()
  const [templates, setTemplates] = useState<RouteTemplate[]>([])
  const [editing, setEditing] = useState<{ template: RouteTemplate | null; type: RouteTemplate['expense_type'] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = () => fetchRouteTemplates().then(setTemplates).catch((err: unknown) => setError(getErrorMessage(err)))

  useEffect(() => {
    void reload()
  }, [])

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action()
      await reload()
      toast.success(success)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function remove(t: RouteTemplate) {
    const ok = await confirm({ cancelText: 'Keep it', description: 'If an order was made from it, it is hidden instead.', okayText: 'Delete template', title: `Delete "${t.name}"?`, type: 'error' })
    if (ok) await run(() => deleteRouteTemplate(t.id), `"${t.name}" removed`)
  }

  const toggle = (t: RouteTemplate) =>
    run(
      () => updateRouteTemplate(t.id, { expense_type: t.expense_type, is_active: !t.is_active, lines: t.lines, name: t.name, outbound_border: t.outbound_border ?? undefined, return_border: t.return_border ?? undefined }),
      t.is_active ? `"${t.name}" hidden` : `"${t.name}" shown`
    )

  return (
    <div className="space-y-4">
      <ModalFormError className="mt-0" message={error ?? undefined} />
      {TYPES.map((type) => {
        const list = templates.filter((t) => t.expense_type === type.value)
        return (
          <Card key={type.value} variant="panel" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{type.label} templates</h3>
                <p className="text-xs text-muted-foreground">Route costs that change (a new gate, chemical in Zambia) are updated here; new orders pick them up.</p>
              </div>
              <Button variant="tonal" className="px-4" onClick={() => setEditing({ template: null, type: type.value })}>
                New template
              </Button>
            </div>
            <ul className="divide-y divide-outline rounded-lg ring-1 ring-border">
              {list.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-3 px-3 py-2">
                  <div className="min-w-48 flex-1">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[t.outbound_border && `Kwenda ${t.outbound_border}`, t.return_border && `Kurudi ${t.return_border}`, lineSummary(t)].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <Badge hideDotIndicator variant={t.is_active ? 'success' : 'disabled'} label={t.is_active ? 'Active' : 'Hidden'} />
                  <div className="flex gap-3 text-xs font-medium">
                    <button type="button" onClick={() => setEditing({ template: t, type: t.expense_type })} className="text-primary hover:underline">Edit</button>
                    <button type="button" onClick={() => void toggle(t)} className="text-muted-foreground hover:text-foreground">{t.is_active ? 'Hide' : 'Show'}</button>
                    <button type="button" onClick={() => void remove(t)} className="text-status-red-pc hover:underline">Delete</button>
                  </div>
                </li>
              ))}
              {list.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted-foreground">No templates yet.</li>}
            </ul>
          </Card>
        )
      })}
      <FormModal open={!!editing} size="wide" onClose={() => setEditing(null)} title={editing?.template ? `Edit ${editing.template.name}` : 'New route template'}>
        {editing && (
          <RouteTemplateForm
            key={editing.template?.id ?? 'new'}
            expenseType={editing.type}
            template={editing.template}
            onSaved={() => {
              setEditing(null)
              toast.success('Template saved')
              void reload()
            }}
          />
        )}
      </FormModal>
    </div>
  )
}
