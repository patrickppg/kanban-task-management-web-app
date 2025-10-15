import { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SelectedBoardIdContext } from "../../../contexts/contexts"
import { deleteBoard, selectBoardName } from "../../../features/boards/boardsSlice"
import Dialog from "../../UI/Dialog/Dialog"

function DialogDeleteBoard({ isOpen, onCancel, onDelete, onClose }) {
  const boardId = useContext(SelectedBoardIdContext)
  const boardName = useSelector((state) => selectBoardName(state, boardId))
  const dispatch = useDispatch()
  
  return (
    <Dialog isOpen={isOpen} isModal={true} className="modal" closedby="any" role="alertdialog" aria-label="Confirmation" aria-describedby="container_delete_board_message" onClose={onClose}>
      <div id="container_delete_board_message">
        <p className="title destructive">Delete this board?</p>
        <p className="text-confirm">Are you sure you want to delete the '{boardName}' board? This action will remove all columns and tasks and cannot be reversed.</p>
      </div>
      <div className="container-buttons">
        <button className="button-cancel" onClick={() => onCancel()}>Cancel</button>
        <button className="button-delete" onClick={() => {dispatch(deleteBoard(boardId)); onDelete()}}>Delete</button>
      </div>
    </Dialog>
  )
}

export default DialogDeleteBoard