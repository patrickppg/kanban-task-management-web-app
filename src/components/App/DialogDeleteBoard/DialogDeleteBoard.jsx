import { useDispatch, useSelector } from "react-redux"
import Dialog from "../../UI/Dialog/Dialog"
import { deleteBoard, selectBoardName, selectFirstBoardId } from "../../../features/boards/boardsSlice"
import { useContext } from "react"
import { SelectedBoardIdContext } from "../../../contexts/contexts"

function DialogDeleteBoard({ isOpen, onCancel, onDelete, onClose }) {
  const idOfSelectedBoard = useContext(SelectedBoardIdContext)
  const boardName = useSelector((state) => selectBoardName(state, idOfSelectedBoard))
  const firstBoardId = useSelector(selectFirstBoardId)
  const dispatch = useDispatch()
  
  return (
    <Dialog isOpen={isOpen} isModal={true} className="modal" closedby="any" role="alertdialog" aria-label="Confirmation" aria-describedby="container_delete_board_message" onClose={onClose}>
      <div id="container_delete_board_message">
        <p className="title destructive">Delete this board?</p>
        <p className="text-confirm">Are you sure you want to delete the '{boardName}' board? This action will remove all columns and tasks and cannot be reversed.</p>
      </div>
      <div className="container-buttons">
        <button className="button-cancel" onClick={() => onCancel()}>Cancel</button>
        <button className="button-delete" onClick={() => {onDelete(firstBoardId); dispatch(deleteBoard(idOfSelectedBoard))}}>Delete</button>
      </div>
    </Dialog>
  )
}

export default DialogDeleteBoard