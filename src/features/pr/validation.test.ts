import { describe, expect, it } from 'vitest'
import { findDuplicateCodes, hasDuplicateCodes, isRowEmpty } from './validation'

describe('findDuplicateCodes', () => {
  it('returns codes that appear more than once (case-insensitive)', () => {
    const result = findDuplicateCodes(['MAT-001', 'mat-001', 'MAT-002'])
    expect(result.has('mat-001')).toBe(true)
    expect(result.has('mat-002')).toBe(false)
  })

  it('ignores blank codes', () => {
    expect(findDuplicateCodes(['', '  ', ''])).toEqual(new Set())
  })
})

describe('hasDuplicateCodes', () => {
  it('flags duplicates ignoring case and whitespace', () => {
    expect(hasDuplicateCodes([{ materialCode: 'MAT-1' }, { materialCode: ' mat-1 ' }])).toBe(true)
  })

  it('is false when all codes are unique', () => {
    expect(hasDuplicateCodes([{ materialCode: 'A' }, { materialCode: 'B' }])).toBe(false)
  })

  it('ignores empty rows', () => {
    expect(hasDuplicateCodes([{ materialCode: '' }, { materialCode: '' }])).toBe(false)
  })
})

describe('isRowEmpty', () => {
  it('treats a row with only defaults as empty', () => {
    expect(isRowEmpty({ materialCode: '', materialName: '', requiredDate: '', remarks: '' })).toBe(true)
  })

  it('is not empty once any field is filled', () => {
    expect(isRowEmpty({ materialCode: 'MAT-1' })).toBe(false)
  })
})
