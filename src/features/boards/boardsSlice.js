import { createSelector, createSlice, weakMapMemoize } from "@reduxjs/toolkit";

export const boardsSlice = createSlice({
  name: "boards",
  initialState: [],
  reducers: {
    addBoard(state, action) {
      state.push(action.payload)
    },

    editBoard(state, action) {
      const { id, name, columns: newColumns } = action.payload

      const board = state.find(board => board.id === id)
      const currentColumns = board.columns

      const newColumnsMap = Object.fromEntries(newColumns.map(c => [c.id, c]))

      const currentIds = new Set(currentColumns.map(c => c.id))
      const newIds = new Set(newColumns.map(c => c.id))

      const addedColumns = newColumns.filter(c => !currentIds.has(c.id))
      const removedColumns = currentColumns.filter(c => !newIds.has(c.id))
      const existingColumns = currentColumns.filter(c => newIds.has(c.id))

      if (board.name !== name) board.name = name

      for (const column of removedColumns) {
        currentColumns.splice(currentColumns.indexOf(column), 1)
      }

      for (const column of addedColumns) {
        currentColumns.push({ ...column, tasks: [] })
      }

      for (const column of existingColumns) {
        const newColumn = newColumnsMap[column.id]
        if (column.name !== newColumn.name) column.name = newColumn.name
      }
    },

    deleteBoard(state, action) {
      const id = action.payload

      state.splice(state.findIndex(board => board.id === id), 1)
    },

    addTask(state, action) {
      const { boardId, columnId, ...task } = action.payload

      const board = state.find(board => board.id === boardId)
      const column = board.columns.find(column => column.id === columnId)

      column.tasks.push(task)
    },

    editTask(state, action) {
      const { id, columnId, title, description, subtasks } = action.payload
      const { column, task } = getInclusiveAncestors(state, { taskId: id })
      const { column: toColumn } = getInclusiveAncestors(state, { columnId })
      const prevSubtaskMap = Object.fromEntries(task.subtasks.map(st => [st.id, st]))
      
      if (task.title !== title) task.title = title
      if (task.description !== description) task.description = description
      task.subtasks = subtasks.map(subtask => ({
        id: subtask.id,
        title: subtask.title,
        isCompleted: Boolean(prevSubtaskMap[subtask.id]?.isCompleted)
      }))

      if (column.id !== columnId) {
        toColumn.tasks.push(task)
        column.tasks = column.tasks.filter(task => task.id !== id)
      }
    },

    deleteTask(state, action) {
      const id = action.payload
      const { column } = getInclusiveAncestors(state, { taskId: id })
      
      column.tasks.splice(column.tasks.findIndex(task => task.id === id), 1)
    },

    addColumn(state, action) {
      const { boardId, ...column } = action.payload
      const board = state.find(board => board.id === boardId)
      
      board.columns.push(column)
    },

    moveTask(state, action) {
      const { id, columnId } = action.payload
      const { column, task } = getInclusiveAncestors(state, { taskId: id })
      const { column: toColumn } = getInclusiveAncestors(state, { columnId })

      toColumn.tasks.push(task)
      column.tasks = column.tasks.filter(task => task.id !== id)
    },

    toggleSubtask(state, action) {
      const { id, isCompleted } = action.payload
      const { subtask } = getInclusiveAncestors(state, { subtaskId: id })

      subtask.isCompleted = isCompleted
    }
  }
})

export const selectBoardOptions = createSelector(
  [(state) => state.boards],
  (boards) => boards.map(board => ({
    id: board.id,
    name: board.name
  }))
)

export const selectBoardData = createSelector(
  [(state) => state.boards, (_, id) => id],
  (boards, id) => {
    const board = boards.find(board => board.id === id) || { name: "", columns: [] }

    return ({
      name: board.name,
      columns: board.columns.map(column => ({
        id: column.id,
        name: column.name,
        tasks: column.tasks.map(task => ({
          id: task.id,
          title: task.title,
          numSubtasks: task.subtasks.length,
          numCompletedSubtasks: task.subtasks.reduce((acc, subtask) => subtask.isCompleted ? ++acc : acc, 0)
        })) 
      }))
    })
  }
)

export const selectEditBoardData = createSelector(
  [(state) => state.boards, (_, id) => id],
  (boards, id) => {
    const board = boards.find(board => board.id === id) || { name: "", columns: [] }

    return ({
      name: board.name,
      columns: board.columns.map(column => ({
        id: column.id,
        name: column.name
      }))
    })
  }
)

export const selectBoardName = createSelector(
  [(state) => state.boards, (_, id) => id],
  (boards, id) => {
    const board = boards.find(board => board.id === id) || { name: "" }

    return board.name
  }
)

export const selectFirstBoardId = createSelector(
  [(state) => state.boards],
  (boards) => {
    const board = boards[0] || { id: "" }
    
    return board.id
  }
)

export const selectColumnOptions = createSelector(
  [(state) => state.boards, (_, boardId) => boardId],
  (boards, boardId) => {
    const board = boards.find(board => board.id === boardId) || { columns: [] }

    return board.columns.map(column => ({
      id: column.id,
      name: column.name
    }))
  }
)

export const selectTaskData = createSelector(
  [(state) => state.boards, (_, id) => id],
  (boards, id) => {
    const {
      board = { columns: [] },
      column = { id: "" },
      task = { title: "", description: "", subtasks: [] }
    } = getInclusiveAncestors(boards, { taskId: id })

    return ({
      title: task.title,
      description: task.description,
      subtasks: task.subtasks.map(subtask => ({
        id: subtask.id,
        title: subtask.title,
        isCompleted: subtask.isCompleted
      })),
      columnId: column.id,
      columns: board.columns.map(column => ({
        id: column.id,
        name: column.name
      }))
    })
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize
  }
)

export const selectTaskTitle = createSelector(
  [(state) => state.boards, (_, id) => id],
  (boards, id) => {
    const { task = { title: "" } } = getInclusiveAncestors(boards, { taskId: id })

    return task.title
  }
)

function getInclusiveAncestors(boards, { columnId, taskId, subtaskId }) {
  for (const board of boards) {
    for (const column of board.columns) {
      if (column.id === columnId) return { board, column }
      for (const task of column.tasks) {
        if (task.id === taskId) return { board, column, task }
        for (const subtask of task.subtasks) {
          if (subtask.id === subtaskId) return { board, column, task, subtask }
        }
      }
    }
  }

  return {}
}

export const { addBoard, editBoard, deleteBoard, addTask, editTask, deleteTask, addColumn, moveTask, toggleSubtask } = boardsSlice.actions
export default boardsSlice.reducer