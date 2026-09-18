import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import * as api from '@/api/prApi'
import type { PrDraft, PrListFilters, PurchaseRequisition } from '@/types/pr'
import type { RootState } from '@/app/store'

interface PrState {
  rows: PurchaseRequisition[]
  total: number
  filters: PrListFilters
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: string | null
}

const initialFilters: PrListFilters = {
  search: '',
  status: 'All',
  fromDate: '',
  toDate: '',
  page: 1,
  pageSize: 5,
}

const initialState: PrState = {
  rows: [],
  total: 0,
  filters: initialFilters,
  listStatus: 'idle',
  listError: null,
}

export const fetchPRs = createAsyncThunk('pr/fetchList', async (filters: PrListFilters) => {
  return api.listPRs(filters)
})

export const savePR = createAsyncThunk(
  'pr/save',
  async (args: { id?: string; draft: PrDraft; status: 'Draft' | 'Pending' }) => {
    return api.savePR(args)
  },
)

const prSlice = createSlice({
  name: 'pr',
  initialState,
  reducers: {
    // Merge partial filter changes; any change except page-only resets to page 1.
    setFilters(state, action: PayloadAction<Partial<PrListFilters>>) {
      const onlyPage = Object.keys(action.payload).length === 1 && 'page' in action.payload
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: onlyPage ? (action.payload.page as number) : 1,
      }
    },
    resetFilters(state) {
      state.filters = initialFilters
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPRs.pending, (state) => {
        state.listStatus = 'loading'
        state.listError = null
      })
      .addCase(fetchPRs.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        state.rows = action.payload.rows
        state.total = action.payload.total
      })
      .addCase(fetchPRs.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.listError = action.error.message ?? 'Something went wrong.'
      })
  },
})

export const { setFilters, resetFilters } = prSlice.actions

export const selectPrList = (s: RootState) => s.pr
export const selectFilters = (s: RootState) => s.pr.filters

export default prSlice.reducer
