import { useEffect } from "react"

function useGridTasksPattern(refGrid) {
  useEffect(() => {
    const grid = refGrid.current
    const handledKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]
        
    function handleKeyDown(e) {
      const key = e.code
      if (!handledKeys.includes(key)) return
      
      e.preventDefault()
      e.stopPropagation()
      
      const items = [...grid.querySelectorAll("[role='gridcell'] button")]
      const currentItem = document.activeElement
      const firstItem = items[0]
      const lastItem = items.at(-1)
      
      let previousItem, nextItem

      if (key === "ArrowLeft" || key === "ArrowUp") previousItem = items[items.indexOf(currentItem) - 1]
      if (key === "Home") previousItem = firstItem

      if (key === "ArrowRight" || key === "ArrowDown") nextItem = items[items.indexOf(currentItem) + 1]
      if (key === "End") nextItem = lastItem
      
      switch (key) {
        case "ArrowLeft":
        case "ArrowUp":
        case "Home":
          moveGridFocus(currentItem, previousItem)  
          break

        case "ArrowRight":
        case "ArrowDown":
        case "End":
          moveGridFocus(currentItem, nextItem)
      }
    }

    grid.addEventListener("keydown", handleKeyDown)
    return () => grid.removeEventListener("keydown", handleKeyDown)
  }, [refGrid])  
}

function moveGridFocus(fromItem, toItem) {
  if (!toItem) return
  if (fromItem) fromItem.setAttribute("tabindex", "-1")
  toItem.setAttribute("tabindex", "0");
  toItem.focus()
  toItem.scrollIntoView({ block: "nearest" })
}

export default useGridTasksPattern