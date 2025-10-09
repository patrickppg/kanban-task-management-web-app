import { useContext, useEffect, useRef, useState } from "react"
import Dialog from "../../UI/Dialog/Dialog"
import Switch from "../../UI/Switch/Switch"
import "./SidePanel.css"
import { useSelector } from "react-redux"
import { selectBoardOptions } from "../../../features/boards/boardsSlice"
import { SelectedBoardIdContext } from "../../../contexts/contexts"

function SidePanel({ onSelectBoard, onCommandAddition }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isSwitchThemeOn, setIsSwitchThemeOn] = useState(false)
  const [shouldFocusSidePanel, setShouldFocusSidePanel] = useState(false)

  const boardOptions = useSelector(selectBoardOptions)
  const idOfSelectedBoard = useContext(SelectedBoardIdContext)

  function handleKeyDown(e) {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return

    e.stopPropagation()
    e.preventDefault()

    const options = [...e.currentTarget.querySelectorAll("[role='option']")]
    const currentOption = document.activeElement
    
    switch (e.key) {
      case "ArrowUp": {
        const previousOption = options[options.indexOf(currentOption) - 1]
        if (!previousOption) return

        currentOption.setAttribute("tabindex", "-1")
        previousOption.setAttribute("tabindex", "0")
        previousOption.focus()
        break
      }
      case "ArrowDown": {
        const nextOption = options[options.indexOf(currentOption) + 1]
        if (!nextOption) return
        
        currentOption.setAttribute("tabindex", "-1")
        nextOption.setAttribute("tabindex", "0")
        nextOption.focus()
        break
      }

      case "Home": {
        currentOption.setAttribute("tabindex", "-1")
        options[0].setAttribute("tabindex", "0")
        options[0].focus()
        break
      }

      case "End": {
        currentOption.setAttribute("tabindex", "-1")
        options.at(-1).setAttribute("tabindex", "0")
        options.at(-1).focus()
        break
      }
    }
  }

  function handleBlur(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return

    e.currentTarget.querySelector("[tabindex='0']").setAttribute("tabindex", "-1")
    e.currentTarget.querySelector("[aria-selected='true']").setAttribute("tabindex", "0")
  }
  
  const refButtonCreateBoard = useRef(null)
  const refButtonBoardSelected = useRef(null)

  useEffect(() => {
    if (shouldFocusSidePanel) {
      setTimeout(() => {
        if (refButtonBoardSelected.current) refButtonBoardSelected.current.focus()
        else refButtonCreateBoard.current.focus()
      }, 100);
    }
  }, [shouldFocusSidePanel])
  
  return (
    <div id="side_panel"> {/* role="region" aria-label="Side Panel" */}
      <button className="button-show-sidebar" hidden={isOpen} aria-label="Show Side Panel" onTransitionEnd={(e) => {if (!isOpen) e.target.focus()}} onClick={() => { setIsOpen(true); setShouldFocusSidePanel(true)}}>
        <svg aria-hidden="true" width="16" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z" fill="currentcolor"/></svg>
      </button>
      <Dialog isOpen={isOpen} className="container-content" open closedby="closerequest" aria-label="Side Panel" onClose={() => { setIsOpen(false); setShouldFocusSidePanel(false)}}>
        <img className="image-logo" src="/images/logo-dark.svg" alt="" />
        <div className="container-all-boards">
          <div className="text-caption" aria-hidden="true">{`ALL BOARDS (${boardOptions.length})`}</div>
          {boardOptions.length > 0 && (
            <div className="select-board" role="listbox" aria-label="Show Board" onKeyDown={handleKeyDown} onBlur={handleBlur}>
              {boardOptions.map(board => (
                <button ref={board.id === idOfSelectedBoard ? refButtonBoardSelected : null} className={`button-select-board ${board.id === idOfSelectedBoard && "selected"}`} role="option" key={board.id} aria-selected={board.id === idOfSelectedBoard ? "true" : "false"} tabIndex={board.id === idOfSelectedBoard ? "0" : "-1"} onClick={() => onSelectBoard(board.id)}>
                  <svg aria-hidden="true" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" fill="currentcolor"/></svg>
                  {board.name}
                </button>
              ))}
            </div>
          )}
          <button ref={refButtonCreateBoard} className="button-create-board" onClick={() => onCommandAddition()}>
            <svg aria-hidden="true" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" fill="currentcolor"/></svg>
            Create New Board
          </button>
        </div>
        <div>
          <div>
            <div className="container-switch">
              <svg aria-hidden="true" width="19" height="19" xmlns="http://www.w3.org/2000/svg"><path d="M9.167 15.833a.833.833 0 0 1 .833.834v.833a.833.833 0 0 1-1.667 0v-.833a.833.833 0 0 1 .834-.834ZM3.75 13.75a.833.833 0 0 1 .59 1.422l-1.25 1.25a.833.833 0 0 1-1.18-1.178l1.25-1.25a.833.833 0 0 1 .59-.244Zm10.833 0c.221 0 .433.088.59.244l1.25 1.25a.833.833 0 0 1-1.179 1.178l-1.25-1.25a.833.833 0 0 1 .59-1.422ZM9.167 5a4.167 4.167 0 1 1 0 8.334 4.167 4.167 0 0 1 0-8.334Zm-7.5 3.333a.833.833 0 0 1 0 1.667H.833a.833.833 0 1 1 0-1.667h.834Zm15.833 0a.833.833 0 0 1 0 1.667h-.833a.833.833 0 0 1 0-1.667h.833Zm-1.667-6.666a.833.833 0 0 1 .59 1.422l-1.25 1.25a.833.833 0 1 1-1.179-1.178l1.25-1.25a.833.833 0 0 1 .59-.244Zm-13.333 0c.221 0 .433.088.59.244l1.25 1.25a.833.833 0 0 1-1.18 1.178L1.91 3.09a.833.833 0 0 1 .59-1.422ZM9.167 0A.833.833 0 0 1 10 .833v.834a.833.833 0 1 1-1.667 0V.833A.833.833 0 0 1 9.167 0Z" fill="currentcolor"/></svg>
              <Switch isOn={isSwitchThemeOn} className="switch" controlClassName="control" thumbClassName="thumb" trackClassName="track" aria-label="Dark Mode" aria-description="Switch between Light or Dark modes" onSwitch={() => setIsSwitchThemeOn(!isSwitchThemeOn)} />
              <svg aria-hidden="true" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M6.474.682c.434-.11.718.406.481.78A6.067 6.067 0 0 0 6.01 4.72c0 3.418 2.827 6.187 6.314 6.187.89.002 1.77-.182 2.584-.54.408-.18.894.165.724.57-1.16 2.775-3.944 4.73-7.194 4.73-4.292 0-7.771-3.41-7.771-7.615 0-3.541 2.466-6.518 5.807-7.37Zm8.433.07c.442-.294.969.232.674.674l-.525.787a1.943 1.943 0 0 0 0 2.157l.525.788c.295.441-.232.968-.674.673l-.787-.525a1.943 1.943 0 0 0-2.157 0l-.786.525c-.442.295-.97-.232-.675-.673l.525-.788a1.943 1.943 0 0 0 0-2.157l-.525-.787c-.295-.442.232-.968.674-.673l.787.525a1.943 1.943 0 0 0 2.157 0Z" fill="currentcolor"/></svg>
            </div>
            <button className="button-hide-sidebar" onClick={() => setIsOpen(false)}>
              <svg aria-hidden="true" width="18" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M8.522 11.223a4.252 4.252 0 0 1-3.654-5.22l3.654 5.22ZM9 12.25A8.685 8.685 0 0 1 1.5 8a8.612 8.612 0 0 1 2.76-2.864l-.86-1.23A10.112 10.112 0 0 0 .208 7.238a1.5 1.5 0 0 0 0 1.524A10.187 10.187 0 0 0 9 13.75c.414 0 .828-.025 1.239-.074l-1-1.43A8.88 8.88 0 0 1 9 12.25Zm8.792-3.488a10.14 10.14 0 0 1-4.486 4.046l1.504 2.148a.375.375 0 0 1-.092.523l-.648.453a.375.375 0 0 1-.523-.092L3.19 1.044A.375.375 0 0 1 3.282.52L3.93.068a.375.375 0 0 1 .523.092l1.735 2.479A10.308 10.308 0 0 1 9 2.25c3.746 0 7.031 2 8.792 4.988a1.5 1.5 0 0 1 0 1.524ZM16.5 8a8.674 8.674 0 0 0-6.755-4.219A1.75 1.75 0 1 0 12.75 5v-.001a4.25 4.25 0 0 1-1.154 5.366l.834 1.192A8.641 8.641 0 0 0 16.5 8Z" fill="currentcolor"/></svg>
              Hide Side Panel
            </button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}

export default SidePanel