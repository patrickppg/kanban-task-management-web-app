import { useContext, useRef } from "react"
import useMenuPattern from "../../../custom hooks/useMenuPattern"
import Column from "../Column/Column"
import "./Board.css"
import { useSelector } from "react-redux"
import { selectBoardData } from "../../../features/boards/boardsSlice"
import { SelectedBoardIdContext } from "../../../contexts/contexts"

function Board({ onCommandEdition, onCommandDeletion, onAddTask, onViewTask, onAddColumn }) {
  const idOfSelectedBoard = useContext(SelectedBoardIdContext)
  const selectedBoardData = useSelector((state) => selectBoardData(state, idOfSelectedBoard))

  
  const refBoardMenu = useRef(null)
  const isBoardMissing = !selectedBoardData.name
  const isBoardEmpty = selectedBoardData.name && selectedBoardData.columns.length === 0

  function handleEditClick() {onCommandEdition()}
  function handleDeleteClick() {onCommandDeletion()}

  useMenuPattern(refBoardMenu)

  return (
    <div className="container-board" role="group" aria-roledescription="Board" aria-label={selectedBoardData.name ? selectedBoardData.name : null} aria-description={!isBoardMissing && isBoardEmpty ? "This board is empty. Create a new column to get started." : null}>
      <div id="topbar">
        <img className="image-logo" src="/images/logo-dark.svg" alt="" />
        <div className="text-board-name" aria-hidden="true">{selectedBoardData.name}</div>
        <div className="container-buttons">
          <button className="button-add-task" disabled={!selectedBoardData.columns?.length} onClick={onAddTask}>Add New Task</button>
          <button className="button-menu" disabled={isBoardMissing} aria-label="Open Board Menu">
            <svg aria-hidden="true" width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="currentcolor" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g></svg>
          </button>
          <menu ref={refBoardMenu} className="popup-menu" role="menu" aria-label="Board Actions">
            <li className="menu-item" role="menuitem" onClick={handleEditClick}>Edit Board</li>
            <li className="menu-item destructive" role="menuitem" onClick={handleDeleteClick}>Delete Board</li>
          </menu>
        </div>
      </div>
      <div id="board" onFocus={(e) => e.target.scrollIntoView({ block: "nearest", inline: "nearest" })}>
        <div className="container-empty-board" hidden={isBoardMissing || !isBoardEmpty}>
          <div aria-hidden="true" className="text-empty-board">This board is empty. Create a new column to get started.</div>
          <button className="button-add-column" onClick={() => onAddColumn()}>Add New Column</button>      
        </div>
        <div className="container-non-empty-board" hidden={isBoardMissing || isBoardEmpty}>
          {selectedBoardData.columns.map(column => (
            <Column key={column.id} column={column} onViewTask={(id) => onViewTask(id)} />
          ))}
          <button className="button-create-column" onClick={() => onAddColumn()}>
            <svg aria-hidden="true" width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path fill="currentcolor" d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"/></svg>
            New Column
          </button>
        </div>
      </div>
    </div>
  )
}

export default Board