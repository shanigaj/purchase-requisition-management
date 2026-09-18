import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import type { PrFormValues } from '@/features/pr/formTypes'
import { findDuplicateCodes, isRowEmpty } from '@/features/pr/validation'
import { UNITS } from '@/data/reference'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const emptyRow = () => ({
  id: Math.random().toString(36).slice(2, 10),
  materialCode: '',
  materialName: '',
  quantity: 1,
  unit: 'NOS',
  requiredDate: '',
  remarks: '',
})

const cell =
  'w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600'
const cellError = 'border-red-400 focus:border-red-500 focus:ring-red-500'

export default function MaterialItemsTable({ readOnly = false }: { readOnly?: boolean }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PrFormValues>()

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const [pendingRemove, setPendingRemove] = useState<number | null>(null)

  // Watch codes to highlight duplicates as the user types.
  const items = useWatch({ control, name: 'items' }) ?? []
  const duplicateCodes = findDuplicateCodes(items.map((i) => i?.materialCode ?? ''))

  function requestRemove(index: number) {
    // Skip the confirm for a row the user never filled in.
    if (isRowEmpty(items[index] ?? {})) {
      remove(index)
    } else {
      setPendingRemove(index)
    }
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="bg-brand-800 text-left text-xs font-semibold uppercase tracking-wide text-white">
              <th className="px-3 py-2.5">Material Code</th>
              <th className="px-3 py-2.5">Material Name</th>
              <th className="px-3 py-2.5">Quantity</th>
              <th className="px-3 py-2.5">Unit</th>
              <th className="px-3 py-2.5">Required Date</th>
              <th className="px-3 py-2.5">Remarks</th>
              {!readOnly && <th className="px-3 py-2.5 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const rowErr = errors.items?.[index]
              const isDup =
                !!items[index]?.materialCode &&
                duplicateCodes.has(items[index].materialCode.trim().toLowerCase())

              return (
                <tr key={field.id} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-2">
                    <input
                      {...register(`items.${index}.materialCode`, { required: true })}
                      readOnly={readOnly}
                      className={`${cell} ${rowErr?.materialCode || isDup ? cellError : ''}`}
                      placeholder="MAT-001"
                    />
                    {isDup && <p className="mt-1 text-xs text-red-500">Duplicate material</p>}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`items.${index}.materialName`, { required: true })}
                      readOnly={readOnly}
                      className={`${cell} ${rowErr?.materialName ? cellError : ''}`}
                      placeholder="Bearing"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                        required: true,
                        min: 1,
                      })}
                      readOnly={readOnly}
                      className={`${cell} w-24 ${rowErr?.quantity ? cellError : ''}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      {...register(`items.${index}.unit`, { required: true })}
                      disabled={readOnly}
                      className="w-24 rounded-md border border-slate-300 bg-white py-1.5 pl-2 pr-7 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-slate-50"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      {...register(`items.${index}.requiredDate`, { required: true })}
                      readOnly={readOnly}
                      className={`${cell} ${rowErr?.requiredDate ? cellError : ''}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`items.${index}.remarks`)}
                      readOnly={readOnly}
                      className={cell}
                      placeholder="Optional"
                    />
                  </td>
                  {!readOnly && (
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => requestRemove(index)}
                        disabled={fields.length === 1}
                        title={fields.length === 1 ? 'At least one item is required' : 'Remove item'}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <Button type="button" onClick={() => append(emptyRow())}>
          + Add Item
        </Button>
      )}

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Remove item?"
        message="This material item will be removed from the requisition."
        confirmLabel="Remove"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (pendingRemove !== null) remove(pendingRemove)
          setPendingRemove(null)
        }}
      />
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}
