# Requirements

Source: client meeting on the Expense module (Nov 2026), contract 2.3 and amendment B (small omissions). Target: 2–3 days.
Sample forms: `samples/` (123, 129, 165, 180, Mizani No. 05).

## Goal

Make each expense type a separate order with its own number series and form, matching the client's paper forms (fuel, Vibali Tunduma 123/129, Vibali Congo 165/163/emergency, Other), with optional fuel price, user-editable route templates, "same for all" truck entry and user-managed vendor types and payment accounts.

## Functional Requirements

Order structure
1. An expense order has exactly one type: Fuel, Vibali Tunduma, Vibali Congo or Other. The API rejects lines of another type; the form offers no way to mix them.
2. Each type has its own serial number (e.g. FUEL-00001, VT-00001, VC-00001, OTH-00001). Existing order numbers do not change.
3. A Trip-category order can link one or more bookings; trucks are picked from those bookings.
4. Category rules: Trip = bookings + trucks (trip report); Truck = one truck, counted in the truck's annual report; Office = no truck or booking, excluded from trip and truck reports.
5. Truck pickers on expense forms are searchable (reg no., driver).
6. "Initiated by" is filled from the logged-in user and is read-only.

Fuel
7. A fuel line needs truck, driver (prefilled from the booking/truck) and litres; price per litre is optional.
8. An order is On-spot (paid now, price known) or Bill-based (paid later, in one or more vendor payments). The vendor's default payment mode prefills it.
9. Changing a saved price requires a reason; the old price, new price, reason, user and time are kept and shown in the order history.
10. Orders with any line missing a price show "Pending price". After 14 days they are flagged overdue on the Expenses list and Accountants get an in-app notice. A pending-price order cannot be marked paid.
11. Downloading a fuel order asks "Show price?"; the PDF includes or omits the price/amount columns accordingly.

Vibali Tunduma — route form (123)
12. Users with Admin/Manager/Accountant roles can create, edit and deactivate route templates without a developer: name, outbound border (Kasumbalesa/Sakania), return border, and lines grouped by segment (Dar–Tunduma, Zambia, Border–DRC offload), each with description, currency (USD/ZMK/TZS), unit amount, multiplier, or flat amount.
13. Creating an order from a template copies its lines; the user can edit them. Editing a template never changes existing orders.
14. "Same for all" applies a line to every truck in the selected bookings in one step; an additional line can target selected trucks only.
15. A line amount = unit amount × multiplier (e.g. 300 × 10 gates = 3,000 per truck) × number of trucks; the amount description ("300 X 10 = 3,000") is prefilled, editable and printed. A line may instead be a flat amount with no trucks (e.g. Pesa ya kutolea).
16. Lines are grouped by currency in the order USD, ZMK, TSh, each with a subtotal. USD is never converted. The ZMK subtotal is converted at the order's on-spot rate and printed as "145,350 X 138 = TSh20,058,300". Grand total = TSh lines + converted ZMK; the USD total is shown separately.
17. Heading follows the sample: "VIBALI TUNDUMA GARI <n> - <date> (<CLIENT>) KWENDA <border> - KURUDI <border>". The truck list is printed once below, next to the booking number(s).
18. Users can record USD→TZS rates per date range; these are used only by the profit report.

Vibali Tunduma — general form (129)
19. No template; each line has its own trucks (from one or more bookings), currency, unit amount and count; ZMK/USD subtotals convert to TSh at the order's rate. The printout lists the trucks of each line under the line's name, then a per-truck total table headed "TRUCK | PESA" (fixes the "CHANJO" heading typo in sample 129).
20. Each line records whether money goes to the Driver or an Agent; this is not printed.

Vibali Congo
21. Amounts are USD only; an optional internal rate is stored for reports and never printed.
22. Go form (165) uses route templates and "same for all" (req. 12–15): template lines, subtotal, then additional lines (e.g. Pulling entry card $30) for all or selected trucks (e.g. pulling, capacity 37/38), then total. Heading: "VIBALI CONGO KWENDA GARI <n> - <date> - (<CLIENT>) <border>".
23. The printout lists the order's trucks once; a line lists trucks only when its truck set differs from the order's.
24. Return form (163) links to a Go order and settles with the driver: lines can be positive (extra spent) or negative (unused, returned). A line with no truck (e.g. fare for the driver collecting money) is split equally across the order's trucks in reports.
25. Emergency expenses (form 180: penalty, posho, visa) are On-spot orders with no booking required; each line has its own trucks, and its multiplier may be days (e.g. Posho 5 × 11 days for one truck). The printout lists each line's trucks and a per-truck total table.

Other expenses, payment accounts, vendors
26. Other orders have a subcategory (Weighbridge, GCLA, ECIL, Salaries, Driver mileage, Agent allowance, Truck maintenance; users can add more). Lines need description and amount. The profit report groups by subcategory. Weighbridge (Mizani) prints as sample No. 05: heading "MIZANI <place> GARI <n> - <date>", columns Truck, Driver name, Kiasi, total.
27. Payment account is a dropdown (Cash, M-Pesa, CRDB seeded) with "Add account" inline.
28. Vendor types are a user-managed list (Fuel and ECIL seeded; existing e-seal vendors become ECIL). Vibali Tunduma and Congo orders have an optional vendor.

## Non-functional Requirements

- Every rule above is enforced in the API, not only in the UI.
- Reversible migrations; existing orders stay viewable and downloadable; back up production before deploy.
- New screens use `src/global/components` and theme tokens (light and dark).
- `pnpm typecheck`, `pnpm build`, `php artisan test` pass; feature tests cover req. 1, 2, 9, 10, 16.

## Out of Scope

- Excel template download/upload for expenses (portal form is the single primary workflow for now).
- Per-download column chooser beyond the fuel price toggle — waits for the client UAT list of mandatory/optional columns.
- Reconciliation improvements (v2), Assets, Invoice changes.

## Assumptions

- Printout layouts follow current forms; final alignment happens when the client sends samples (see Open Questions).
- Number prefixes FUEL / VT / VC / OTH; printouts show "NO: <serial>" as on the samples.
- ZMK→TSh rate is entered per order (samples use 138).
- Approval flow (pending → approved → paid) is unchanged; On-spot orders still need approval.
- Overdue alert reuses the existing in-app database notifications.

## Open Questions

- Still pending from the client: fuel forms (with/without price) and the second Other-expense form. Both uploaded 129 files are identical; is a revised 129 still coming?
- Form 180 per-truck table shows "PENALTY $125" as one row and totals $310 against $760: should penalties be split per truck or kept as one row?
- Other numbering: sample Mizani is No. 05 (own series). One OTH series, or one per subcategory?
- Should Emergency / On-spot orders skip approval and be saved as paid?
