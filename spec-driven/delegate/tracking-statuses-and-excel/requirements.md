# Requirements

Source: client request (17 Nov 2026) — critical tracking status changes and one Excel format for every tracking download/upload. Sample: `samples/MAKURUMA TRACKING 16.11.2026.xlsx` (the client's GOING/RETURN layout as exported today).

## Goal

Use the client's own status names (no Loading, At border, Offloading or Completed) and make the GOING/RETURN tracking Excel the single format for downloading, exporting and bulk-updating trucks.

## Functional Requirements

Statuses
1. Loading is replaced by two statuses: **Waiting to load** and **Loaded – waiting for documents**.
2. At border is replaced by **Clearing** and **Waiting to cross** (both exist today as optional statuses; they become fixed system statuses).
3. Offloading and Completed are replaced by **Waiting to offload** and **Offloaded**. Offloaded is the final status of a leg.
4. Loading, At border, Offloading and Completed no longer appear anywhere: status pickers, Tracking list, badges, dashboard cards, PDFs, Excel.
5. Existing legs and trucks move to the new statuses: Loading → Loaded – waiting for documents if a loading date is set, else Waiting to load; At border → Clearing; Offloading → Waiting to offload; Completed → Offloaded.
6. Status order in pickers: Pending, On route to loading, Waiting to load, Loaded – waiting for documents, In transit, Clearing, Waiting to cross, other statuses (In crossing queue, Parked, Delayed, Breakdown, admin-added), Waiting to offload, Offloaded.
7. The Tracking "Completed" tab becomes "Offloaded" and lists legs whose status is Offloaded; the active list shows all other legs.
8. Rules that used Completed now use Offloaded: a Go leg stays open until Offloaded; the truck becomes free for its next booking when Offloaded, as with Completed today.
9. No automatic status change after offloading. 5 days after the offloading date, Accountants still get the in-app "ready for invoicing" notice (contract 2.2 D-6), and the POD-overdue alert (D-7) is unchanged.

Excel (one format)
10. Every tracking download is the client's GOING/RETURN Excel layout ("MAKURUMA TRACKING dd.mm.yyyy.xlsx"), filled with the legs on the current tab with the current search and filters. Export CSV is removed.
11. Each row shows everything the system holds for the template's columns: truck, trailer, driver's name and contacts, current location, current status, loading point, loading point arrival, date of loading, dispatch, offloading point, arrival/dispatch at each border on the leg's route (Kasumbalesa or Sakania), offloading point arrival and offloading date.
12. The downloaded file can be edited and uploaded to update many trucks at once: status, location and all dates. Upload first shows a preview (changes per row, rejected rows with reasons), then saves only the valid rows. Blank cells leave values unchanged.
13. Status cells must use the current status names; an old name (e.g. "LOADING", "AT BORDER", "COMPLETED") is rejected with a message naming the statuses that replace it.
14. Rows are matched by the hidden SYSTEM ID column; a row typed without an ID is matched by truck number to that truck's latest leg on the sheet (as today). Offloaded legs can be updated through the file too.
15. The Tracking page explains the steps next to Download Excel / Upload Excel: download, edit in Excel, upload, check the preview, save.

## Non-functional Requirements

- Status rules enforced in the API (manual update, Excel import, scheduler).
- Reversible migration for the status rename; back up production first.
- `php artisan test`, `pnpm typecheck`, `pnpm build`, `pnpm lint` pass; tests cover req. 5, 8, 9, 10, 13.

## Out of Scope

- Clearing a value through the file (blank = unchanged).
- A separate blank template download.
- Changes to admin-added custom statuses.

## Assumptions

- In crossing queue, Parked, Delayed and Breakdown stay as optional statuses.
- Dashboard truck-status cards show the new status names.
- The leg PDF report uses the new names.

## Open Questions

_none_
