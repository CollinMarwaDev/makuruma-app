import { useState, type FormEvent } from 'react'
import { Button } from '~/global/components/button'
import { createVendor, updateVendor } from '../services/vendorService'
import type { Vendor } from '../types/partner'
import { useVendorTypes } from '~/components/vendors/use-vendor-types'

interface VendorFormProps {
  vendor?: Vendor | null
  onSaved: () => void
}

function VendorForm({ vendor, onSaved }: VendorFormProps) {
  const isEditMode = !!vendor

  const [companyName, setCompanyName] = useState(vendor?.company_name ?? '')
  const { types } = useVendorTypes()
  const [vendorType, setVendorType] = useState(vendor?.vendor_type ?? 'fuel')
  const [paymentMode, setPaymentMode] = useState<'on_spot' | 'bill'>(vendor?.payment_mode ?? 'bill')
  const [phone, setPhone] = useState(vendor?.phone ?? '')
  const [location, setLocation] = useState(vendor?.location ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const payload = { company_name: companyName, location, payment_mode: paymentMode, phone, vendor_type: vendorType }
      if (isEditMode) {
        await updateVendor(vendor.id, payload)
      } else {
        await createVendor(payload)
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4 ring-1 ring-destructive/20">{error}</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Vendor Type</label>
          <select
            value={vendorType}
            onChange={(e) => setVendorType(e.target.value)}
            className="w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {types
              .filter((t) => t.is_active || t.slug === vendorType)
              .map((t) => (
                <option key={t.id} value={t.slug}>{t.name}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="vendor-payment-mode" className="block text-sm font-medium text-foreground mb-1">Usual payment</label>
        <select
          id="vendor-payment-mode"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value as 'on_spot' | 'bill')}
          className="w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="bill">Bill-based — pay later, price filled in when accounts are done</option>
          <option value="on_spot">On the spot — paid in cash, price known</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">Prefills the payment on new fuel orders for this vendor.</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Tunduma, Dar es Salaam"
          className="w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting} loadingText="Saving…">
        {isEditMode ? 'Update Vendor' : 'Save Vendor'}
      </Button>
    </form>
  )
}

export default VendorForm
