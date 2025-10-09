import { nanoid } from "nanoid"
import { useContext, useEffect, useRef, useState } from "react"
import useGridSubtasksPattern from "../../../custom hooks/useGridSubtasksPattern"
import Dialog from "../../UI/Dialog/Dialog"
import { useDispatch, useSelector } from "react-redux"
import { editTask, selectTaskData } from "../../../features/boards/boardsSlice"
import { SelectedTaskIdContext } from "../../../contexts/contexts"

function DialogEditTask({ isOpen, onClose }) {
  const [subtasks, setSubtasks]   = useState([])
  const [columnName, setColumnName] = useState("")

  const idOfSelectedTask = useContext(SelectedTaskIdContext)
  const taskData = useSelector((state) => selectTaskData(state, idOfSelectedTask))
  const dispatch = useDispatch()

  const refGrid = useRef(null)
  
  function handleSubmit(e) {
    const formData = new FormData(e.target)
    
    e.target.reset()

    dispatch(editTask({
      id: idOfSelectedTask,
      columnId: taskData.columns.find(option => option.name === columnName).id,
      title: formData.get("title"),
      description: formData.get("description"),
      subtasks: subtasks.map((subtask, index) => ({
        id: subtask.id,
        title: formData.getAll("subtask")[index],
      })),
    }))
  }
  
  useEffect(() => {
    setSubtasks([...taskData.subtasks])
  }, [taskData])

  useEffect(() => {
    const col = taskData.columns.find(column => column.id === taskData.columnId)
    if (col) setColumnName(col.name)
  }, [taskData])

  useGridSubtasksPattern(refGrid, subtasks)

  return (
    <Dialog isOpen={isOpen} isModal={true} className="modal" closedby="any" onClose={onClose}>
      <div className="title">Edit Task</div>
      <form method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Title</span>
          <input className="textbox full" name="title" required pattern="^(?=.*\S).+$" maxLength={80} type="text" defaultValue={taskData.title} autoComplete="off" />
        </label>
        <label className="field">
          <span className="label">Description</span>
          <textarea className="textbox multiline full" name="description" pattern="^(?=.*\S).+$" maxLength={300} defaultValue={taskData.description} autoComplete="off"></textarea>
        </label>
        <fieldset className="field">
          <legend className="label">Subtasks</legend>
          <div ref={refGrid} className="container-grid" role="grid" aria-label="Subtasks">
            {subtasks.map((subtask, i) => (
              <div className="container-row" key={subtask.id} role="row">
                <span className="cell-subtask" role="gridcell" data-grid-focusable="true">
                  <input className="textbox flex" name="subtask" required pattern="^(?=.*\S).+$" maxLength={80} type="text" defaultValue={subtask.title} autoComplete="off" tabIndex="-1" aria-label={`Subtask ${i + 1}`} />
                </span>
                <span role="gridcell">
                  <button className="button-remove" type="button" aria-label={`Remove Subtask ${i + 1}`} data-grid-focusable="true" onClick={() => setSubtasks(subtasks.filter(st => st.id !== subtask.id))}>
                    <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z"/><path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z"/></g></svg>
                  </button>
                </span>
              </div>
            ))}
          </div>
          <button className="button-add" type="button" onClick={() => setSubtasks([...subtasks, { id: nanoid(), title: "" }])}>Add New Subtask</button>
        </fieldset>
        <label className="field">
        </label>
        <label className="field">
          <span className="label">Status</span>
          <select className="dropdown drop-down" name="column" value={columnName} onChange={(e) => setColumnName(e.target.value)}>
            {taskData.columns.map(column => (
              <option key={column.id} value={column.name}>{column.name}</option>
            ))}
          </select>
        </label>
        <button className="button-submit" type="submit">Save Changes</button>
      </form>
    </Dialog>
  )
}

export default DialogEditTask