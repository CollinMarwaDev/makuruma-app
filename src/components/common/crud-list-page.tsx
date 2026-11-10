import { useState, type ReactNode } from 'react'
import { DetailsSlideOver } from '~/components/common/details-slide-over'
import { FormModal } from '~/components/common/form-modal'
import { ListPage } from '~/components/common/list-page'
import { useConfirmAction } from '~/components/common/use-confirm-action'
import { useDetailsParam } from '~/components/common/use-details-param'
import { useFetchList } from '~/components/common/use-fetch-list'
import { Button } from '~/global/components/button'
import { toast } from '~/global/utils/toast'

export interface CrudListHandlers<T> {
  isLoading: boolean
  onCreate: () => void
  onDelete: (row: T) => void
  onEdit: (row: T) => void
  onView: (row: T) => void
  refresh: () => void
  rows: T[]
}

interface CrudListPageProps<T extends { id: number }> {
  /** Shown under the confirmation title when deleting. */
  deleteDescription: string
  /** Inside another page (e.g. an Assets tab): no page header. */
  embedded?: boolean
  /** Lower-case noun, e.g. "client". */
  entity: string
  fetchRows: () => Promise<T[]>
  formSize?: 'default' | 'wide'
  name: (row: T) => string
  removeRow: (id: number) => Promise<unknown>
  renderDetails: (row: T) => ReactNode
  /** Extra buttons in the details slide-over footer. */
  renderDetailsActions?: (row: T, handlers: CrudListHandlers<T>) => ReactNode
  renderForm: (row: T | null, onSaved: () => void) => ReactNode
  renderList: (handlers: CrudListHandlers<T>) => ReactNode
  retryLink: string
  subtitle: string
  title: string
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * List page with add/edit form modal, "View" slide-over (`?details=`) and confirmed delete.
 * Used by every simple record list (clients, vendors, staff, drivers, users, assets).
 */
export function CrudListPage<T extends { id: number }>(props: CrudListPageProps<T>) {
  const { deleteDescription, entity, fetchRows, formSize, name, removeRow, renderDetails, renderDetailsActions, renderForm, renderList } = props
  const confirmAction = useConfirmAction()
  const { data: rows, error, loading, refresh } = useFetchList(fetchRows)
  const { closeDetails, openDetails } = useDetailsParam()
  const [form, setForm] = useState<{ row: T | null } | null>(null)

  const onEdit = (row: T | null) => {
    closeDetails()
    setForm({ row })
  }

  const onDelete = async (row: T) => {
    const done = await confirmAction({
      action: () => removeRow(row.id),
      description: deleteDescription,
      okayText: `Delete ${entity}`,
      success: `${name(row)} deleted`,
      title: `Delete ${name(row)}?`,
    })
    if (done) {
      closeDetails()
      refresh()
    }
  }

  const handlers: CrudListHandlers<T> = {
    isLoading: loading,
    onCreate: () => onEdit(null),
    onDelete: (row) => void onDelete(row),
    onEdit,
    onView: (row) => openDetails(row.id),
    refresh,
    rows,
  }

  return (
    <ListPage
      embedded={props.embedded}
      title={props.title}
      subtitle={props.subtitle}
      error={error}
      loading={loading}
      retryLink={props.retryLink}
      overlays={
        <>
          <DetailsSlideOver
            records={rows}
            title={name}
            footer={(row) => (
              <>
                {renderDetailsActions?.(row, handlers)}
                <Button variant="outline" onClick={() => void onDelete(row)}>Delete</Button>
                <Button onClick={() => onEdit(row)}>Edit {entity}</Button>
              </>
            )}
          >
            {renderDetails}
          </DetailsSlideOver>
          <FormModal
            open={!!form}
            size={formSize}
            onClose={() => setForm(null)}
            title={form?.row ? `Edit ${capitalise(entity)} — ${name(form.row)}` : `Add ${capitalise(entity)}`}
          >
            {form &&
              renderForm(form.row, () => {
                setForm(null)
                toast.success(`${capitalise(entity)} saved`)
                refresh()
              })}
          </FormModal>
        </>
      }
    >
      {renderList(handlers)}
    </ListPage>
  )
}
