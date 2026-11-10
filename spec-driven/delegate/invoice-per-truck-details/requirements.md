# Requirements — invoice-per-truck-details

Status: confirmed 2026-11-10. Contract 2.4 (Invoice), decided with the client 2026-11-10.

## Decisions

- D1 Loading point, offloading point, cargo, rate and ETA may be the same for every truck on a booking or different per truck (already captured per truck since Booking 2.1).
- D2 Documents show these values **per truck line**. The header shows a value only when every truck on the invoice shares it; otherwise it says "Multiple – see lines".
- D3 A booking may be invoiced **in parts**: an invoice can cover only the trucks that have finished their trip while the others are still in transit. The remaining trucks are invoiced later.

## What exists today

- API already invoices selected trucks: `InvoiceController@store` takes `lines[].booking_truck_id`; `eligibleTrucks` returns every active truck not yet on an invoice of that type. So D3 works server-side.
- Invoice form (`InvoiceForm.tsx`) lets the user tick trucks, but shows no trip state, and the rate defaults from the booking, not the truck.
- Invoice PDF line columns: description, quantity, rate, amount. The footer sentence uses `booking.loading_point` / `offloading_point` only.
- "Trip sheet" = tracking Excel (`TrackingSheetExport`): already prints per-truck loading/offloading points.

## Functional requirements

- R1 Invoice PDF lines add: truck (reg no), loading → offloading point, cargo, ETA, using the booking-truck value, falling back to the booking value.
- R2 Invoice PDF header/footer route sentence follows D2.
- R3 Tracking Excel adds cargo, rate and ETA per truck row (same fallback).
- R4 Invoice form truck picker shows each truck's tracking status and offloading date, and pre-fills rate and tons from that truck (not the booking).
- R5 Invoice form explains partial invoicing: trucks not ticked stay available for a later invoice of the same type; an "Only completed / offloaded" quick filter selects just those trucks.
- R6 The invoice list/detail shows which trucks of the booking are still not invoiced for that type (count + reg nos).

## Rules

- No change to how amounts are computed (advance, settlement, standing time, adjustment).
- Business rule enforced in the API: a truck cannot be on two invoices of the same type (already true); keep it.
- Global kit for any UI touched (badges for status, `useConfirmation`, `toast`).

## Out of scope

- Splitting an existing invoice; credit notes.
- Expense 2.3 items.

## Open question

- Should partial invoicing be limited to trucks that are offloaded/completed, or may any truck be invoiced at any time (e.g. advance invoices before loading)? Default assumption: any truck may be invoiced (advance needs this); the quick filter only helps select completed ones.

## Done when

- PDF and Excel checked for a booking with mixed routes/cargo/rates; invoice created for 1 of 3 trucks, then a second invoice for the rest.
- `php artisan test`, `pnpm typecheck`, `pnpm build` pass.
