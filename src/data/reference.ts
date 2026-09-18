// Static reference data. In a real ERP these come from master APIs.

export const DEPARTMENTS = [
  'Production',
  'Maintenance',
  'Quality',
  'Stores',
  'Purchase',
  'Finance',
  'HR',
] as const

export const UNITS = ['NOS', 'KG', 'MTR', 'LTR', 'BOX', 'SET', 'PKT'] as const

export const PRIORITIES = ['Low', 'Medium', 'High'] as const

export const STATUSES = ['Draft', 'Pending', 'Approved', 'Rejected'] as const

// Pretend logged-in user for the "auto-fill" requirement
export const CURRENT_USER = 'John Doe'
