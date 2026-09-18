import { useNavigate } from 'react-router-dom'
import type { PurchaseRequisition } from '@/types/pr'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'

export default function PrTable({ rows }: { rows: PurchaseRequisition[] }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="bg-brand-800 text-left text-xs font-semibold uppercase tracking-wide text-white">
            <th className="px-4 py-3">PR Number</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Requested By</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Total Items</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((pr) => (
            <tr key={pr.id} className="border-b border-slate-100 hover:bg-slate-50/60">
              <td className="px-4 py-3 font-medium text-slate-800">{pr.prNumber}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(pr.requestDate)}</td>
              <td className="px-4 py-3 text-slate-600">{pr.department}</td>
              <td className="px-4 py-3 text-slate-600">{pr.requestedBy}</td>
              <td className="px-4 py-3">
                <StatusBadge status={pr.status} />
              </td>
              <td className="px-4 py-3 text-center text-slate-600">{pr.items.length}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/requisitions/${pr.id}`)}
                    className="inline-flex items-center gap-1 rounded-md border border-brand-600 px-2.5 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50"
                  >
                    <EyeIcon />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/requisitions/${pr.id}/edit`)}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <PencilIcon />
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}
