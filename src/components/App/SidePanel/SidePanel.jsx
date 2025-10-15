import { useContext, useEffect, useRef, useState } from "react"
import { SelectedBoardIdContext } from "../../../contexts/contexts"
import { useSelector } from "react-redux"
import { selectBoardOptions } from "../../../features/boards/boardsSlice"
import Dialog from "../../UI/Dialog/Dialog"
import useListBoxPattern from "../../../custom hooks/useListBoxPattern"
import "./SidePanel.css"

function SidePanel({ onSelectBoard, onCommandAddition }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [shouldFocusSidePanel, setShouldFocusSidePanel] = useState(false)

  const refBoardList = useRef(null)
  const refBtnCreate = useRef(null)
  const refBtnSelected = useRef(null)
  const refOldBoards = useRef([])

  const boards = useSelector(selectBoardOptions)
  const boardId = useContext(SelectedBoardIdContext)
  const numOfBoards = boards.length

  function handleBoardClick(e, id) {onSelectBoard(id)}
  function handleCreateClick() {onCommandAddition()}
  function handleThemeChange() {setIsDarkMode(!isDarkMode)}
  function handleHideClick() {setIsOpen(false)}
  function handleClose() {setIsOpen(false); setShouldFocusSidePanel(false)}



  // When the side panel opens, move focus to the selected board option;
  // otherwise, to the create board button.
  useEffect(() => {
    if (shouldFocusSidePanel) {
      if (refBtnSelected.current) refBtnSelected.current.focus()
      else refBtnCreate.current.focus()
    }
  }, [shouldFocusSidePanel])

  

  // Select the created board.
  // Also guarantee there is always a board selected.
  useEffect(() => {
    if (numOfBoards > refOldBoards.current.length) {
      const boardList = refBoardList.current
      const addedBoard = boardList.lastElementChild
      const selectedBoard = boardList.querySelector("[aria-selected='true']")
      const tabbableBoard = boardList.querySelector("[tabindex='0']")

      if (selectedBoard) selectedBoard.setAttribute("aria-selected", "false")
      addedBoard.setAttribute("aria-selected", "true")
      
      if (tabbableBoard) tabbableBoard.setAttribute("tabindex", "-1")
      addedBoard.setAttribute("tabindex", "0")
      
      refOldBoards.current = boards
    }
  }, [boards, numOfBoards])



  // When a board is removed, select the next board;
  // otherwise, the previous board.
  useEffect(() => {
    const oldBoards = refOldBoards.current

    if (numOfBoards < oldBoards.length) {
      const boardList = refBoardList.current
      const removedBoard = oldBoards.find(ob => !boards.some(b => b.id === ob.id))
      const removedIndex = oldBoards.indexOf(removedBoard)
      const targetId = oldBoards[removedIndex + 1]?.id || oldBoards[removedIndex - 1]?.id
      const previouBoardEl = boardList.children.item(removedIndex - 1)
      const nextBoardEl = boardList.children.item(removedIndex)
      const targetBoardEl = nextBoardEl || previouBoardEl

      if (targetBoardEl) {
        targetBoardEl.setAttribute("aria-selected", "true")
        targetBoardEl.setAttribute("tabindex", "0")
      }
      
      onSelectBoard(targetId || "")
      refOldBoards.current = boards
    }
  }, [boards, numOfBoards, onSelectBoard])



  useListBoxPattern(refBoardList)
 
  return (
    <div id="side_panel"> {/* role="region" aria-label="Side Panel" */}
      <button
        className="button-show-sidebar"
        hidden={isOpen}
        aria-label="Show Side Panel"
        onTransitionEnd={(e) => {if (!isOpen) e.target.focus()}}
        onClick={() => {setIsOpen(true); setShouldFocusSidePanel(true)}} />
      <Dialog
        isOpen={isOpen}
        inert={!isOpen}
        className="container-content"
        open
        closedby="closerequest"
        aria-label="Side Panel"
        onClose={handleClose}>
        <img className="image-logo" src="/images/logo-dark.svg" alt="" />
        <div className="container-all-boards">
          <div className="text-caption" aria-hidden="true">
            {`ALL BOARDS (${boards.length})`}
          </div>
          <div
            ref={refBoardList}
            className="select-board"
            role="listbox"
            aria-label="Board to display">
            {boards.map(board => (
              <div
                ref={board.id === boardId ? refBtnSelected : null}
                className="button-select-board"
                role="option"
                key={board.id}
                onClick={(e) => handleBoardClick(e, board.id)}>
                {board.name}
              </div>
            ))}
          </div>
          <button
            ref={refBtnCreate}
            className="button-create-board"
            onClick={handleCreateClick}>
            Create New Board
          </button>
        </div>
        <div className="switch">
          <span className="track">
            <span className="thumb" />
            <input
              className="control"
              type="checkbox"
              checked={isDarkMode}
              role="switch"
              aria-label="Dark Mode"
              aria-description="Switch between Light or Dark modes"
              onChange={handleThemeChange} />
          </span>
        </div>
        <button
          className="button-hide-sidebar"
          onClick={handleHideClick}>
          Hide Side Panel
        </button>
      </Dialog>
    </div>
  )
}

export default SidePanel