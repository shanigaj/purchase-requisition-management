import { describe, expect, it } from 'vitest'
import reducer, { resetFilters, setFilters } from './prSlice'

// Grab the slice's initial state by dispatching an unknown action.
const initial = reducer(undefined, { type: '@@INIT' })

describe('prSlice filters', () => {
  it('resets to page 1 when a filter (other than page) changes', () => {
    const onPage3 = { ...initial, filters: { ...initial.filters, page: 3 } }
    const next = reducer(onPage3, setFilters({ status: 'Approved' }))
    expect(next.filters.status).toBe('Approved')
    expect(next.filters.page).toBe(1)
  })

  it('keeps other filters when only the page changes', () => {
    const withSearch = { ...initial, filters: { ...initial.filters, search: 'PR-0002' } }
    const next = reducer(withSearch, setFilters({ page: 2 }))
    expect(next.filters.page).toBe(2)
    expect(next.filters.search).toBe('PR-0002')
  })

  it('resetFilters restores defaults', () => {
    const dirty = {
      ...initial,
      filters: { ...initial.filters, search: 'x', status: 'Rejected' as const, page: 4 },
    }
    const next = reducer(dirty, resetFilters())
    expect(next.filters).toEqual(initial.filters)
  })
})
