---
name: project-overview
description: Business and product context for the Makuruma Logistics Management System — a Tanzanian trucking company's internal system for bookings, trips, truck tracking across borders, expenses, invoices and reconciliation. Use to understand users, workflows, terminology and the current contract scope.
---

# Makuruma Logistics — Project Overview

Makuruma Logistics runs trucks (each with a trailer and a driver) carrying cargo (e.g. copper, sulphur, general cargo) between Tanzania, Zambia and the DR Congo. The system is used by office staff only; there is no customer portal.

## Users (roles from `RoleSeeder`)

| Role | Main work |
| --- | --- |
| Admin | Everything, users and roles, configuration (e.g. custom tracking statuses) |
| Manager | Bookings, trips, tracking oversight, reports |
| Accountant | Expenses, invoices, reconciliation; receives completion notices |
| Operator | Day-to-day booking and tracking updates |
| Driver | Reserved role (no driver-facing app today) |

## Core workflow

1. **Booking** — a client books a convoy: Go (outward) or Return booking, with trucks, cargo, tons, rate, loading point, offloading point and ETA per truck. Trucks need an assigned trailer and driver.
2. **Trip** — each booked truck becomes a trip with a code.
3. **Tracking** — a truck moves through checkpoints in route order (Tunduma → Nakonde → Kasumbalesa Zambia → Kasumbalesa DRC → Whisky …). Sakania is an alternate border/route. Statuses (e.g. Loaded, In transit, Parked, Clearing, Waiting to cross, Offloaded, Completed) are updated per truck; POD (proof of delivery) is uploaded after offloading.
4. **Expenses** — recorded per trip and per truck (fuel and other categories) and consolidated into a convoy expense sheet.
5. **Invoices & reconciliation** — invoices per booking/trip; client statements and vendor ledgers.

## Terminology

- **Go / Return booking** — outward trip and the back-load trip for the same trucks.
- **Convoy** — the set of trucks on one booking.
- **Current location** vs **loading location** — where the truck is now vs where it loads.
- **POD** — proof of delivery document.
- **ETA** — per truck, never one ETA for the whole booking.

## Current scope (contract 2026)

`../../../../Makuruma_Logistics_Enhancement_Contract_5.pdf`:

- 2.1 Booking — form/listing/report refinements, copy & edit, return from go booking, truck search, add/correct trucks, per-truck ETA, Same/Different modes, no wheel-scroll on numbers, trailer+driver required.
- 2.2 Tracking — CSV/XLSX template, export, bulk import/update, highlight cards, Go-trip access until offloaded, date order, Sakania route, custom statuses, POD view/delete, auto-complete after 5 days with in-app Accountant notice, POD-overdue alert.
- 2.3 Expense — category-specific form, per-truck expenses, convoy sheet.
- 2.4 Invoice — downloadable report layout only.

Anything else is out of scope unless the user confirms it.
