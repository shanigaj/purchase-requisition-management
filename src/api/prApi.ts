import type {
  PrDraft,
  PrListFilters,
  PrListResult,
  PurchaseRequisition,
} from '@/types/pr'
import { SEED_PRS } from '@/data/seed'

// --- Fake persistence -------------------------------------------------------
// We keep everything in localStorage so the app behaves like it talks to a
// backend (data survives refresh) without needing a real server.

const STORAGE_KEY = 'pr_management_data_v1'

function load(): PurchaseRequisition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRS))
      return [...SEED_PRS]
    }
    return JSON.parse(raw) as PurchaseRequisition[]
  } catch {
    return [...SEED_PRS]
  }
}

function save(rows: PurchaseRequisition[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

function delay(ms = 500) {
  return new Promise((res) => setTimeout(res, ms))
}

// Flip this to true (via the URL flag below) to test the error state.
function shouldFail(): boolean {
  return new URLSearchParams(window.location.search).get('fail') === '1'
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function nextPrNumber(rows: PurchaseRequisition[]): string {
  const max = rows.reduce((acc, r) => {
    const n = Number(r.prNumber.replace(/\D/g, ''))
    return Number.isFinite(n) && n > acc ? n : acc
  }, 0)
  return `PR-${String(max + 1).padStart(4, '0')}`
}

// --- Public API -------------------------------------------------------------

export async function listPRs(filters: PrListFilters): Promise<PrListResult> {
  await delay()
  if (shouldFail()) throw new Error('Unable to reach the server. Please try again.')

  let rows = load()

  const term = filters.search.trim().toLowerCase()
  if (term) {
    rows = rows.filter((r) => r.prNumber.toLowerCase().includes(term))
  }
  if (filters.status !== 'All') {
    rows = rows.filter((r) => r.status === filters.status)
  }
  if (filters.fromDate) {
    rows = rows.filter((r) => r.requestDate >= filters.fromDate)
  }
  if (filters.toDate) {
    rows = rows.filter((r) => r.requestDate <= filters.toDate)
  }

  rows.sort((a, b) => (a.requestDate < b.requestDate ? 1 : -1))

  const total = rows.length
  const start = (filters.page - 1) * filters.pageSize
  const paged = rows.slice(start, start + filters.pageSize)

  return { rows: paged, total }
}

export async function getPR(id: string): Promise<PurchaseRequisition> {
  await delay(350)
  if (shouldFail()) throw new Error('Unable to load this requisition.')
  const row = load().find((r) => r.id === id)
  if (!row) throw new Error('Requisition not found.')
  return row
}

export async function getNextPrNumber(): Promise<string> {
  await delay(200)
  return nextPrNumber(load())
}

type SaveArgs = {
  id?: string
  draft: PrDraft
  status: 'Draft' | 'Pending'
}

export async function savePR({ id, draft, status }: SaveArgs): Promise<PurchaseRequisition> {
  await delay(600)
  if (shouldFail()) throw new Error('Could not save the requisition.')

  const rows = load()
  const now = new Date().toISOString()

  if (id) {
    const idx = rows.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Requisition not found.')
    const updated: PurchaseRequisition = {
      ...rows[idx],
      ...draft,
      status,
      updatedAt: now,
    }
    rows[idx] = updated
    save(rows)
    return updated
  }

  const created: PurchaseRequisition = {
    id: uid(),
    ...draft,
    prNumber: draft.prNumber || nextPrNumber(rows),
    status,
    createdAt: now,
    updatedAt: now,
  }
  rows.push(created)
  save(rows)
  return created
}
