import { useContext } from "react"
import { SelectedBoardIdContext } from "../../../contexts/contexts"
import { useDispatch } from "react-redux"
import { addColumn } from "../../../features/boards/boardsSlice"
import { nanoid } from "nanoid"
import Dialog from "../../UI/Dialog/Dialog"

function DialogAddColumn({ isOpen, onClose }) {
  const idOfSelectedBoard = useContext(SelectedBoardIdContext)
  const dispatch = useDispatch()
  
  function handleSubmit(e) {
    dispatch(addColumn({
      id: nanoid(),
      boardId: idOfSelectedBoard,
      name: e.target.elements["name"].value,
      tasks: []
    }))
    e.target.reset()
  }
    
  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal"
      closedby="any"
      aria-label="Add New Column"
      onClose={onClose}>
      <div aria-hidden="true" className="title">Add New Column</div>
      <form method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Name</span>
          <input
            className="textbox full"
            name="name"
            required
            pattern="^(?=.*\S).+$"
            maxLength={15}
            type="text"
            autoComplete="off" />
        </label>
        <button
          className="button-submit">
          Create New Column
        </button>
      </form>
    </Dialog>
  )
}

export default DialogAddColumn