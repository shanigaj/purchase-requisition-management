import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { resetFilters, selectFilters, setFilters } from '@/features/pr/prSlice'
import { STATUSES } from '@/data/reference'

export default function PrFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters)

  const dirty =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.fromDate !== '' ||
    filters.toDate !== ''

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-500">Search PR Number</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          placeholder="e.g. PR-0001"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
        <select
          value={filters.status}
          onChange={(e) => dispatch(setFilters({ status: e.target.value as typeof filters.status }))}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
        >
          <option value="All">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">From date</label>
        <input
          type="date"
          value={filters.fromDate}
          max={filters.toDate || undefined}
          onChange={(e) => dispatch(setFilters({ fromDate: e.target.value }))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">To date</label>
        <input
          type="date"
          value={filters.toDate}
          min={filters.fromDate || undefined}
          onChange={(e) => dispatch(setFilters({ toDate: e.target.value }))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
        />
      </div>

      {dirty && (
        <div className="flex items-end lg:col-span-5">
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
