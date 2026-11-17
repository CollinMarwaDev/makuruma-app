import { useState, type FC, type ReactNode } from 'react'
import { SearchBox } from '~/global/components/search-box'
import { cn } from '~/global/utils/cn'

export interface TruckOption {
  /** Driver, trailer or booking shown next to the reg no and searched too. */
  detail?: string
  id: string
  regNo: string
}

interface TruckSetFieldProps {
  emptyText: string
  label: string
  /** One truck only (Truck-category orders); hides "Same for all". */
  single?: boolean
  onChange: (ids: string[]) => void
  options: TruckOption[]
  /** Extra input under a selected truck, e.g. litres. */
  renderSelected?: (id: string) => ReactNode
  value: string[]
}

/** Searchable truck picker with "Same for all" (Expense UAT req. 5, 14). */
export const TruckSetField: FC<TruckSetFieldProps> = ({ emptyText, label, onChange, options, renderSelected, single, value }) => {
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()
  const visible = options.filter((o) => [o.regNo, o.detail].some((v) => v?.toLowerCase().includes(term)))

  const toggle = (id: string) => {
    if (single) return onChange(value.includes(id) ? [] : [id])
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {label}
          {!single && ` (${value.length} of ${options.length})`}
        </span>
        {!single && options.length > 0 && (
          <div className="flex gap-3 text-xs font-medium">
            <button type="button" onClick={() => onChange(options.map((o) => o.id))} className="text-primary hover:underline">
              Same for all
            </button>
            <button type="button" onClick={() => onChange([])} className="text-muted-foreground hover:text-foreground">
              Clear
            </button>
          </div>
        )}
      </div>
      <div className="rounded-lg bg-secondary ring-1 ring-border">
        {options.length > 6 && (
          <div className="border-b border-hairline p-2">
            <SearchBox onChange={setQuery} defaultValue="" placeholder="Search truck or driver" aria-label={`Search ${label.toLowerCase()}`} className="w-full" />
          </div>
        )}
        <ul className="max-h-44 divide-y divide-hairline overflow-y-auto">
          {visible.map((option) => {
            const checked = value.includes(option.id)
            return (
              <li key={option.id} className={cn('px-3 py-1.5', checked && 'bg-primary/5')}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type={single ? 'radio' : 'checkbox'} checked={checked} onChange={() => toggle(option.id)} className="cursor-pointer" />
                  <span className="font-medium text-foreground">{option.regNo}</span>
                  {option.detail && <span className="truncate text-xs text-muted-foreground">{option.detail}</span>}
                </label>
                {checked && renderSelected && <div className="ml-6 mt-1">{renderSelected(option.id)}</div>}
              </li>
            )
          })}
          {visible.length === 0 && <li className="px-3 py-3 text-center text-sm text-muted-foreground">{term ? 'No truck matches your search.' : emptyText}</li>}
        </ul>
      </div>
    </div>
  )
}
