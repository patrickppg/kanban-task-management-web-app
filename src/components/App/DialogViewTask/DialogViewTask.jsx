import { useContext, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import useGridCheckSubtasksPattern from "../../../custom hooks/useGridCheckSubtasksPattern"
import useMenuPattern from "../../../custom hooks/useMenuPattern"
import { moveTask, selectTaskData, toggleSubtask } from "../../../features/boards/boardsSlice"
import Dialog from "../../UI/Dialog/Dialog"
import { SelectedTaskIdContext } from "../../../contexts/contexts"

function DialogViewTask({ isOpen, onDelete, onEdit, onClose }) {
  const refGrid = useRef(null)
  const refMenu = useRef(null)
  const refSubtasks = useRef([])
  const idOfSelectedTask = useContext(SelectedTaskIdContext)
  const taskData = useSelector((state) => selectTaskData(state, idOfSelectedTask))
  const { subtasks = [] } = taskData
  const numSubtasks = subtasks.length
  const numCompletedSubtasks = subtasks.reduce((acc, subtask) => subtask.isCompleted ? ++acc : acc, 0)
  const dispatch = useDispatch()

  function handleClose() {
    if (subtasks) {
      refSubtasks.current.forEach((subtask, i) => {
        if (i === 0) {
          subtask.removeAttribute("tabindex")
        }
        else subtask.setAttribute("tabindex", "-1")
      })
    }
    onClose()
  }

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
    <Dialog isOpen={isOpen} isModal={true} className="modal view-task" closedby="any" aria-label="Task Details" onClose={handleClose}>
      <div>
        <div className="container-title-menu">
          <button className="button-menu" aria-label="Open Task Menu">
            <svg aria-hidden="true" width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g></svg>
          </button>
          <menu ref={refMenu} className="popup-menu" role="menu" aria-label="Task Actions">
            <li className="menu-item" role="menuitem" onClick={() => onEdit()}>Edit</li>
            <li className="menu-item destructive" role="menuitem" onClick={() => onDelete()}>Delete</li>
          </menu>
          <p className="text-title" aria-roledescription="Title">{taskData.title}</p>
        </div>
        <p className="text-description" aria-roledescription="Description">{taskData.description}</p>
      </div>
      <div ref={refGrid} className="field subtasks" role="grid" aria-labelledby="grid_check_subtasks_name" aria-describedby="grid_check_subtasks_description">
        <div className="label" role="caption">
          <span id="grid_check_subtasks_name">Subtasks</span>{" "}
          <span id="grid_check_subtasks_description">{`(${numCompletedSubtasks} of ${numSubtasks})`}</span>
        </div>
        <div className="container-grid-subtasks">
          {subtasks.map((subtask, i) => (
            <div role="row" key={subtask.id}>
              <div role="gridcell">
                <label className="container-checkbox">
                  <input ref={(el) => setRefSubtasks(el, i)} className="checkbox" type="checkbox" defaultChecked={subtask.isCompleted} onChange={(e) => dispatch(toggleSubtask(({ id: subtask.id, isCompleted: e.target.checked })))} />
                  <span className="check" aria-hidden="true"></span>
                  <span className="checkbox-label">{subtask.title}</span>
                </label> 
              </div>
            </div>
          ))}
        </div>
      </div>
      <label className="field">
        <span className="label">Status</span>
        <select className="dropdown drop-down" name="column" value={taskData.columns.find(column => column.id === taskData.columnId)?.name} onChange={(e) => dispatch(moveTask({ id: idOfSelectedTask, columnId: taskData.columns.find(column => column.name === e.target.value).id }))}>
          {taskData.columns.map(column => (
            <option key={column.id} value={column.name}>{column.name}</option>
          ))}
        </select>
      </label>
      
    </Dialog>
  )

}

export default DialogViewTask