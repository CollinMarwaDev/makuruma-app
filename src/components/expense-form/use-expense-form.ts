import { useEffect, useMemo, useState } from 'react'
import type {
  ExpenseCategory,
  ExpenseFormKind,
  ExpenseListItem,
  ExpenseOrder,
  ExpensePickBooking,
  ExpensePickTruck,
  LineCategory,
  LookupItem,
  PaymentMode,
  RouteTemplate,
} from '~/types/expense'
import type { Vendor } from '~/types/partner'
import { createExpenseOrder, fetchExpenseOrders, fetchExpensePickLists, updateExpenseOrder } from '~/services/expenseService'
import { fetchLookup } from '~/services/expenseSettingsService'
import { fetchRouteTemplates } from '~/services/routeTemplateService'
import { fetchVendors } from '~/services/vendorService'
import { useAuth } from '~/hooks/useAuth'
import type { TruckOption } from '~/components/expense-form/truck-set-field'
import { buildLines, changedPrices, newRow, rowTotal, rowsFromLines, rowsProblem, type LineRow } from '~/components/expense-form/expense-form-utils'
import { buildVibaliLines, rowsFromTemplate, vibaliProblem, vibaliTotals } from '~/components/expense-form/vibali-form-utils'

export interface ExpenseFormOptions {
  /** Saved order being edited; null when creating. */
  expense?: ExpenseOrder | null
  onSaved: () => void
}

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Failed to save expense')

/** State and actions for the expense order form (Expense UAT req. 1–6, 27, 28). */
export function useExpenseForm({ expense, onSaved }: ExpenseFormOptions) {
  const { user } = useAuth()
  const isEditMode = !!expense

  const [type, setType] = useState<LineCategory>(expense?.expense_type ?? 'fuel')
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category ?? 'trip')
  const [referenceNo, setReferenceNo] = useState(expense?.reference_no ?? '')
  const [bookingIds, setBookingIds] = useState<number[]>(expense?.bookings.map((b) => b.id) ?? [])
  /** A Truck order's trucks (client request 17 Nov: several, picked per line like Trip lines). */
  const [truckIds, setTruckIds] = useState<string[]>(() => {
    const fromLines = [...new Set(expense?.lines.flatMap((l) => (l.truck ? [String(l.truck.id)] : [])) ?? [])]
    return fromLines.length || !expense?.truck ? fromLines : [String(expense.truck.id)]
  })
  const [paymentAccountId, setPaymentAccountId] = useState(expense?.payment_account_id ? String(expense.payment_account_id) : '')
  const [paymentDate, setPaymentDate] = useState(expense?.payment_date?.slice(0, 10) ?? '')
  const [vendorId, setVendorId] = useState(expense?.vendor_id ? String(expense.vendor_id) : '')
  const initialRows = useMemo(() => (expense ? rowsFromLines(expense.lines) : [newRow()]), [expense])
  const [rows, setRows] = useState<LineRow[]>(initialRows)
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(expense?.payment_mode ?? 'bill')
  const [paymentModeTouched, setPaymentModeTouched] = useState(isEditMode)
  const [priceChangeReason, setPriceChangeReason] = useState('')
  const [formKind, setFormKind] = useState<ExpenseFormKind | null>(expense?.form ?? null)
  const [templateId, setTemplateId] = useState(expense?.route_template_id ? String(expense.route_template_id) : '')
  const [outboundBorder, setOutboundBorder] = useState(expense?.outbound_border ?? '')
  const [returnBorder, setReturnBorder] = useState(expense?.return_border ?? '')
  const [zmkRate, setZmkRate] = useState(expense?.zmk_rate ? String(Number(expense.zmk_rate)) : '')
  const [usdRate, setUsdRate] = useState(expense?.usd_rate ? String(Number(expense.usd_rate)) : '')
  const [templates, setTemplates] = useState<RouteTemplate[]>([])
  const [parentOrderId, setParentOrderId] = useState(expense?.parent_order_id ? String(expense.parent_order_id) : '')
  const [goOrders, setGoOrders] = useState<ExpenseListItem[]>([])
  const [subcategoryId, setSubcategoryId] = useState(expense?.other_subcategory_id ? String(expense.other_subcategory_id) : '')
  const [subcategories, setSubcategories] = useState<LookupItem[]>([])

  const [accounts, setAccounts] = useState<LookupItem[]>([])
  const [bookings, setBookings] = useState<ExpensePickBooking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [trucks, setTrucks] = useState<ExpensePickTruck[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (type !== 'vibali_tunduma' && type !== 'vibali_congo') return
    fetchRouteTemplates(type).then(setTemplates).catch(() => setTemplates([]))
    if (type === 'vibali_congo') {
      fetchExpenseOrders({ expense_type: 'vibali_congo', form: 'go' })
        .then((all) => setGoOrders(all.filter((o) => o.status !== 'rejected')))
        .catch(() => setGoOrders([]))
    }
  }, [type])

  useEffect(() => {
    if (type === 'mengine') fetchLookup('expense-subcategories').then(setSubcategories).catch(() => setSubcategories([]))
  }, [type])

  useEffect(() => {
    fetchLookup('payment-accounts').then(setAccounts).catch(() => setAccounts([]))
    fetchExpensePickLists()
      .then((lists) => {
        setBookings(lists.bookings)
        setTrucks(lists.trucks)
      })
      .catch(() => {
        setBookings([])
        setTrucks([])
      })
      .finally(() => setIsLoadingBookings(false))
    fetchVendors().then(setVendors).catch(() => setVendors([]))
  }, [])

  /** Trucks of every selected booking, the pool a Trip line picks from. */
  const bookingTrucks = useMemo(
    () => bookings.filter((b) => bookingIds.includes(b.id)).flatMap((b) => b.booking_trucks.map((bt) => ({ booking: b, bt }))),
    [bookingIds, bookings]
  )

  /** Vibali on a trip uses a paper form: Tunduma 123/129, Congo 165/163/180 (req. 12–25). */
  const isCongo = type === 'vibali_congo'
  // Orders saved before the paper forms existed (no `form`) keep the generic line editor so they stay editable.
  const isVibaliForm = (type === 'vibali_tunduma' || isCongo) && category === 'trip' && (!expense || !!expense.form)
  const activeForm: ExpenseFormKind | null = isVibaliForm ? (formKind ?? (isCongo ? 'go' : 'route')) : null
  const totals = vibaliTotals(rows, zmkRate, usdRate, activeForm === 'route' || isCongo)
  /** Vibali Congo is USD only (req. 21). */
  const blankRow = (): LineRow => ({ ...newRow(), currency: isCongo ? 'USD' : 'TZS' })
  const total = isVibaliForm ? totals.grand : rows.reduce((sum, row) => sum + rowTotal(row, category, type), 0)
  const lineVendors = vendors.filter((v) => v.vendor_type === 'fuel')
  const isFuel = type === 'fuel'
  const changedPriceGroups = isEditMode && isFuel ? changedPrices(initialRows, rows) : []
  const missingPrice = isFuel && rows.some((r) => r.unitRate.trim() === '')

  /** Driver's name per line-truck id (booking truck on a Trip, truck on a Truck order), to prefill fuel lines (req. 7). */
  const driverOf = useMemo(
    () =>
      category === 'truck'
        ? Object.fromEntries(trucks.map((t) => [String(t.id), t.driver?.full_name ?? '']))
        : Object.fromEntries(bookingTrucks.map(({ bt }) => [String(bt.id), bt.driver?.full_name ?? bt.truck.driver?.full_name ?? ''])),
    [bookingTrucks, category, trucks]
  )

  /** Trucks a line can apply to: the selected bookings' trucks (Trip) or the order's trucks (Truck). */
  const lineTruckOptions = useMemo<TruckOption[]>(
    () =>
      category === 'truck'
        ? trucks.filter((t) => truckIds.includes(String(t.id))).map((t) => ({ detail: t.driver?.full_name, id: String(t.id), regNo: t.reg_no }))
        : bookingTrucks.map(({ booking, bt }) => ({
            detail: [bt.driver?.full_name ?? bt.truck.driver?.full_name, booking.booking_number].filter(Boolean).join(' · '),
            id: String(bt.id),
            regNo: bt.truck.reg_no,
          })),
    [bookingTrucks, category, truckIds, trucks]
  )

  /** The first fuel vendor chosen sets On-spot / Bill unless the user picked one (req. 8). */
  function vendorChosen(vendorId: string) {
    const vendor = vendors.find((v) => String(v.id) === vendorId)
    if (vendor && !paymentModeTouched) setPaymentMode(vendor.payment_mode)
  }

  function changePaymentMode(mode: PaymentMode) {
    setPaymentMode(mode)
    setPaymentModeTouched(true)
  }

  function changeTrucks(ids: string[]) {
    setTruckIds(ids)
    setRows((prev) => prev.map((row) => ({ ...row, truckIds: row.truckIds.filter((id) => ids.includes(id)) })))
  }

  /** Trip lines hold booking-truck ids and Truck lines truck ids, so switching clears the lines' trucks. */
  function changeCategory(next: ExpenseCategory) {
    setCategory(next)
    setRows((prev) => prev.map((row) => ({ ...row, truckIds: [] })))
  }

  /** Start the lines from a template: a copy the user can edit (req. 13). */
  function applyTemplate(id: string) {
    setTemplateId(id)
    const template = templates.find((t) => String(t.id) === id)
    if (!template) return
    setRows(rowsFromTemplate(template, bookingTrucks.map(({ bt }) => String(bt.id))))
    setOutboundBorder(template.outbound_border ?? '')
    setReturnBorder(template.return_border ?? '')
  }

  function changeFormKind(kind: ExpenseFormKind) {
    setFormKind(kind)
    setTemplateId('')
    setParentOrderId('')
    setRows([blankRow()])
  }

  /** A return settlement (163) works on the going order's bookings (req. 24). */
  function chooseParent(id: string) {
    setParentOrderId(id)
    const parent = goOrders.find((o) => String(o.id) === id)
    if (parent) changeBookings(parent.bookings.map((b) => b.id))
  }

  function changeType(next: LineCategory) {
    setType(next)
    setFormKind(null)
    setTemplateId('')
    if (next === 'fuel' && category === 'office') setCategory('trip')
    setRows([{ ...newRow(), currency: next === 'vibali_congo' ? 'USD' : 'TZS' }])
  }

  function changeBookings(ids: number[]) {
    setBookingIds(ids)
    const allowed = new Set(bookings.filter((b) => ids.includes(b.id)).flatMap((b) => b.booking_trucks.map((bt) => String(bt.id))))
    setRows((prev) => prev.map((row) => ({ ...row, truckIds: row.truckIds.filter((id) => allowed.has(id)) })))
  }

  function updateRow(key: string, patch: Partial<LineRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  function addAccount(account: LookupItem) {
    setAccounts((prev) => [...prev, account])
    setPaymentAccountId(String(account.id))
  }

  function headerProblem(): string | null {
    if (expense?.is_legacy_mixed) return 'This order mixes expense types from before they were separated. It can be viewed and downloaded but not edited.'
    if (!referenceNo.trim()) return 'Enter a unique expense reference number.'
    if (type === 'mengine' && !subcategoryId && !isEditMode) return 'Choose the subcategory (e.g. Weighbridge, GCLA).'
    if (category === 'trip' && bookingIds.length === 0) return 'Select at least one booking for a Trip expense.'
    if (category === 'truck' && truckIds.length === 0) return 'Select at least one truck for a Truck expense.'
    if (isFuel && paymentMode === 'on_spot' && missingPrice) return 'Fuel paid on the spot needs the price per litre on every line.'
    if (changedPriceGroups.length > 0 && !priceChangeReason.trim()) return 'Give a reason for changing a fuel price that was already set.'
    if (isVibaliForm) {
      if (rows.some((r) => r.currency === 'ZMK') && !(Number(zmkRate) > 0)) return 'Enter the ZMK → TSh rate for this order.'
      if (activeForm === 'general' && rows.some((r) => r.currency === 'USD') && !(Number(usdRate) > 0)) return 'Enter the USD → TSh rate for this order.'
      if (activeForm === 'return' && !parentOrderId) return 'Choose the going order (165) this return settles.'
      return vibaliProblem(rows, activeForm === 'return')
    }
    return rowsProblem(rows, category, type)
  }

  async function submit() {
    const problem = headerProblem()
    setError(problem)
    if (problem) return

    const header = {
      booking_ids: category === 'trip' ? bookingIds : [],
      form: activeForm ?? undefined,
      lines: isVibaliForm ? buildVibaliLines(rows, type) : buildLines(rows, category, type),
      other_subcategory_id: type === 'mengine' && subcategoryId ? Number(subcategoryId) : undefined,
      outbound_border: activeForm === 'route' || activeForm === 'go' ? outboundBorder || undefined : undefined,
      parent_order_id: activeForm === 'return' && parentOrderId ? Number(parentOrderId) : undefined,
      return_border: activeForm === 'route' || activeForm === 'return' ? returnBorder || undefined : undefined,
      route_template_id: (activeForm === 'route' || activeForm === 'go') && templateId ? Number(templateId) : undefined,
      usd_rate: usdRate || undefined,
      zmk_rate: zmkRate || undefined,
      payment_account_id: paymentAccountId ? Number(paymentAccountId) : undefined,
      payment_date: paymentDate || undefined,
      payment_mode: isFuel ? paymentMode : undefined,
      price_change_reason: changedPriceGroups.length > 0 ? priceChangeReason.trim() : undefined,
      reference_no: referenceNo.trim(),
      vendor_id: type.startsWith('vibali') && vendorId ? Number(vendorId) : undefined,
    }

    setIsSubmitting(true)
    try {
      if (expense) await updateExpenseOrder(expense.id, header)
      else await createExpenseOrder({ ...header, category, expense_type: type })
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    accounts,
    activeForm,
    addAccount,
    applyTemplate,
    addExtraRow: () => setRows((prev) => [...prev, { ...blankRow(), isAdditional: true }]),
    addRow: () => setRows((prev) => [...prev, blankRow()]),
    bookingIds,
    bookingTrucks,
    bookings,
    category,
    changeBookings,
    changeFormKind,
    chooseParent,
    changePaymentMode,
    changeCategory,
    changeTrucks,
    changeType,
    changedPriceGroups,
    driverOf,
    lineTruckOptions,
    error,
    initiatedBy: expense?.initiated_by ?? user?.name ?? '',
    isEditMode,
    goOrders,
    isCongo,
    isFuel,
    isVibaliForm,
    isLoadingBookings,
    isLegacyMixed: !!expense?.is_legacy_mixed,
    isSubmitting,
    lineVendors,
    outboundBorder,
    parentOrderId,
    returnBorder,
    missingPrice,
    paymentAccountId,
    paymentDate,
    paymentMode,
    priceChangeReason,
    referenceNo,
    removeRow: (key: string) => setRows((prev) => prev.filter((row) => row.key !== key)),
    rows,
    setCategory,
    setPaymentAccountId,
    setOutboundBorder,
    setPaymentDate,
    setReturnBorder,
    setUsdRate,
    setZmkRate,
    setPriceChangeReason,
    setReferenceNo,
    setSubcategoryId,
    setVendorId,
    subcategories,
    subcategoryId,
    submit,
    templateId,
    templates,
    total,
    totals,
    truckIds,
    trucks,
    type,
    updateRow,
    usdRate,
    vendorChosen,
    vendorId,
    vendors,
    zmkRate,
  }
}

export type ExpenseFormState = ReturnType<typeof useExpenseForm>
