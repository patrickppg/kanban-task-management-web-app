import { useEffect, useRef } from "react"
import useGridTasksPattern from "../../../custom hooks/useGridTasksPattern"

function Column({ column, onViewTask }) {
  const refGrid = useRef(null)

  useEffect(() => {
    if (column) {
      [...refGrid.current.querySelectorAll("[role='gridcell'] button")].forEach((task, i) => {
        if (i === 0) {
          task.removeAttribute("tabindex")
          task.scrollIntoView()
        }
        else task.setAttribute("tabindex", "-1")
      })
    }
  }, [column])
  
  useGridTasksPattern(refGrid)
  
  return (
    <div ref={refGrid} className="column" role="grid" aria-label={`Tasks ${column.name}`} aria-description={`${column.tasks.length} tasks`}>
      <div aria-hidden="true" className="text-column-name">{`${column.name} (${column.tasks.length})`}</div>
      {column.tasks.map(task => (
        <div key={task.id} role="row">
          <div role="gridcell">
            <button className="button-view-task" aria-label={`View task "${task.title}"`} aria-description={`${task.numCompletedSubtasks} of ${task.numSubtasks} subtasks completed`} onClick={() => onViewTask(task.id)}>
              <span aria-hidden="true" className="text-task-title">{task.title}</span>
              <span aria-hidden="true" className="text-task-subtasks">{`${task.numCompletedSubtasks} of ${task.numSubtasks}`} subtasks</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Column