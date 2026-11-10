---
name: makuruma-web
description: Entry skill for any code task in the Makuruma Logistics web app (React 19 + Vite + Tailwind 4 SPA talking to a Laravel API). Load first; it gives the stack, commands, folder map and which other skills to load.
---

# Makuruma Web

## Stack

- React 19, TypeScript (strict), Vite 8, Tailwind CSS 4, `react-router-dom` 7 with `<BrowserRouter>` (no data router: no loaders/actions/`useFetcher`).
- API: Laravel 12 in `../makuruma-backend`, Sanctum bearer token stored in `localStorage.auth_token`, base URL `VITE_API_BASE_URL`.
- Global design system in `src/global` (components, hooks, utils, providers, theme). Live catalogue at `/components/playground`.
- Libraries available: radix-ui, react-hook-form + zod (3.25), cmdk, dayjs, sonner, react-day-picker 9, @tanstack/react-table 8, chart.js, recharts (existing dashboard), lucide-react (existing pages), @solar-icons/react, @heroicons/react.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` (http://localhost:5173) |
| Type-check | `pnpm typecheck` (silence = no errors) |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| API | `cd ../makuruma-backend && php artisan serve --host=127.0.0.1 --port=8000` |

## Where things go

| Need | Location |
| --- | --- |
| A screen | `src/pages/<Name>.tsx` + route in `src/App.tsx` (see `routing`) |
| Feature component for one module | `src/components/` (existing PascalCase files) or a kebab-case module folder for new work |
| Reusable UI | `src/global/components` (see `component-catalog`, `component-creation`) |
| API call | `src/services/<resource>Service.ts` via `apiClient` (see `data-fetching`) |
| API types | `src/types/<resource>.ts` |
| Colours | `src/global/styles/theme.css` only |

## Load next

- Product context: `project-overview`
- Structure & naming: `folder-structure`, `separation-of-concerns`
- UI: `component-catalog` → `component-creation` → `form-handling` → `frontend-design`
- Data & API gaps: `data-fetching`, `backend-boundary`
- Process: `working-agreements`, `code-review`, `../../spec-driven/workflow.md`
