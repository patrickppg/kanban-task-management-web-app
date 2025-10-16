import { useContext, useEffect, useRef, useState } from "react"
import { SelectedTaskIdContext } from "../../../contexts/contexts"
import { useDispatch, useSelector } from "react-redux"
import { editTask, selectTaskData } from "../../../features/boards/boardsSlice"
import { nanoid } from "nanoid"
import Dialog from "../../UI/Dialog/Dialog"
import useGridSubtasksPattern from "../../../custom hooks/useGridSubtasksPattern"

function DialogEditTask({ isOpen, onClose }) {
  const [subtasks, setSubtasks]   = useState([])
  const [moveFocusTo, setMoveFocusTo] = useState(null)
  const [columnName, setColumnName] = useState("")
  const [deletedSubtaskIndex, setDeletedSubtaskIndex] = useState(null)

  const refGrid = useRef(null)
  const refForm = useRef(null)

  const idOfSelectedTask = useContext(SelectedTaskIdContext)
  const taskData = useSelector((state) => selectTaskData(state, idOfSelectedTask))
  const dispatch = useDispatch()



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

    setMoveFocusTo(null)
  }



  function handleNewSubtaskClick() {
    setSubtasks([...subtasks, { id: nanoid(), title: "" }])
    setMoveFocusTo("textbox")
  }



  function handleDeleteClick(id, i) {
    setSubtasks(subtasks.filter(st => st.id !== id))
    setMoveFocusTo("button")
    setDeletedSubtaskIndex(i)
  }


  
  useEffect(() => {
    setSubtasks([...taskData.subtasks])
  }, [taskData])



  useEffect(() => {
    const col = taskData.columns.find(column => column.id === taskData.columnId)
    if (col) setColumnName(col.name)
  }, [taskData])



  // When a subtask is created, it becomes focused.
  // when a subtask is deleted, focus moves to the adjacent delete button.
  useEffect(() => {
    if (moveFocusTo) {
      const form = refForm.current
      
      if (moveFocusTo === "textbox") {
        const subtasksTextboxes = [...form.querySelectorAll("[name='subtask']")]
        subtasksTextboxes.at(-1).focus()
      }
      else if (moveFocusTo === "button") {
        const buttonsRemoveSubtask = [...form.querySelectorAll(".button-remove")]
        const buttonAddSubtask = form.querySelector(".button-add")

        if (deletedSubtaskIndex !== 0) buttonsRemoveSubtask[deletedSubtaskIndex - 1].focus()
        else {
          if (subtasks.length > 0) buttonsRemoveSubtask[0].focus()
          else buttonAddSubtask.focus()
        }
      }
    }
  }, [subtasks, moveFocusTo, deletedSubtaskIndex])



  useGridSubtasksPattern(refGrid, subtasks)

  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal"
      closedby="any"
      onClose={onClose}>
      <div className="title">Edit Task</div>
      <form ref={refForm} method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Title</span>
          <input
            className="textbox full"
            name="title"
            required
            pattern="^(?=.*\S).+$"
            maxLength={80}
            type="text"
            defaultValue={taskData.title}
            autoComplete="off" />
        </label>
        <label className="field">
          <span className="label">Description</span>
          <textarea
            className="textbox multiline full"
            name="description"
            pattern="^(?=.*\S).+$"
            maxLength={300}
            defaultValue={taskData.description}
            autoComplete="off" />
        </label>
        <fieldset className="field">
          <legend className="label">Subtasks</legend>
          <div
            ref={refGrid}
            className="container-grid"
            role="grid"
            aria-label="Subtasks">
            {subtasks.map((subtask, i) => (
              <div className="container-row" key={subtask.id} role="row">
                <span
                  className="cell-subtask"
                  role="gridcell"
                  data-grid-focusable="true">
                  <input
                    className="textbox flex"
                    name="subtask"
                    required
                    pattern="^(?=.*\S).+$"
                    maxLength={80}
                    type="text"
                    defaultValue={subtask.title}
                    autoComplete="off"
                    tabIndex="-1"
                    aria-label={`Subtask ${i + 1}`} />
                </span>
                <span role="gridcell">
                  <button
                    className="button-remove"
                    type="button"
                    aria-label={`Remove Subtask ${i + 1}`}
                    data-grid-focusable="true"
                    onClick={() => handleDeleteClick(subtask.id, i)} />
                </span>
              </div>
            ))}
          </div>
          <button
            className="button-add"
            type="button"
            onClick={handleNewSubtaskClick}>
            Add New Subtask
          </button>
        </fieldset>
        <label className="field">
        </label>
        <label className="field">
          <span className="label">Status</span>
          <select
            className="dropdown drop-down"
            name="column"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}>
            {taskData.columns.map(column => (
              <option
                key={column.id}
                value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button-submit"
          type="submit">
          Save Changes
        </button>
      </form>
    </Dialog>
  )
}

export default DialogEditTask