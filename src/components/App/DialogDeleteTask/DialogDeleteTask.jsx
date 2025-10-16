import { useDispatch, useSelector } from "react-redux"
import Dialog from "../../UI/Dialog/Dialog"
import { deleteTask, selectTaskTitle } from "../../../features/boards/boardsSlice"
import { useContext } from "react"
import { SelectedTaskIdContext } from "../../../contexts/contexts"

function DialogDeleteTask({ isOpen, onDelete, onCancel, onClose }) {
  const idOfSelectedTask = useContext(SelectedTaskIdContext)
  const taskTitle = useSelector((state) => selectTaskTitle(state, idOfSelectedTask))
  const dispatch = useDispatch()
  
  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal"
      closedby="any"
      role="alertdialog"
      aria-label="Confirmation"
      aria-describedby="container_delete_task_message"
      onClose={onClose}>
      <div id="container_delete_task_message">
        <p className="title destructive">Delete this task?</p>
        <p className="text-confirm">
          Are you sure you want to delete the '{taskTitle}' task and its subtasks?
          This action cannot be reversed.
        </p>
      </div>
      <div className="container-buttons">
        <button
          className="button-cancel"
          onClick={() => onCancel()}>
          Cancel
        </button>
        <button
          className="button-delete"
          onClick={() => {onDelete(); dispatch(deleteTask(idOfSelectedTask))}}>
          Delete
        </button>
      </div>
    </Dialog>
  )

}

export default DialogDeleteTask