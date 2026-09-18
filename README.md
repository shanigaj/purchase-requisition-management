# Purchase Requisition Management

A Purchase Requisition (PR) module for a manufacturing ERP, built as part of a
technical assessment. It covers the full flow of raising and managing material
requisitions: listing with search/filters/pagination, and a create/edit form
with dynamic line items and validation.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build tooling)
- **Tailwind CSS** (styling)
- **React Router** (routing)
- **Redux Toolkit** + **React Redux** (list state, filters, async thunks)
- **React Hook Form** (form state + dynamic field arrays)
- **Vitest** (unit tests)

There is no real backend. A small mock API layer (`src/api/prApi.ts`) simulates
network latency and persists data to `localStorage`, which keeps the app
realistic (loading/error/empty states, data survives a refresh) without a server.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # typecheck + production build
npm run preview   # preview the production build
npm test          # run unit tests (Vitest)
```

## Features

**Listing (`/requisitions`)**

- Table: PR Number, Date, Department, Requested By, Status, Total Items, Actions
- Search by PR number (debounced)
- Filter by status and by date range (from/to)
- Pagination
- Loading skeleton, empty state, and error state with retry
- View / Edit actions per row

**Create / Edit (`/requisitions/new`, `/requisitions/:id/edit`)**

- Header: auto-generated PR number (read-only), request date, department,
  requested-by (auto-filled with the current user), priority
- Material items table with add / remove rows
- Validation: required fields, quantity must be ≥ 1, and duplicate material
  codes are flagged inline and blocked on submit
- Removing a filled row asks for confirmation first
- **Save as Draft** (lenient) and **Submit for Approval** (full validation)
- Success/error toasts on save

**View (`/requisitions/:id`)** - read-only summary of a requisition.

## Tests

```bash
npm test
```

Vitest covers the pure logic that's most worth protecting: duplicate-code /
empty-row detection (`features/pr/validation`), the filters reducer
(page-reset behaviour), and date formatting.

## Testing the states

- Empty state: search for a PR number that doesn't exist.
- Error state: append `?fail=1` to the URL and the mock API will reject requests,
  which surfaces the error/retry UI.

## Project structure

```
src/
  api/                 mock API (localStorage + latency)
  app/                 redux store + typed hooks
  components/          layout + shared UI (Button, StatusBadge)
  data/                reference data + seed records
  features/pr/         PR slice, form types, and PR-specific components
  lib/                 small helpers (date formatting)
  pages/               list / form / view screens
  routes.tsx           route table
```

## Notes / decisions

- Redux Toolkit holds the *list* concerns (rows, filters, pagination, request
  status) since those are shared and benefit from a single source of truth.
  The form uses React Hook Form locally, since it's self-contained and re-rendering
  it through the store would add noise for no gain.
- Draft save is intentionally lenient so a user can park an incomplete
  requisition; approval submission runs the full validation.
- Given the assessment's time box, the focus was clean structure, correct
  workflow, and the required states rather than exhaustive edge cases.
```
