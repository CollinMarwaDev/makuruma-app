import { deleteStaff, fetchStaff } from '~/services/staffService'
import StaffForm from '~/components/StaffForm'
import { CrudListPage } from '~/components/common/crud-list-page'
import { StaffDetails } from '~/components/staff/staff-details'
import { StaffTableSection } from '~/components/staff/staff-table-section'

function Staff() {
  return (
    <CrudListPage
      title="Staff"
      subtitle="Office staff, their TIN, payment account and attachments."
      entity="staff member"
      retryLink="/staff"
      fetchRows={fetchStaff}
      removeRow={deleteStaff}
      name={(s) => s.full_name}
      deleteDescription="This cannot be undone. Their attachments are removed too."
      renderDetails={(s) => <StaffDetails member={s} />}
      renderForm={(s, onSaved) => <StaffForm key={s?.id ?? 'new'} staff={s} onSaved={onSaved} />}
      renderList={(h) => <StaffTableSection staff={h.rows} {...h} />}
    />
  )
}

export default Staff
