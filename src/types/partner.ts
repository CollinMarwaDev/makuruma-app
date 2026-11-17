export interface Client {
  id: number
  company_name: string
  short_code: string | null
  email: string | null
  phone: string | null
  allows_advance_invoice: boolean

}

export interface Vendor {
  id: number
  company_name: string
  /** Slug of a vendor type from the managed list, e.g. 'fuel'. */
  vendor_type: string
  /** Default for its fuel orders: paid on the spot or billed later. */
  payment_mode: 'on_spot' | 'bill'
  phone: string | null
  location: string | null
}
