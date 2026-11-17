import { useState } from 'react'
import { FormModal } from '~/components/common/form-modal'
import { importTrackingExcel, type TrackingImportResult } from '~/services/trackingService'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import { FilePickerCard } from '~/global/components/file-pickers'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const EXCEL_ACCEPT = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

type ImportRow = TrackingImportResult['rows'][number] & { id: string }

const ImportTable = createTable<ImportRow>()

const HEADERS: ColumnHeader[] = [
  { canSort: false, id: 'row', label: 'Sheet · row' },
  { canSort: false, id: 'truck', label: 'Truck' },
  { canSort: false, id: 'booking', label: 'Booking' },
  { canSort: false, id: 'result', label: 'Result' },
  { canSort: false, id: 'details', label: 'Details' },
]

const RESULT_BADGE = {
  rejected: { label: 'Rejected', variant: 'danger' },
  unchanged: { label: 'No change', variant: 'disabled' },
  update: { label: 'Will update', variant: 'success' },
} as const

interface TrackingImportModalProps {
  onClose: () => void
  /** Called after rows were saved, so the list reloads. */
  onImported: () => void
  open: boolean
}

/**
 * Upload the edited tracking sheet (contract 2.2 B): the server previews every row first, the
 * user confirms, then only the valid rows are saved and a summary is shown.
 */
export function TrackingImportModal({ onClose, onImported, open }: TrackingImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<TrackingImportResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [pickerKey, setPickerKey] = useState(0)

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
    setPickerKey((key) => key + 1)
  }

  function close() {
    reset()
    onClose()
  }

  async function run(picked: File, apply: boolean) {
    setBusy(true)
    setError('')
    try {
      const next = await importTrackingExcel(picked, apply)
      setResult(next)
      if (apply) {
        toast.success(`${next.summary.updated} tracking row${next.summary.updated === 1 ? '' : 's'} updated`)
        onImported()
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  function pick(picked: File | undefined) {
    if (!picked) return
    setFile(picked)
    void run(picked, false)
  }

  const rows: ImportRow[] = (result?.rows ?? [])
    .filter((row) => row.result !== 'unchanged')
    .map((row) => ({ ...row, id: `${row.sheet}-${row.row}` }))

  return (
    <FormModal open={open} onClose={close} title="Upload tracking Excel" size="wide">
      <div className="space-y-4">
        {!result ? (
          <>
            <p className="text-sm text-muted-foreground">
              Use a file from <strong className="text-foreground">Download Excel</strong> (any tab): edit statuses, locations and dates on the
              GOING and RETURN sheets, then upload it here. You will see every change before anything is saved. Empty cells leave the saved value
              as it is. Keep rows on their own sheet and don't copy rows between files — each row carries a hidden ID.
            </p>
            <FilePickerCard
              key={pickerKey}
              mode="manual-upload"
              accept={EXCEL_ACCEPT}
              instructionTitle={busy ? 'Checking the file…' : 'Click or drop the tracking Excel file'}
              instructionText="Excel (.xlsx) · up to 5 MB"
              onChange={(picked) => pick(picked?.file)}
            />
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">{result.applied ? 'Saved from' : 'Preview of'} {file?.name}:</span>
              <Badge variant="success" label={`${result.summary.updated} ${result.applied ? 'updated' : 'to update'}`} />
              <Badge variant="disabled" label={`${result.summary.unchanged} unchanged`} />
              <Badge variant={result.summary.rejected ? 'danger' : 'disabled'} label={`${result.summary.rejected} rejected`} />
            </div>

            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Every row matches what is already saved. Nothing to update.</p>
            ) : (
              <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-border">
                <ImportTable data={rows}>
                  <ImportTable.Header headers={HEADERS} />
                  <ImportTable.Body>
                    {(row) => (
                      <ImportTable.Row rowId={row.id}>
                        <ImportTable.Cell className="whitespace-nowrap text-muted-foreground">
                          {row.sheet} · {row.row}
                        </ImportTable.Cell>
                        <ImportTable.Cell className="whitespace-nowrap font-medium">{row.truck}</ImportTable.Cell>
                        <ImportTable.Cell className="whitespace-nowrap">{row.booking_number ?? '—'}</ImportTable.Cell>
                        <ImportTable.Cell>
                          <Badge
                            variant={RESULT_BADGE[row.result].variant}
                            label={row.result === 'update' && result.applied ? 'Updated' : RESULT_BADGE[row.result].label}
                          />
                        </ImportTable.Cell>
                        <ImportTable.Cell className="text-sm">
                          {row.errors.length > 0 ? (
                            <ul className="space-y-1 text-danger">
                              {row.errors.map((message) => (
                                <li key={message}>{message}</li>
                              ))}
                            </ul>
                          ) : (
                            <ul className="space-y-1">
                              {row.changes.map((change) => (
                                <li key={change.field}>
                                  <span className="text-muted-foreground">{change.field}:</span> {change.from ?? '—'} → <strong>{change.to}</strong>
                                </li>
                              ))}
                            </ul>
                          )}
                        </ImportTable.Cell>
                      </ImportTable.Row>
                    )}
                  </ImportTable.Body>
                </ImportTable>
              </div>
            )}
            {!result.applied && result.summary.rejected > 0 && (
              <p className="text-sm text-muted-foreground">Rejected rows are not saved. Fix them in the file and upload it again, or save the valid rows now.</p>
            )}
          </>
        )}

        <ModalFormError message={error} />

        <div className="flex flex-wrap justify-end gap-2">
          {result && !result.applied && (
            <Button variant="text" onClick={reset} disabled={busy}>
              Choose another file
            </Button>
          )}
          {result && !result.applied ? (
            <Button
              loading={busy}
              loadingText="Saving…"
              disabled={result.summary.updated === 0}
              onClick={() => file && void run(file, true)}
            >
              Save {result.summary.updated} update{result.summary.updated === 1 ? '' : 's'}
            </Button>
          ) : (
            <Button variant="outline" onClick={close}>
              {result?.applied ? 'Done' : 'Cancel'}
            </Button>
          )}
        </div>
      </div>
    </FormModal>
  )
}
