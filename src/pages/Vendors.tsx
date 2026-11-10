import { deleteVendor, fetchVendors } from '~/services/vendorService'
import VendorForm from '~/components/VendorForm'
import { CrudListPage } from '~/components/common/crud-list-page'
import { VendorDetails } from '~/components/vendors/vendor-details'
import { VendorsTableSection } from '~/components/vendors/vendors-table-section'

function Vendors() {
  return (
    <CrudListPage
      title="Vendors"
      subtitle="Fuel and e-seal suppliers you buy from and pay."
      entity="vendor"
      retryLink="/vendors"
      fetchRows={fetchVendors}
      removeRow={deleteVendor}
      name={(v) => v.company_name}
      deleteDescription="This cannot be undone. Vendors with expenses or payments cannot be deleted."
      renderDetails={(v) => <VendorDetails vendor={v} />}
      renderForm={(v, onSaved) => <VendorForm key={v?.id ?? 'new'} vendor={v} onSaved={onSaved} />}
      renderList={(h) => <VendorsTableSection vendors={h.rows} {...h} />}
    />
  )
}

export default Vendors
