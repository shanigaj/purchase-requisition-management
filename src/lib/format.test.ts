import { describe, expect, it } from 'vitest'
import { formatDate } from './format'

describe('formatDate', () => {
  it('formats an ISO date as dd/mm/yyyy', () => {
    expect(formatDate('2025-09-25')).toBe('25/09/2025')
  })

  it('returns a dash for an empty value', () => {
    expect(formatDate('')).toBe('-')
  })

  it('leaves an unexpected value untouched', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})
