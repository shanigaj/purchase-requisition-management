import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import PrListPage from '@/pages/PrListPage'
import PrFormPage from '@/pages/PrFormPage'
import PrViewPage from '@/pages/PrViewPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/requisitions" replace /> },
      { path: 'requisitions', element: <PrListPage /> },
      { path: 'requisitions/new', element: <PrFormPage mode="create" /> },
      { path: 'requisitions/:id', element: <PrViewPage /> },
      { path: 'requisitions/:id/edit', element: <PrFormPage mode="edit" /> },
      { path: '*', element: <Navigate to="/requisitions" replace /> },
    ],
  },
]
