import { configureStore } from '@reduxjs/toolkit'
import prReducer from '@/features/pr/prSlice'

export const store = configureStore({
  reducer: {
    pr: prReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
