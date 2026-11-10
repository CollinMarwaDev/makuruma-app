import type { FC, ReactNode } from 'react'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { cn } from '~/global/utils/cn'
import {
  SHARED_FIELD_LABELS,
  SHARED_FIELDS,
  isDecimal,
  totalTons,
  type ModeState,
  type SharedField,
  type TruckRow,
} from '~/components/booking-form/booking-form-utils'

type EditableField = SharedField | 'tons' | 'eta'
type TableRowData = TruckRow & { id: number }

interface BookingTrucksTableProps {
  modes: ModeState
  onChange: (truckId: number, field: EditableField, value: string) => void
  renderActions: (row: TruckRow) => ReactNode
  rows: TruckRow[]
}

const TrucksTable = createTable<TableRowData>()

const cellInput = 'w-full min-w-24 bg-secondary ring-1 ring-border rounded-md px-2 py-1.5 text-sm text-foreground'
const invalid = 'ring-status-red-pc'

/**
 * Trucks on the booking, on the global Table. Tons and ETA are always per truck; other fields appear as
 * columns only in "Different" mode. Number fields are text inputs with a decimal keyboard, so scrolling the
 * page can never change them (contract 2.1 B-8). Total Tons sits in the footer cell under Tons (2.1 A-2).
 * Rows are already ordered by "Arrange by", so column sorting is off.
 */
export const BookingTrucksTable: FC<BookingTrucksTableProps> = ({ modes, onChange, renderActions, rows }) => {
  const perTruckFields = SHARED_FIELDS.filter((field) => modes[field] === 'different')
  const headers: ColumnHeader[] = [
    { id: 'no', label: '#' },
    { id: 'truck', label: 'Truck' },
    { id: 'tons', label: 'Tons' },
    ...perTruckFields.map((field) => ({ id: field, label: SHARED_FIELD_LABELS[field] })),
    { id: 'eta', label: 'ETA' },
    { id: 'current_location', label: 'Current location' },
    { id: 'actions', label: '' },
  ].map((header) => ({ ...header, canSort: false }))

  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-border">
      <TrucksTable data={rows.map((row) => ({ ...row, id: row.truck.id }))}>
        <TrucksTable.Header headers={headers} className="static" />
        <TrucksTable.Body>
          {(row, index) => (
            <TrucksTable.Row rowId={String(row.id)} className="align-top [&_td]:py-2">
              <TrucksTable.Cell className="text-muted-foreground">{index + 1}</TrucksTable.Cell>
              <TrucksTable.Cell>
                <p className="font-medium">{row.truck.reg_no}</p>
                <p className="text-xs text-muted-foreground">
                  {row.truck.trailer?.reg_no ?? 'no trailer'} · {row.truck.driver?.full_name ?? 'no driver'}
                </p>
              </TrucksTable.Cell>
              <TrucksTable.Cell>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label={`Tons for ${row.truck.reg_no}`}
                  value={row.tons}
                  onChange={(e) => onChange(row.id, 'tons', e.target.value)}
                  className={cn(cellInput, 'text-right', !isDecimal(row.tons) && invalid)}
                />
              </TrucksTable.Cell>
              {perTruckFields.map((field) => (
                <TrucksTable.Cell key={field}>
                  <input
                    type="text"
                    inputMode={field === 'rate' ? 'decimal' : undefined}
                    aria-label={`${SHARED_FIELD_LABELS[field]} for ${row.truck.reg_no}`}
                    value={row[field]}
                    onChange={(e) => onChange(row.id, field, e.target.value)}
                    className={cn(cellInput, field === 'rate' && !isDecimal(row.rate) && invalid)}
                  />
                </TrucksTable.Cell>
              ))}
              <TrucksTable.Cell>
                <input
                  type="date"
                  aria-label={`ETA for ${row.truck.reg_no}`}
                  value={row.eta}
                  onChange={(e) => onChange(row.id, 'eta', e.target.value)}
                  className={cellInput}
                />
              </TrucksTable.Cell>
              <TrucksTable.Cell className="text-muted-foreground">{row.truck.current_location ?? '—'}</TrucksTable.Cell>
              <TrucksTable.Cell className="whitespace-nowrap text-right">{renderActions(row)}</TrucksTable.Cell>
            </TrucksTable.Row>
          )}
        </TrucksTable.Body>
        <TrucksTable.Footer className="bg-surface-container">
          <TrucksTable.Row rowId="total" className="bg-surface-container even:bg-surface-container odd:bg-surface-container [&_td]:py-2.5">
            <TrucksTable.Cell colSpan={2} className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Tons
            </TrucksTable.Cell>
            <TrucksTable.Cell className="text-right font-semibold tabular-nums">
              {totalTons(rows).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </TrucksTable.Cell>
            <TrucksTable.Cell colSpan={perTruckFields.length + 3} />
          </TrucksTable.Row>
        </TrucksTable.Footer>
      </TrucksTable>
    </div>
  )
}
