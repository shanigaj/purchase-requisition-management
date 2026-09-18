import type { PrStatus } from '@/types/pr'

const map: Record<PrStatus, string> = {
  Draft: 'bg-slate-100 text-slate-600',
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }: { status: PrStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  )
}
