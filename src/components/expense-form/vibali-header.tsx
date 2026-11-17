import type { FC } from 'react'
import type { ExpenseFormKind } from '~/types/expense'
import { cn } from '~/global/utils/cn'
import { BORDERS } from '~/components/expense-form/vibali-form-utils'
import type { ExpenseFormState } from '~/components/expense-form/use-expense-form'

type FormOption = { hint: string; label: string; value: ExpenseFormKind }

const TUNDUMA_FORMS: FormOption[] = [
  { hint: 'From a route template; same costs for the trucks (form 123)', label: 'Route form', value: 'route' },
  { hint: 'One-off costs, own trucks per line, all in TSh (form 129)', label: 'General form', value: 'general' },
]

const CONGO_FORMS: FormOption[] = [
  { hint: 'Route template, same for all + extra costs (form 165)', label: 'Going (kwenda)', value: 'go' },
  { hint: 'Settle with the driver: extra spent and money returned (form 163)', label: 'Return (kurudi)', value: 'return' },
  { hint: 'Penalty, posho, visa — own trucks per line (form 180)', label: 'Emergency', value: 'emergency' },
]

interface VibaliHeaderProps {
  fieldClass: string
  form: ExpenseFormState
  labelClass: string
}

/** Vibali header: which paper form, template, borders, going order and rates (req. 12–25). */
export const VibaliHeader: FC<VibaliHeaderProps> = ({ fieldClass, form, labelClass }) => (
  <section className="space-y-4">
    {!form.isEditMode && (
      <div role="radiogroup" aria-label="Vibali form" className={cn('grid grid-cols-1 gap-2', form.isCongo ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
        {(form.isCongo ? CONGO_FORMS : TUNDUMA_FORMS).map((f) => (
          <label key={f.value} className={cn('flex cursor-pointer gap-2 rounded-lg p-3 ring-1', form.activeForm === f.value ? 'bg-primary/5 ring-primary' : 'ring-border')}>
            <input type="radio" name="vibali-form" checked={form.activeForm === f.value} onChange={() => form.changeFormKind(f.value)} className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium text-foreground">{f.label}</span>
              <span className="block text-xs text-muted-foreground">{f.hint}</span>
            </span>
          </label>
        ))}
      </div>
    )}

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {form.activeForm === 'return' && (
        <div className="md:col-span-2">
          <label htmlFor="parent-order" className={labelClass}>Going order this settles</label>
          <select id="parent-order" value={form.parentOrderId} onChange={(e) => form.chooseParent(e.target.value)} disabled={form.isEditMode} className={fieldClass}>
            <option value="">— Select the going order (165) —</option>
            {form.goOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.order_number} · {o.bookings.map((b) => b.booking_number).join(', ')} · ${Number(o.usd_total).toLocaleString()}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">Uses its bookings. Enter money spent above the going order as + and money not used (returned) as −.</p>
        </div>
      )}
      {(form.activeForm === 'route' || form.activeForm === 'go') && (
        <>
          <div className="md:col-span-2">
            <label htmlFor="route-template" className={labelClass}>Route template</label>
            <select id="route-template" value={form.templateId} onChange={(e) => form.applyTemplate(e.target.value)} disabled={form.bookingIds.length === 0} className={fieldClass}>
              <option value="">{form.bookingIds.length === 0 ? '— Select the booking(s) first —' : '— Start without a template —'}</option>
              {form.templates.filter((t) => t.is_active || String(t.id) === form.templateId).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">Fills the lines for all trucks of the booking(s). You can change anything; the template itself is not changed.</p>
          </div>
          <BorderField id="outbound-border" label="Outbound border (kwenda)" value={form.outboundBorder} onChange={form.setOutboundBorder} fieldClass={fieldClass} labelClass={labelClass} />
          {form.activeForm === 'route' && (
            <BorderField id="return-border" label="Return border (kurudi)" value={form.returnBorder} onChange={form.setReturnBorder} fieldClass={fieldClass} labelClass={labelClass} />
          )}
        </>
      )}
      {form.activeForm === 'return' && (
        <BorderField id="return-border" label="Return border (kurudi)" value={form.returnBorder} onChange={form.setReturnBorder} fieldClass={fieldClass} labelClass={labelClass} />
      )}
      {!form.isCongo && (
        <div>
          <label htmlFor="zmk-rate" className={labelClass}>ZMK → TSh rate</label>
          <input id="zmk-rate" inputMode="decimal" value={form.zmkRate} onChange={(e) => form.setZmkRate(e.target.value)} placeholder="e.g. 138" className={fieldClass} />
        </div>
      )}
      {form.isCongo && (
        <div>
          <label htmlFor="usd-rate" className={labelClass}>
            USD → TSh rate <span className="font-normal text-muted-foreground">(optional, reports only — never printed)</span>
          </label>
          <input id="usd-rate" inputMode="decimal" value={form.usdRate} onChange={(e) => form.setUsdRate(e.target.value)} placeholder="Leave empty to use the USD rate of the period" className={fieldClass} />
        </div>
      )}
      {form.activeForm === 'general' && (
        <div>
          <label htmlFor="usd-rate" className={labelClass}>USD → TSh rate</label>
          <input id="usd-rate" inputMode="decimal" value={form.usdRate} onChange={(e) => form.setUsdRate(e.target.value)} placeholder="Only if a line is in USD" className={fieldClass} />
        </div>
      )}
    </div>
  </section>
)

interface BorderFieldProps {
  fieldClass: string
  id: string
  label: string
  labelClass: string
  onChange: (value: string) => void
  value: string
}

const BorderField: FC<BorderFieldProps> = ({ fieldClass, id, label, labelClass, onChange, value }) => (
  <div>
    <label htmlFor={id} className={labelClass}>{label}</label>
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
      <option value="">—</option>
      {[...new Set([...BORDERS, value].filter(Boolean))].map((b) => (
        <option key={b} value={b}>{b.charAt(0) + b.slice(1).toLowerCase()}</option>
      ))}
    </select>
  </div>
)
