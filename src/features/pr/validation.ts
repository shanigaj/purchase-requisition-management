import type { MaterialItem } from '@/types/pr'

const norm = (code: string) => code.trim().toLowerCase()

// Material codes that appear more than once (case-insensitive, ignoring blanks).
export function findDuplicateCodes(codes: string[]): Set<string> {
  const counts = new Map<string, number>()
  for (const c of codes) {
    const key = norm(c)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return new Set([...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k))
}

export function hasDuplicateCodes(items: Pick<MaterialItem, 'materialCode'>[]): boolean {
  const codes = items.map((i) => norm(i.materialCode)).filter(Boolean)
  return new Set(codes).size !== codes.length
}

// A material row is "empty" if the user hasn't entered anything meaningful yet.
export function isRowEmpty(item: Partial<MaterialItem>): boolean {
  return (
    !item.materialCode?.trim() &&
    !item.materialName?.trim() &&
    !item.requiredDate &&
    !item.remarks?.trim()
  )
}
