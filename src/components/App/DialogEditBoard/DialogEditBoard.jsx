import { useContext, useEffect, useRef, useState } from "react"
import { editBoard, selectEditBoardData } from "../../../features/boards/boardsSlice"
import { SelectedBoardIdContext } from "../../../contexts/contexts"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "nanoid"
import Dialog from "../../UI/Dialog/Dialog"
import useGridPattern from "../../../custom hooks/useGridPattern"

function DialogEditBoard({ isOpen, onClose }) {
  const [name, setName] = useState("")
  const [columns, setColumns] = useState([])
  const [moveFocusTo, setMoveFocusTo] = useState(null)
  const [deletedColumnIndex, setDeletedColumnIndex] = useState(null)

  const refGrid = useRef(null)
  const refForm = useRef(null)

  const idOfSelectedBoard = useContext(SelectedBoardIdContext)
  const boardData = useSelector((state) => selectEditBoardData(state, idOfSelectedBoard))
  const dispatch = useDispatch()



  function handleAddColumnClick() {
    setColumns([...columns, { id: nanoid(), title: "" }])
    setMoveFocusTo("textbox")
  }



  function handleDeleteColumnClick(id, i) {
    setColumns(columns.filter(column => column.id !== id))
    setMoveFocusTo("button")
    setDeletedColumnIndex(i)
  }



  function handleSubmit(e) {
    const formData = new FormData(e.target)

    e.target.reset()

    dispatch(editBoard({
      id: idOfSelectedBoard,
      name: formData.get("name"),
      columns: columns.map((column, index) => ({
        id: column.id,
        name: formData.getAll("column")[index],
      }))
    }))
    setColumns([])
    setMoveFocusTo(null)
  }
  


  useEffect(() => {
    setColumns([...(boardData.columns || [] )])
  }, [boardData])



  useEffect(() => {
    setName(boardData.name ?? "")
  }, [boardData])



  // When a column is created, it becomes focused.
  // when a column is deleted, focus moves to the adjacent delete button.
  useEffect(() => {
    if (isOpen) {
      if (moveFocusTo) {
        const form = refForm.current
        
        if (moveFocusTo === "textbox") {
          const columnsTextboxes = [...form.querySelectorAll("[name='column']")]
          columnsTextboxes.at(-1).focus()
        }
        else if (moveFocusTo === "button") {
          const buttonsRemoveColumn = [...form.querySelectorAll(".button-remove")]
          const buttonAddColumn = form.querySelector(".button-add")

          if (deletedColumnIndex !== 0) buttonsRemoveColumn[deletedColumnIndex - 1].focus()
          else {
            if (columns.length > 0) buttonsRemoveColumn[0].focus()
            else buttonAddColumn.focus()
          }
        }
      }      
    }
  }, [isOpen, columns, moveFocusTo, deletedColumnIndex])


  
  useGridPattern(refGrid, columns)

  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal"
      closedby="any"
      aria-label="Edit Board"
      onClose={() => {onClose(); setMoveFocusTo(null)}}>
      <div aria-hidden="true" className="title">Edit Board</div>
      <form ref={refForm} id="form_edit_board" method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Name</span>
          <input
            className="textbox full"
            name="name"
            required
            pattern="^(?=.*\S).+$"
            maxLength={20}
            type="text"
            value={name}
            autoComplete="off"
            onChange={(e) => {setName(e.target.value)}} />
        </label>
        <fieldset className="field">
          <legend className="label">Columns</legend>
          <div
            ref={refGrid}
            className="container-grid"
            role="grid"
            aria-label="Columns">
            {columns.map((column, i) => (
              <div className="container-row" key={column.id} role="row">
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
                    defaultValue={column.name}
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
                    onClick={() => handleDeleteColumnClick(column.id, i)} />
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
          Save Changes
        </button>
      </form>
    </Dialog>
  )

}

export default DialogEditBoard