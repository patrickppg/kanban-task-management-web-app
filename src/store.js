import { configureStore } from '@reduxjs/toolkit'
import boardsReducer from './features/boards/boardsSlice'

export default configureStore({
  reducer: {
    boards: boardsReducer
  },
})