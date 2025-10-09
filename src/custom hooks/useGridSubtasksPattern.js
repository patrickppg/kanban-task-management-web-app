import { useEffect } from "react"

function useGridSubtasksPattern(refGrid, subtaskIds) {
  useEffect(() => {
    const gridEl = refGrid.current
    const gridFocusableEls = [...gridEl.querySelectorAll("[data-grid-focusable='true']")]

    if (document.activeElement.name === "subtask") {
      const parent = document.activeElement.closest("[role='gridcell']")
      parent.setAttribute("tabindex", "0")
      gridFocusableEls.forEach(el => {if (el !== parent) el.setAttribute("tabindex", "-1")})
    }
    else {
      gridFocusableEls.forEach((el, i) => {
        if (gridFocusableEls.includes(document.activeElement)) document.activeElement.setAttribute("tabindex", "0")
        else if (i !== 0) el.setAttribute("tabindex", "-1")
        else el.setAttribute("tabindex", "0")
      })
    }

    function handleKeyDown(e) {
      const handledKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "Enter", "Escape"]
      if (!handledKeys.includes(e.code)) return

      e.stopPropagation()

      const currentItem = document.activeElement
      const numberOfRows = gridEl.querySelectorAll("[role='row']").length
      const gridWidth = gridFocusableEls.length / numberOfRows
      let isGridNavigable = document.activeElement.getAttribute("data-grid-focusable")
     
      switch (e.code) {
        case "Enter": {
          if (!isGridNavigable || e.target.role !== "gridcell") return
          e.preventDefault()
          e.target.querySelector("input[name='subtask']").focus()
          break
        }

        case "Escape": {
          if (isGridNavigable) return
          e.preventDefault()
          e.target.closest("[role='gridcell']").focus()
          break
        }
        
        case "ArrowRight": {
          if (!isGridNavigable) return
          e.preventDefault()
          const nextItem = gridFocusableEls[gridFocusableEls.indexOf(currentItem) + 1]
          if (!nextItem) return
          currentItem.setAttribute("tabindex", "-1")
          nextItem.focus()
          document.activeElement.setAttribute("tabindex", "0")
          break
        }

        case "ArrowLeft": {
          if (!isGridNavigable) return
          e.preventDefault()
          const previousItem = gridFocusableEls[gridFocusableEls.indexOf(currentItem) - 1]
          if (!previousItem) return
          currentItem.setAttribute("tabindex", "-1")
          previousItem.focus()
          document.activeElement.setAttribute("tabindex", "0")          
          break
        }

        case "ArrowDown": {
          if (!isGridNavigable) return
          e.preventDefault()
          const nextItem = gridFocusableEls[gridFocusableEls.indexOf(currentItem) + gridWidth]
          if (!nextItem) return
          currentItem.setAttribute("tabindex", "-1")
          nextItem.focus()
          document.activeElement.setAttribute("tabindex", "0")          
          break
        }

        case "ArrowUp": {
          if (!isGridNavigable) return
          e.preventDefault()
          const previousItem = gridFocusableEls[gridFocusableEls.indexOf(currentItem) - gridWidth]
          if (!previousItem) return
          currentItem.setAttribute("tabindex", "-1")
          previousItem.focus()
          document.activeElement.setAttribute("tabindex", "0")          
          break
        }

        case "Home": {
          if (!isGridNavigable) return
          e.preventDefault()
          currentItem.setAttribute("tabindex", "-1")
          gridFocusableEls[0].focus()
          document.activeElement.setAttribute("tabindex", "0")          
          break
        }

        case "End": {
          if (!isGridNavigable) return
          e.preventDefault()
          currentItem.setAttribute("tabindex", "-1")
          gridFocusableEls.at(-1).focus()
          document.activeElement.setAttribute("tabindex", "0")          
          break
        }
      }
    }
    
    gridEl.addEventListener("keydown", handleKeyDown)

    return () => {
      gridEl.removeEventListener("keydown", handleKeyDown)
    }
  }, [refGrid, subtaskIds])
}

export default useGridSubtasksPattern