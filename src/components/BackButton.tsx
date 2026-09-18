import { useNavigate } from 'react-router-dom'

interface Props {
  to?: string
  label?: string
}

export default function BackButton({ to = '/requisitions', label = 'Back to list' }: Props) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-brand-200 hover:text-brand-700"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-200 group-hover:-translate-x-0.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </span>
      {label}
    </button>
  )
}
