import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '@/api/prApi'
import type { PurchaseRequisition } from '@/types/pr'
import type { PrFormValues } from '@/features/pr/formTypes'
import MaterialItemsTable from '@/features/pr/components/MaterialItemsTable'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import BackButton from '@/components/BackButton'
import { formatDate } from '@/lib/format'

export default function PrViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pr, setPr] = useState<PurchaseRequisition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<PrFormValues>()

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .getPR(id!)
      .then((row) => {
        if (!active) return
        setPr(row)
        methods.reset(row)
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Spinner className="h-5 w-5 text-brand-600" />
        Loading requisition...
      </div>
    )
  }

  if (error || !pr) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-600">{error ?? 'Requisition not found.'}</p>
        <Button className="mt-3" variant="secondary" onClick={() => navigate('/requisitions')}>
          Back to list
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-800">{pr.prNumber}</h1>
          <StatusBadge status={pr.status} />
        </div>
        <Button onClick={() => navigate(`/requisitions/${pr.id}/edit`)}>Edit</Button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Header Information</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Request Date" value={formatDate(pr.requestDate)} />
          <Info label="Department" value={pr.department} />
          <Info label="Requested By" value={pr.requestedBy} />
          <Info label="Priority" value={pr.priority} />
          <Info label="Total Items" value={String(pr.items.length)} />
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Material Items</h2>
        <FormProvider {...methods}>
          <MaterialItemsTable readOnly />
        </FormProvider>
      </section>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || '-'}</dd>
    </div>
  )
}
