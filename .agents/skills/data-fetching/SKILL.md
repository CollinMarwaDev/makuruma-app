---
name: data-fetching
description: Call the Makuruma Laravel API from the SPA — services on top of apiClient, types, Zod validation of untrusted data, loading/error states, file uploads and downloads. Use whenever a screen reads or writes server data.
---

# Data Fetching

## Pattern

1. Service function in `src/services/<resource>Service.ts` using `apiClient(endpoint, options)` (adds `Accept`, JSON body, bearer token, throws `Error(message)` on non-2xx).
2. Types in `src/types/<resource>.ts`, matching the Laravel JSON (snake_case keys as returned).
3. Page/component calls the service in an effect or event handler, keeps `isLoading`/`error` state, and renders skeleton → data / empty / error.
4. After a mutation, update local state from the response or refetch the list; never show stale totals.

## Rules

- Find the endpoint in `../makuruma-backend/routes/api.php` and its controller before writing a call. If it does not exist, follow `backend-boundary`.
- Validate untrusted input with Zod: imported CSV/XLSX rows, query params, and any response you transform heavily. Shared schemas → `src/global/utils/zod-common`.
- Files: uploads use `FormData` without a `Content-Type` header (see `useUploadFile`); downloads use `fetch` + blob with the token (see `src/utils/documentHelpers.ts`, `csvExports.ts`).
- One action = the minimum mutation. No read-before-write unless the backend requires it.
- Show API error messages with `toast.error(message)`.
