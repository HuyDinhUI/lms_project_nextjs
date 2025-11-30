import { configureStore } from '@reduxjs/toolkit'
import boardReducer from "./boardSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      board: boardReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']