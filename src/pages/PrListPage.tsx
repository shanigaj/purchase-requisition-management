import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPRs, selectPrList, setFilters } from '@/features/pr/prSlice'
import PrFilters from '@/features/pr/components/PrFilters'
import PrTable from '@/features/pr/components/PrTable'
import Pagination from '@/features/pr/components/Pagination'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function PrListPage() {
  const dispatch = useAppDispatch()
  const { rows, total, filters, listStatus, listError } = useAppSelector(selectPrList)

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchPRs(filters))
    }, 300)
    return () => clearTimeout(t)
  }, [dispatch, filters])

  const isLoading = listStatus === 'loading'
  const isError = listStatus === 'failed'
  const hasRows = rows.length > 0

  // First load -> skeleton. Refetch (filter/pagination change) -> keep the
  // table visible and dim it under a spinner so the layout doesn't jump.
  const showSkeleton = isLoading && !hasRows
  const showEmpty = listStatus === 'succeeded' && !hasRows

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Purchase Requisitions</h1>
          <p className="text-sm text-slate-500">Manage and track material requisitions.</p>
        </div>
        <Link to="/requisitions/new">
          <Button>+ Create PR</Button>
        </Link>
      </div>

      <PrFilters />

      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isError ? (
          <StateBox
            title="Couldn't load requisitions"
            message={listError ?? 'Please try again.'}
            action={
              <Button loading={isLoading} onClick={() => dispatch(fetchPRs(filters))}>
                Retry
              </Button>
            }
          />
        ) : showSkeleton ? (
          <TableSkeleton />
        ) : showEmpty ? (
          <StateBox
            title="No requisitions found"
            message="Try adjusting your filters, or create a new requisition."
            action={
              <Link to="/requisitions/new">
                <Button>+ Create PR</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className={isLoading ? 'pointer-events-none opacity-50 transition-opacity' : ''}>
              <PrTable rows={rows} />
              <Pagination
                page={filters.page}
                pageSize={filters.pageSize}
                total={total}
                onPageChange={(page) => dispatch(setFilters({ page }))}
              />
            </div>
            {isLoading && (
              <div className="absolute inset-0 grid place-items-center">
                <Spinner className="h-7 w-7 text-brand-600" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StateBox({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
      <h3 className="text-base font-medium text-slate-700">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-slate-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="ml-auto h-6 w-16 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
