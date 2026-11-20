# Requirements

Source: UAT feedback 20 Nov 2026 (Booking 2, Tracking 4, Expenses 10). Builds on the Posho truck-list fix (VC-00001, done 20 Nov, uncommitted).

## Goal

Close the 20 Nov UAT items: ETA same-for-all and ETA-based booking month; offloaded trucks visible to the client a while longer, a status drop-down in the tracking Excel, Unbooked / Needs-booking tabs; expense numbering, fuel drivers, payment dates, approver edits, filling dates, driver/agent money, a faster Expenses page and larger PDF text.

## Functional Requirements

Booking
1. ETA gets the same "Same for all / Different per truck" choice as loading point, cargo and rate.
2. A booking's month = the month of the average ETA of its trucks (today when no truck has an ETA). It drives the month part of a new booking number and the booking month in the dashboard and reports.

Tracking
3. An offloaded leg stays on the Active tab until N full days after its offloading date (N = 1 by default, set in `.env` `TRACKING_OFFLOADED_VISIBLE_DAYS`), and is in the Offloaded tab from the moment it is offloaded. The Active Excel download includes it.
4. Download Excel: the CURRENT STATUS column (GOING and RETURN sheets) is a drop-down of the active status names; Excel refuses other text. Upload checks stay as they are.
5. New Tracking tab **Unbooked**: active trucks with no open leg (no leg, or every leg Offloaded), with last leg, last location and days idle.
6. New Tracking tab **Needs booking (urgent)**:
   - Go leg that reached Kasumbalesa Zambia or Sakania Zambia and whose trip has no Return booked;
   - Return leg that reached Nakonde and whose truck has no later Go booking.
   "Reached" = an arrival date at that checkpoint, or current location naming it. Shows truck, driver, leg, booking, where/when reached.

Expenses
7. The reference number typed on the form is the form number: PDF "NO:", Excel, file names, list and search use it. It stays unique per expense type. The system number (VC-00001…) is kept internally only.
8. Fuel lines: the driver is filled automatically from the leg (Trip order) or the truck's assigned driver (Truck order) and is no longer required; it can still be changed.
9. Mark as paid asks for the payment date (default today, not in the future); that date is stored as the paid date, shown on the order and used for "paid this month".
10. The user who approved an order can edit it while it is Approved and not yet Paid; it stays Approved. Others keep today's rule (edit only when Pending).
11. Fuel lines get an optional **Filling date**. The vendor ledger dates a fuel line by its filling date, or the order date when blank (e.g. Negelo).
12. Every Vibali line must say whether the money goes to the **Driver** or stays with the **Agent**. The PDF prints, under the totals, "To driver" and "Stays with agent" amounts per currency.
13. Expenses page loads quickly: the list is paged and filtered on the server and carries only the columns it shows; full details load when an order is opened.
14. All PDF printouts (expense forms, invoices, tracking and trip reports) use larger text (about +20%), still fitting the page.
15. Both expense Excel downloads (order Excel and per-category Excel) mirror the approved PDF of the order's form: same title, number, line table (S/N, Details, Amount, No of trucks, Total), currency subtotals/conversions, truck lists and per-truck totals; fuel follows the fuel PDF (with/without price).

## Non-functional Requirements

- Rules enforced in the API; migrations reversible; production backup before deploy.
- `php artisan test`, `pnpm typecheck`, `pnpm build`, `pnpm lint` pass; tests cover 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 15.

## Out of Scope

- Route-template **segment** (feedback Q7): today it is only a label on the template screen — no effect on amounts, PDFs or reports. No change.
- Past ETA (feedback Tracking Q4): today only a red "Past ETA" badge on Tracking and Trips; no alert, no blocking, not in Excel. No change.

## Assumptions

- Booking numbers are never renumbered (contract 2.1 B-4, confirmed 20 Nov): req. 2 sets the month of a NEW booking's number; the booking month used by dashboard/reports is recalculated when ETAs change.
- Offloaded-visible days default 1, adjustable by IT (confirmed 20 Nov).
- Expense Excel = mirror of the PDFs (confirmed 20 Nov); fine-tuning after client review.
- Existing orders keep their reference numbers; duplicates within a type on live are checked before the migration.
- Payee on existing Vibali lines stays blank (not forced) until the order is edited.

## Open Questions

_none_
