import type { MaterialItem, Priority } from '@/types/pr'

export interface PrFormValues {
  prNumber: string
  requestDate: string
  department: string
  requestedBy: string
  priority: Priority
  items: MaterialItem[]
}
