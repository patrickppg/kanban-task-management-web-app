import { nanoid } from "nanoid"
import { useEffect, useRef, useState } from "react"
import Dialog from "../../UI/Dialog/Dialog"
import useGridPattern from "../../../custom hooks/useGridPattern"
import { useDispatch } from "react-redux"
import { addBoard } from "../../../features/boards/boardsSlice"

function DialogAddBoard({ isOpen, onAdd, onClose }) {
  const [columnIds, setColumnIds] = useState([])
  const [moveFocusTo, setMoveFocusTo] = useState(null)
  const [deletedColumnIndex, setDeletedColumnIndex] = useState(null)

  const dispatch = useDispatch()

  const refGrid = useRef(null)

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

  useEffect(() => {
    if (moveFocusTo) {
      if (moveFocusTo === "textbox") {
        const columnsTextboxes = [...document.querySelector("#form_Add_Board").querySelectorAll("[name='column']")]
        columnsTextboxes.at(-1).focus()
      }
      else if (moveFocusTo === "button") {
        const buttonsRemoveColumn = [...document.querySelector("#form_Add_Board").querySelectorAll(".button-remove")]
        const buttonAddColumn = document.querySelector("#form_Add_Board").querySelector(".button-add")

        if (deletedColumnIndex !== 0) buttonsRemoveColumn[deletedColumnIndex - 1].focus()
        else {
          if (columnIds.length > 0) buttonsRemoveColumn[0].focus()
          else buttonAddColumn.focus()
        }
      }
    }
  }, [columnIds, moveFocusTo, deletedColumnIndex])

  useGridPattern(refGrid, columnIds)
      
  return (
    <Dialog isOpen={isOpen} isModal={true} className="modal" closedby="any" aria-label="Add New Board" onClose={onClose}>
      <div aria-hidden="true" className="title">Add New Board</div>
      <form id="form_Add_Board" method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Name</span>
          <input className="textbox full" name="name" type="text" required pattern="^(?=.*\S).+$" maxLength={20} autoComplete="off" />
        </label>
        <fieldset className="field">
          <legend className="label">Columns</legend>
          <div ref={refGrid} className="container-grid" role="grid" aria-label="Columns">
            {columnIds.map((columnId, i) => (
              <div className="container-row" key={columnId} role="row">
                <span className="cell-column" role="gridcell" data-grid-focusable="true">
                  <input className="textbox flex" name="column" required pattern="^(?=.*\S).+$" maxLength={15} type="text" autoComplete="off" tabIndex="-1" aria-label={`Column ${i + 1}`} />
                </span>
                <span role="gridcell">
                  <button className="button-remove" type="button" aria-label={`Remove Column ${i + 1}`} data-grid-focusable="true" onClick={() => handleDeleteColumnClick(columnId, i)}>
                    <svg aria-hidden="true" width="15" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z"/><path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z"/></g></svg>                
                  </button>
                </span>
              </div>
            ))}
          </div>
          <button className="button-add" type="button" onClick={handleAddColumnClick}>
            Add New Column
          </button>
        </fieldset>
        <button className="button-submit" type="submit">Create New Board</button>
      </form>
    </Dialog>
  )
}

export default DialogAddBoard