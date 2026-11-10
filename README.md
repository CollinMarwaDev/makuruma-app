# Makuruma Logistics – Web App

React 19 + TypeScript + Vite 8 + Tailwind CSS 4 single-page app for the Makuruma Logistics Management System. It talks to the Laravel API in `../makuruma-backend`.

> Full first-time setup (PHP, MySQL, API, seeding): see [`../README.md`](../README.md).

## Run

This project uses **pnpm** (version pinned in `package.json` → `packageManager`). Enable it once with `corepack enable` (ships with Node 20+) or `brew install pnpm`. Do not use `npm install` — it would create a second lockfile.

```bash
pnpm install          # after every pull that changes package.json
pnpm dev          # http://localhost:5173  (API must be on http://127.0.0.1:8000)
```

Sign in with the seeded admin (`admin@makuruma.local` / `password`) or your own account.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload |
| `pnpm typecheck` | Type-check only (`tsc -b`; silence = no errors) |
| `pnpm build` | Type-check and production build to `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | ESLint |

Environment files:

| File | Used by | Key |
| --- | --- | --- |
| `.env.development` | `pnpm dev` | `VITE_API_BASE_URL=http://127.0.0.1:8000/api` |
| `.env.production` | `pnpm build` | production API URL |

## Deploy

Production deploy (VPS, Nginx, pnpm build): see `../makuruma-backend/DEPLOY.md`. On the server run `bash scripts/deploy-server.sh` from this folder.

## Folder structure

```
src/
├── global/                     # design system shared by every screen
│   ├── components/             # global components (button, modal, table, form-controls, …)
│   ├── hooks/                  # global hooks (useFilePicker, useCountdown, useUploadFile, …)
│   ├── utils/                  # cn, dates, strings, files, zod-common, toast, local-storage
│   ├── providers/              # theme, confirmation dialog, dialog context
│   ├── constants/              # brand colours for charts, country codes
│   ├── styles/theme.css        # ALL colour tokens (light + dark) – change brand colours here
│   └── types/                  # shared types (IconType, LabelWithValue, …)
├── pages/                      # one file per route (Bookings.tsx, Tracking.tsx, …)
│   └── components-playground/  # /components/playground – live catalogue of src/global
├── components/                 # feature components used by pages (BookingForm, TrackingTable, …)
├── services/                   # API calls (apiClient + one service per resource)
├── types/                      # API data types per resource
├── context/ hooks/ constants/ utils/   # app-level auth context and helpers
├── App.tsx                     # routes
└── index.css                   # Tailwind entry (imports global/styles/theme.css)
```

Imports use the `~/` alias for `src/` (e.g. `import { Button } from "~/global/components/button"`).

## Design system

- **Colours:** teal-blue primary `#2a7f88` (logo blue `#106880`), green success `#22a06b`, orange accent `#f8a13f`. Defined once as CSS variables in `src/global/styles/theme.css`, exposed as Tailwind tokens (`bg-primary`, `text-accent`, `bg-status-green-bg`, `border-outline`, `bg-surface`, …).
- **Light + dark:** the `.dark` class on `<html>`; toggle in the sidebar (or on the playground). The choice is saved per browser; default is dark.
- **Playground:** open **`/components/playground`** (signed in) to see every global component in both themes. When you add a component to `src/global/components`, add an example there.
- **Toasts:** `import { toast } from "~/global/utils/toast"` → `toast.success("Saved")`.
- **Confirm dialogs:** wrap with `ConfirmationProvider`, then `const confirm = useConfirmation(); if (await confirm({ title: "Delete POD?" })) …`.

## Working with AI agents

`AGENTS.md` (and `CLAUDE.md`) route agents to the project skills in `.agents/skills/` and the spec-driven workflow in `spec-driven/`.
