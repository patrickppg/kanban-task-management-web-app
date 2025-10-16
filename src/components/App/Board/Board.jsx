import { useContext, useRef } from "react"
import { useSelector } from "react-redux"
import { selectBoardData } from "../../../features/boards/boardsSlice"
import { SelectedBoardIdContext } from "../../../contexts/contexts"
import Column from "../Column/Column"
import useMenuPattern from "../../../custom hooks/useMenuPattern"
import "./Board.css"

function Board({ onCommandEdition, onCommandDeletion, onAddTask, onViewTask, onAddColumn }) {
  const refBoardMenu = useRef(null)
  
  const boardId = useContext(SelectedBoardIdContext)
  const selectedBoardData = useSelector((state) => selectBoardData(state, boardId))
  const isBoardMissing = !selectedBoardData.name
  const isBoardEmpty = selectedBoardData.name && !selectedBoardData.columns.length
  const isAddDisabled = !selectedBoardData.columns.length
  const isContainerEmptyHidden = isBoardMissing || !isBoardEmpty
  const isContainerContentHidden = isBoardMissing || isBoardEmpty

  function handleFocus(e) {
    e.target.scrollIntoView({ block: "nearest", inline: "nearest" })
  }

  useMenuPattern(refBoardMenu)

  return (
    <div
      className="container-board"
      role="group"
      aria-roledescription="Board"
      aria-label={selectedBoardData.name ? selectedBoardData.name : null}>
      <div id="topbar">
        <img className="image-logo" src="/images/logo-dark.svg" alt="" />
        <div className="text-board-name" aria-hidden="true">
          {selectedBoardData.name}
        </div>
        <div className="container-buttons">
          <button
            className="button-add-task"
            disabled={isAddDisabled}
            onClick={onAddTask}>
            Add New Task
          </button>
          <button
            className="button-menu"
            disabled={isBoardMissing}
            aria-label="Open Board Menu" />
          <menu
            ref={refBoardMenu}
            className="popup-menu"
            role="menu"
            aria-label="Board Actions">
            <li
              className="menu-item"
              role="menuitem"
              onClick={() => onCommandEdition()}>
              Edit Board
            </li>
            <li
              className="menu-item destructive"
              role="menuitem"
              onClick={() => onCommandDeletion()}>
              Delete Board
            </li>
          </menu>
        </div>
      </div>
      <div id="board" onFocus={handleFocus}>
        <div className="container-empty-board" hidden={isContainerEmptyHidden}>
          <p className="text-empty-board">
            This board is empty. Create a new column to get started.
          </p>
          <button
            className="button-add-column"
            onClick={() => onAddColumn()}>
            Add New Column
          </button>      
        </div>
        <div className="container-non-empty-board" hidden={isContainerContentHidden}>
          {selectedBoardData.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              onViewTask={(id) => onViewTask(id)} />
          ))}
          <button
            className="button-create-column"
            onClick={() => onAddColumn()}>
            New Column
          </button>
        </div>
      </div>
    </div>
  )
}

export default Board