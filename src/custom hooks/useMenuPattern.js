import { useEffect } from "react"

function useMenuPattern(refComposite) {
  useEffect(() => {
    const composite = refComposite.current
    const invoker = composite.previousElementSibling
    const navigables = [...composite.querySelectorAll("[role='menuitem']")]
    const handledKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Space", "Enter"]

    invoker.popoverTargetElement = composite
    invoker.setAttribute("popovertargetaction", "show")
    invoker.setAttribute("aria-haspopup", "menu")
    composite.setAttribute("popover", "auto")
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
      const first = navigables[0]
      const last = navigables.at(-1)
      const previous = current === first ? last : navigables[navigables.indexOf(current) - 1]
      const next = current === last ? first : navigables[navigables.indexOf(current) + 1]
      let toFocus

      switch (key) {
        case "ArrowUp": toFocus = previous; break
        case "ArrowDown": toFocus = next; break
        case "Home":
        case "PageUp": toFocus = first; break
        case "End":
        case "PageDown": toFocus = last; break
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

export default useMenuPattern