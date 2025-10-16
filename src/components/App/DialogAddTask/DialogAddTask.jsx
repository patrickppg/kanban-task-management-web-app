import { useContext, useEffect, useRef, useState } from "react"
import { SelectedBoardIdContext } from "../../../contexts/contexts"
import { useDispatch, useSelector } from "react-redux"
import { addTask, selectColumnOptions } from "../../../features/boards/boardsSlice"
import { nanoid } from "nanoid"
import Dialog from "../../UI/Dialog/Dialog"
import useGridSubtasksPattern from "../../../custom hooks/useGridSubtasksPattern"

function DialogAddTask({ isOpen, onClose }) {
  const [subtaskIds, setSubtaskIds] = useState([])
  const [moveFocusTo, setMoveFocusTo] = useState(null)
  const [deletedSubtaskIndex, setDeletedSubtaskIndex] = useState(null)

  const refGrid = useRef(null)
  const refForm = useRef(null)
  
  const idOfSelectedBoard = useContext(SelectedBoardIdContext)
  const columnOptions = useSelector((state) => selectColumnOptions(state, idOfSelectedBoard))
  const dispatch = useDispatch()



  
  function handleSubmit(e) {
    const formData = new FormData(e.target)
    
    e.target.reset()

    dispatch(addTask({
      id: nanoid(),
      boardId: idOfSelectedBoard,
      columnId: columnOptions.find(option => option.name === formData.get("column")).id,
      title: formData.get("title"),
      description: formData.get("description"),
      subtasks: subtaskIds.map((subtaskId, i) => ({
        id: subtaskId,
        title: formData.getAll("subtask")[i],
        isCompleted: false
      }))
    }))
    setSubtaskIds([])
    setMoveFocusTo(null)
  }



  function handleAddSubtaskClick() {
    setSubtaskIds([...subtaskIds, nanoid()])
    setMoveFocusTo("textbox")
  }



  function handleDeletedSubtaskClick(subtaskId, i) {
    setSubtaskIds(subtaskIds.filter(id => id !== subtaskId))
    setMoveFocusTo("button")
    setDeletedSubtaskIndex(i)
  }



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
          if (subtaskIds.length > 0) buttonsRemoveSubtask[0].focus()
          else buttonAddSubtask.focus()
        }
      }
    }
  }, [subtaskIds, moveFocusTo, deletedSubtaskIndex])


  
  useGridSubtasksPattern(refGrid, subtaskIds)

  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal"
      closedby="any"
      onClose={onClose}
      aria-label="Add New Task">
      <div aria-hidden="true" className="title">Add New Task</div>
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
            autoComplete="off" />
        </label>
        <label className="field">
          <span className="label">Description</span>
          <textarea
            className="textbox multiline full"
            name="description"
            pattern="^(?=.*\S).+$"
            maxLength={300}
            autoComplete="off" />
        </label>
        <fieldset className="field">
          <legend className="label">Subtasks</legend>
          <div
            ref={refGrid}
            className="container-grid"
            role="grid"
            aria-label="Subtasks">
            {subtaskIds.map((subtaskId, i) => (
              <div className="container-row" key={subtaskId} role="row">
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
                    onClick={() => handleDeletedSubtaskClick(subtaskId, i)} />
                </span>
              </div>
            ))}
          </div>
          <button
            className="button-add"
            type="button"
            onClick={handleAddSubtaskClick}>
            Add New Subtask
          </button>
        </fieldset>
        <label className="field">
          <span className="label">Status</span>
          <select
            className="dropdown drop-down"
            name="column"
            defaultValue={columnOptions[0]?.name}>
            {columnOptions.map(column => (
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
          Create Task
        </button>
      </form>
    </Dialog>
  )
}

export default DialogAddTask