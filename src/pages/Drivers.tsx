import { deleteDriver, fetchDrivers } from '~/services/driverService'
import DriverForm from '~/components/DriverForm'
import { CrudListPage } from '~/components/common/crud-list-page'
import { DriverDetails } from '~/components/drivers/driver-details'
import { DriversTableSection } from '~/components/drivers/drivers-table-section'

function Drivers() {
  return (
    <CrudListPage
      title="Drivers"
      subtitle="Drivers and the expiry of their licence, passport and permits."
      entity="driver"
      retryLink="/drivers"
      fetchRows={fetchDrivers}
      removeRow={deleteDriver}
      name={(d) => d.full_name}
      deleteDescription="This cannot be undone. A driver assigned to a truck must be unassigned first."
      renderDetails={(d) => <DriverDetails driver={d} />}
      renderForm={(d, onSaved) => <DriverForm key={d?.id ?? 'new'} driver={d} onSaved={onSaved} />}
      renderList={(h) => <DriversTableSection drivers={h.rows} {...h} />}
    />
  )
}

export default Drivers
