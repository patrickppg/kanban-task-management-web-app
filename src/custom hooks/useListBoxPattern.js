import { useEffect } from "react"

function useListBoxPattern(refComposite) {
  useEffect(() => {
    const composite = refComposite.current
    const navigables = [...composite.querySelectorAll("[role='option']")]
    const handledKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Space", "Enter"]

    navigables.forEach((navigable, i) => {
      navigable.setAttribute("tabindex", "-1")
      if (i === 0) navigable.setAttribute("autofocus", "")
    })

    composite.addEventListener("click", handleClick)
    composite.addEventListener("focusout", handleFocusOut)
    composite.addEventListener("keydown", handleKeyDown)

    function handleClick(e) {
      if (navigables.includes(e.target)) composite.hidePopover()
    }
  
    function handleFocusOut(e) {
      if (!navigables.includes(e.relatedTarget)) composite.hidePopover()
    }

    function handleKeyDown(e) {
      const key = e.code
      if (!handledKeys.includes(key)) return

      e.preventDefault()

      const current = document.activeElement
      const first = e.target.querySelector("[role='option']")
      const last = e.target.lastElementChild
      const previous = current.previousElementSibling
      const next = current.nextElementSibling
      let toFocus

      switch (key) {
        case "ArrowUp": toFocus = previous; break
        case "ArrowDown": toFocus = next; break
        case "Home": toFocus = first; break
        case "End": toFocus = last; break
        case "Space":
        case "Enter": current.click()
      }

      if (toFocus) toFocus.focus()
    }

    return () => {
      composite.removeEventListener("click", handleClick)
      composite.removeEventListener("focusout", handleFocusOut)
      composite.removeEventListener("keydown", handleKeyDown)
    }
  }, [refComposite])
}

export default useListBoxPattern