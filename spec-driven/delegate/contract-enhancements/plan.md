# Contract enhancements 2026 — plan & status

Source of truth: `../../../../Makuruma_Logistics_Enhancement_Contract_5.pdf` (sections 2.1 and 2.2).

## Locked decisions

- Loading point, offloading point, cargo, rate, tons and ETA are stored **per booking truck**; booking-level fields are a summary (shared value or empty when trucks differ; earliest ETA).
- "Same / Different" is a form mode per field (loading, offloading, cargo, rate); it is derived from the saved values when editing — no extra columns.
- Tons = `booking_trucks.capacity`, editable per truck, prefilled from the truck's capacity.
- Copy & edit / Return from Go create a normal booking with `bookings.source_booking_id`; no source data is changed. Return-from-Go swaps the route (Go offloading → Return loading) and leaves cargo, rate and ETA empty.
- Number inputs are text inputs with a decimal keyboard (mouse wheel cannot change them).
- Trucks need a trailer and a driver (`BookingTruckService::assertBookable`), enforced on create, add and swap.
- Tracking is per booking leg (Go / Return); Sakania route = Tunduma → Nakonde → Sakania Zambia → Sakania DRC → Whisky (reversed on Return); notifications in-app only.

## 2.1 Booking — done

| Item | Where |
| --- | --- |
| A-1 Loading Location column, Current Location rename | `resources/views/bookings/access-list-pdf.blade.php`, booking form/table |
| A-2 Total Tons under Tons | PDF `<tfoot>`, form table footer |
| A-3 Arrange by tons/ETA | `booking-form-utils.ts#sortRows` |
| B-1/B-2 Copy & edit, Return from Go | `prefillFromBooking`, listing actions, `source_booking_id` |
| B-3 Truck search | `truck-picker.tsx` |
| B-4 Add / correct truck | `POST|PUT bookings/{booking}/trucks[/{bookingTruck}]`, `BookingTruckService::attach|swap` |
| B-5 ETA per truck | `booking_trucks.eta` |
| B-6/B-7 Same/Different | `mode-fields.tsx` |
| B-8 No wheel edits | text + `inputMode="decimal"` |
| B-9 Trailer + driver required | `BookingTruckService::assertBookable`, picker shows reason |
| Listing highlight cards | `booking-highlights.tsx` |
| Fix: `removeTruck` route had no controller method | `BookingController::removeTruck` |

## 2.2 Tracking — next
