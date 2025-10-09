import { nanoid } from "nanoid"
import Dialog from "../../UI/Dialog/Dialog"
import { useDispatch } from "react-redux"
import { addColumn } from "../../../features/boards/boardsSlice"
import { useContext } from "react"
import { SelectedBoardIdContext } from "../../../contexts/contexts"

function DialogAddColumn({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const idOfSelectedBoard = useContext(SelectedBoardIdContext)
  
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
    <Dialog isOpen={isOpen} isModal={true} className="modal" closedby="any" aria-label="Add New Column" onClose={onClose}>
      <div aria-hidden="true" className="title">Add New Column</div>
      <form method="dialog" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Name</span>
          <input className="textbox full" name="name" required pattern="^(?=.*\S).+$" maxLength={15} type="text" autoComplete="off" />
        </label>
        <button className="button-submit">Create New Column</button>
      </form>
    </Dialog>
  )
}

export default DialogAddColumn