import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { addBoard } from "../../../features/boards/boardsSlice"
import { nanoid } from "nanoid"
import Dialog from "../../UI/Dialog/Dialog"
import useGridPattern from "../../../custom hooks/useGridPattern"

function DialogAddBoard({ isOpen, onAdd, onClose }) {
  const [columnIds, setColumnIds] = useState([])
  const [moveFocusTo, setMoveFocusTo] = useState(null)
  const [deletedColumnIndex, setDeletedColumnIndex] = useState(null)
  
  const refGrid = useRef(null)
  const refForm = useRef(null)

  const dispatch = useDispatch()



  function handleSubmit(e) {
    const formData = new FormData(e.target)
    const id = nanoid()
    e.target.reset()
        
    dispatch(addBoard({
      id,
      name: formData.get("name"),
      columns: columnIds.map((columnId, i) => ({
        id: columnId,
        name: formData.getAll("column")[i],
        tasks: []
      }))
    }))

    onAdd(id)
    setColumnIds([])
    setMoveFocusTo(null)
  }



  function handleAddColumnClick() {
    setColumnIds([...columnIds, nanoid()])
    setMoveFocusTo("textbox")
  }



  function handleDeleteColumnClick(columnId, i) {
    setColumnIds(columnIds.filter(id => id !== columnId))
    setMoveFocusTo("button")
    setDeletedColumnIndex(i)
  }



  // When a column is created, it becomes focused.
  // when a column is deleted, focus moves to the adjacent delete button.
  useEffect(() => {
    if (moveFocusTo) {
      const form = refForm.current
      
      if (moveFocusTo === "textbox") {
        const textboxes = [...form.querySelectorAll("[name='column']")]
        textboxes.at(-1).focus()
      }
      else if (moveFocusTo === "button") {
        const buttons = [...form.querySelectorAll(".button-remove")]
        const buttonAddColumn = form.querySelector(".button-add")

        if (deletedColumnIndex !== 0) buttons[deletedColumnIndex - 1].focus()
        else {
          if (columnIds.length > 0) buttons[0].focus()
          else buttonAddColumn.focus()
        }
      }
    }
  }, [columnIds, moveFocusTo, deletedColumnIndex])


  
  useGridPattern(refGrid, columnIds)
      
  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal"
      closedby="any"
      aria-label="Add New Board"
      onClose={onClose}>
      <div aria-hidden="true" className="title">Add New Board</div>
      <form ref={refForm} method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Name</span>
          <input
            className="textbox full"
            name="name"
            type="text"
            required 
            pattern="^(?=.*\S).+$"
            maxLength={20}
            autoComplete="off" />
        </label>
        <fieldset className="field">
          <legend className="label">Columns</legend>
          <div
            ref={refGrid}
            className="container-grid"
            role="grid"
            aria-label="Columns">
            {columnIds.map((columnId, i) => (
              <div className="container-row" key={columnId} role="row">
                <span
                  className="cell-column"
                  role="gridcell"
                  data-grid-focusable="true">
                  <input
                    className="textbox flex"
                    name="column"
                    required
                    pattern="^(?=.*\S).+$"
                    maxLength={15}
                    type="text"
                    autoComplete="off"
                    tabIndex="-1"
                    aria-label={`Column ${i + 1}`} />
                </span>
                <span role="gridcell">
                  <button
                    className="button-remove"
                    type="button"
                    aria-label={`Remove Column ${i + 1}`}
                    data-grid-focusable="true"
                    onClick={() => handleDeleteColumnClick(columnId, i)} />
                </span>
              </div>
            ))}
          </div>
          <button
            className="button-add"
            type="button"
            onClick={handleAddColumnClick}>
            Add New Column
          </button>
        </fieldset>
        <button
          className="button-submit"
          type="submit">
          Create New Board
        </button>
      </form>
    </Dialog>
  )
}

export default DialogAddBoard