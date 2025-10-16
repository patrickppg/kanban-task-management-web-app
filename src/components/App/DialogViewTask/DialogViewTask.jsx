import { useContext, useEffect, useRef } from "react"
import { SelectedTaskIdContext } from "../../../contexts/contexts"
import { useDispatch, useSelector } from "react-redux"
import { moveTask, selectTaskData, toggleSubtask } from "../../../features/boards/boardsSlice"
import Dialog from "../../UI/Dialog/Dialog"
import useMenuPattern from "../../../custom hooks/useMenuPattern"
import useGridCheckSubtasksPattern from "../../../custom hooks/useGridCheckSubtasksPattern"

function DialogViewTask({ isOpen, onDelete, onEdit, onClose }) {
  const refGrid = useRef(null)
  const refMenu = useRef(null)
  const refSubtasks = useRef([])

  const taskId = useContext(SelectedTaskIdContext)
  const taskData = useSelector((state) => selectTaskData(state, taskId))
  const numSubtasks = taskData.subtasks.length
  const numCompletedSubtasks = taskData.subtasks.reduce((acc, subtask) => subtask.isCompleted ? ++acc : acc, 0)
  const selectValue = taskData.columns.find(column => column.id === taskData.columnId)?.name
  const dispatch = useDispatch()


  // When the dialog closes, make the first subtask checkbox the tabbable checkbox
  function handleClose() {
    refSubtasks.current.forEach((subtask, i) => {
      if (i === 0) subtask.removeAttribute("tabindex")
      else subtask.setAttribute("tabindex", "-1")
    })
    onClose()
  }



  function handleColumnChange(e) {
    dispatch(moveTask({
      id: taskId,
      columnId: taskData.columns.find(column => column.name === e.target.value).id }))
  }



  function handleSubtaskChange(e, id) {
    dispatch(toggleSubtask({
      id,
      isCompleted: e.target.checked
    }))
  }


  // When the dialog opens, make the first subtask checkbox the tabbable checkbox
  // and scroll it into view
  useEffect(() => {
    if (isOpen && numSubtasks) {
      refSubtasks.current.forEach((subtask, i) => {
        if (i === 0) {
          subtask.removeAttribute("tabindex")
          subtask.scrollIntoView()
        }
        else subtask.setAttribute("tabindex", "-1")
      })
    }
  }, [isOpen, numSubtasks])



  function setRefSubtasks(el, i) {
    refSubtasks.current[i] = el
    return () => {
      refSubtasks.current.filter((_, index) => index !== i)
    }
  }



  useGridCheckSubtasksPattern(refGrid)
  useMenuPattern(refMenu)
    
  return (
    <Dialog
      isOpen={isOpen}
      isModal={true}
      className="modal view-task"
      closedby="any"
      aria-label="Task Details"
      onClose={handleClose}>
      <div>
        <div className="container-title-menu">
          <button className="button-menu" aria-label="Open Task Menu" />
          <menu
            ref={refMenu}
            className="popup-menu"
            role="menu"
            aria-label="Task Actions">
            <li
              className="menu-item"
              role="menuitem"
              onClick={() => onEdit()}>
              Edit
            </li>
            <li
              className="menu-item destructive"
              role="menuitem"
              onClick={() => onDelete()}>
              Delete
            </li>
          </menu>
          <p className="text-title" aria-roledescription="Title">
            {taskData.title}
          </p>
        </div>
        <p className="text-description" aria-roledescription="Description">
          {taskData.description}
        </p>
      </div>
      <div
        ref={refGrid}
        className="field subtasks"
        role="grid"
        aria-labelledby="grid_check_subtasks_name"
        aria-describedby="grid_check_subtasks_description">
        <div className="label" role="caption">
          <span id="grid_check_subtasks_name">Subtasks</span>{" "}
          <span id="grid_check_subtasks_description">
            {`(${numCompletedSubtasks} of ${numSubtasks})`}
          </span>
        </div>
        <div className="container-grid-subtasks">
          {taskData.subtasks.map((subtask, i) => (
            <div role="row" key={subtask.id}>
              <div role="gridcell">
                <label className="container-checkbox">
                  <input
                    ref={(el) => setRefSubtasks(el, i)}
                    className="checkbox"
                    type="checkbox"
                    defaultChecked={subtask.isCompleted}
                    onChange={(e) => handleSubtaskChange(e, subtask.id)} />
                  <span className="check" aria-hidden="true" />
                  <span className="checkbox-label">{subtask.title}</span>
                </label> 
              </div>
            </div>
          ))}
        </div>
      </div>
      <label className="field">
        <span className="label">Status</span>
        <select
          className="dropdown drop-down"
          name="column"
          value={selectValue}
          onChange={e => handleColumnChange(e)}>
          {taskData.columns.map(column => (
            <option
              key={column.id}
              value={column.name}>
              {column.name}
            </option>
          ))}
        </select>
      </label>
    </Dialog>
  )
}

export default DialogViewTask