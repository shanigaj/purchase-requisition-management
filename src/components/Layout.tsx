import { Link, Outlet } from 'react-router-dom'
import { CURRENT_USER } from '@/data/reference'

export default function Layout() {
  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/requisitions" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-600 font-bold text-white">
              S
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-800">Spectrum ERP</div>
              <div className="text-xs text-slate-500">Purchase Requisition</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:inline">Signed in as</span>
            <span className="font-medium text-slate-800">{CURRENT_USER}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
              {CURRENT_USER.split(' ').map((p) => p[0]).join('')}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
