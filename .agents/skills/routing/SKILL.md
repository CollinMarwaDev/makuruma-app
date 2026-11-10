---
name: routing
description: Add or change routes in the Makuruma SPA (react-router-dom 7 BrowserRouter, ProtectedRoute, Layout with sidebar). Use when adding a page, nav item, URL param, search param state or redirect.
---

# Routing

- All routes are declared in `src/App.tsx` inside `<BrowserRouter>`; there is no data router, so no loaders/actions/`useFetcher`/`useRouteError`/`useBlocker`.
- Authenticated pages sit under the `ProtectedRoute` + `Layout` element (sidebar shell). Full-screen authenticated pages (e.g. `/components/playground`) wrap their element in `ProtectedRoute` without `Layout`.
- Heavy, rarely-used pages are `lazy()`-loaded with a `Suspense` fallback of `PageLoader`.
- Sidebar entries live in `src/components/Sidebar.tsx` (`navItems`). Add a link only for user-facing pages.
- Use URL search params for list state that should survive refresh/share (filters, page, sort): `useSearchParamsState` from `~/global/utils/r3/hooks`.
- Data loads in the page with `useEffect` + service call (see `data-fetching`); show `TableSkeleton`/`PageLoader` while loading and an empty/error state after.
- Role checks: read `user.role.slug` from `useAuth()`; the API remains the authority.
