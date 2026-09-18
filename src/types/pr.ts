export type PrStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected'

export type Priority = 'Low' | 'Medium' | 'High'

export interface MaterialItem {
  id: string
  materialCode: string
  materialName: string
  quantity: number
  unit: string
  requiredDate: string // ISO yyyy-mm-dd
  remarks: string
}

export interface PurchaseRequisition {
  id: string
  prNumber: string
  requestDate: string // ISO yyyy-mm-dd
  department: string
  requestedBy: string
  priority: Priority
  status: PrStatus
  items: MaterialItem[]
  createdAt: string
  updatedAt: string
}

// Payload used when creating / editing (no server fields yet)
export interface PrDraft {
  prNumber: string
  requestDate: string
  department: string
  requestedBy: string
  priority: Priority
  items: MaterialItem[]
}

export interface PrListFilters {
  search: string
  status: PrStatus | 'All'
  fromDate: string
  toDate: string
  page: number
  pageSize: number
}

export interface PrListResult {
  rows: PurchaseRequisition[]
  total: number
}
