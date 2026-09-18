import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { savePR } from '@/features/pr/prSlice'
import * as api from '@/api/prApi'
import { CURRENT_USER, DEPARTMENTS, PRIORITIES } from '@/data/reference'
import { todayIso } from '@/lib/format'
import type { PrFormValues } from '@/features/pr/formTypes'
import { hasDuplicateCodes } from '@/features/pr/validation'
import MaterialItemsTable from '@/features/pr/components/MaterialItemsTable'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import BackButton from '@/components/BackButton'
import { useToast } from '@/components/ui/Toast'

interface Props {
  mode: 'create' | 'edit'
}

const label = 'mb-1 block text-xs font-medium text-slate-500'
const control =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600'

function blankItem() {
  return {
    id: Math.random().toString(36).slice(2, 10),
    materialCode: '',
    materialName: '',
    quantity: 1,
    unit: 'NOS',
    requiredDate: '',
    remarks: '',
  }
}

export default function PrFormPage({ mode }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()

  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<'draft' | 'submit' | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const methods = useForm<PrFormValues>({
    defaultValues: {
      prNumber: '',
      requestDate: todayIso(),
      department: '',
      requestedBy: CURRENT_USER,
      priority: 'Medium',
      items: [blankItem()],
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = methods

  // Load existing PR (edit) or fetch a fresh PR number (create).
  useEffect(() => {
    let active = true

    async function init() {
      try {
        if (mode === 'edit' && id) {
          const pr = await api.getPR(id)
          if (!active) return
          reset({
            prNumber: pr.prNumber,
            requestDate: pr.requestDate,
            department: pr.department,
            requestedBy: pr.requestedBy,
            priority: pr.priority,
            items: pr.items,
          })
          setLoading(false)
        } else {
          const num = await api.getNextPrNumber()
          if (!active) return
          reset({ ...getValues(), prNumber: num })
        }
      } catch (e) {
        if (active) setLoadError(e instanceof Error ? e.message : 'Failed to load.')
        setLoading(false)
      }
    }

    init()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id])

  async function persist(values: PrFormValues, status: 'Draft' | 'Pending') {
    setFormError(null)
    if (hasDuplicateCodes(values.items)) {
      setFormError('Two or more items share the same material code. Please remove duplicates.')
      return
    }
    try {
      setSaving(status === 'Draft' ? 'draft' : 'submit')
      const saved = await dispatch(savePR({ id, draft: values, status })).unwrap()
      toast.success(
        status === 'Draft'
          ? `${saved.prNumber} saved as draft.`
          : `${saved.prNumber} submitted for approval.`,
      )
      navigate('/requisitions')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save.'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSaving(null)
    }
  }

  // Submit for Approval - full validation via RHF.
  const onSubmitApproval = handleSubmit((values) => persist(values, 'Pending'))

  // Save as Draft - lenient: only needs a department and at least a code somewhere.
  function onSaveDraft() {
    const values = getValues()
    if (!values.department) {
      setFormError('Please select a department before saving.')
      return
    }
    persist(values, 'Draft')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Spinner className="h-5 w-5 text-brand-600" />
        Loading requisition...
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-600">{loadError}</p>
        <Button className="mt-3" variant="secondary" onClick={() => navigate('/requisitions')}>
          Back to list
        </Button>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmitApproval} className="space-y-6" noValidate>
        <div className="space-y-3">
          <BackButton />
          <h1 className="text-xl font-semibold text-slate-800">
            {mode === 'create' ? 'Create Purchase Requisition' : 'Edit Purchase Requisition'}
          </h1>
        </div>

        {/* Header information */}
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Header Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={label}>PR Number</label>
              <input
                {...register('prNumber')}
                readOnly
                className={`${control} bg-slate-50 text-slate-500`}
              />
            </div>

            <div>
              <label className={label}>Request Date *</label>
              <input
                type="date"
                {...register('requestDate', { required: true })}
                className={`${control} ${errors.requestDate ? 'border-red-400' : ''}`}
              />
            </div>

            <div>
              <label className={label}>Department *</label>
              <select
                {...register('department', { required: true })}
                className={`${control} bg-white ${errors.department ? 'border-red-400' : ''}`}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>Requested By *</label>
              <input
                {...register('requestedBy', { required: true })}
                className={`${control} ${errors.requestedBy ? 'border-red-400' : ''}`}
              />
            </div>

            <div>
              <label className={label}>Priority *</label>
              <select {...register('priority', { required: true })} className={`${control} bg-white`}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Material items */}
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Material Items</h2>
          </div>
          <MaterialItemsTable />
          {errors.items && !formError && (
            <p className="mt-3 text-sm text-red-500">
              Please complete all required fields for each material item.
            </p>
          )}
        </section>

        {formError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onSaveDraft}
            loading={saving === 'draft'}
            disabled={saving !== null}
          >
            {saving === 'draft' ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button type="submit" loading={saving === 'submit'} disabled={saving !== null}>
            {saving === 'submit' ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
