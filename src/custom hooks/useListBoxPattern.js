import { useEffect } from "react"

export default function useListBoxPattern(refComposite) {
  useEffect(() => {
    const composite = refComposite.current

    observerListbox.observe(composite, { childList: true })

    composite.addEventListener("click", handleClick)
    composite.addEventListener("focusin", handleFocusIn)
    composite.addEventListener("focusout", handleFocusOut)
    composite.addEventListener("keydown", handleKeyDown)

    return () => {
      composite.removeEventListener("click", handleClick)
      composite.removeEventListener("focusin", handleFocusIn)
      composite.removeEventListener("focusout", handleFocusOut)
      composite.removeEventListener("keydown", handleKeyDown)
    }
  }, [refComposite])
}



// Select the clicked option.
function handleClick(e) {
  if (e.target.role !== "option") return
  if (e.target.disabled || e.target.ariaDisabled === "true") return
  e.preventDefault()

  const clickedOption = e.target
  const selectedOption = e.currentTarget.querySelector("[role='option'][aria-selected='true']")

  if (clickedOption !== selectedOption) {
    clickedOption.setAttribute("aria-selected", "true")
    if (selectedOption) selectedOption.setAttribute("aria-selected", "false")
  }
    
  if (clickedOption !== document.activeElement) clickedOption.focus()
}



// Rove tabindex when the option is focused.
function handleFocusIn(e) {
  if (e.target.role !== "option") return
  if (e.target.disabled || e.target.ariaDisabled === "true") return

  const focusedOption = e.target
  const tabbableOption = e.currentTarget.querySelector("[role='option'][tabindex='0']")

  if (focusedOption !== tabbableOption) {
    focusedOption.setAttribute("tabindex", "0")
    tabbableOption.setAttribute("tabindex", "-1")
  }
}



// When focus leaves the composite, make the selected option the tabbable option;
// otherwise, the first option.
function handleFocusOut(e) {
  if (e.currentTarget.contains(e.relatedTarget)) return

  const firstOption = e.currentTarget. querySelector("[role='option']")
  const selectedOption = e.currentTarget.querySelector("[role='option'][aria-selected='true']")
  const tabbableOption = e.currentTarget.querySelector("[role='option'][tabindex='0']")

  if (!selectedOption) {
    if (firstOption !== tabbableOption) {
      firstOption.setAttribute("tabindex", "0")
      tabbableOption.setAttribute("tabindex", "-1")
    }
  } else if (selectedOption !== tabbableOption) {
    selectedOption.setAttribute("tabindex", "0")
    tabbableOption.setAttribute("tabindex", "-1")
  }
}



// Implement keyboard interaction.
const handledKeys = ["ArrowUp", "ArrowDown", "Home", "End", "Space", "Enter"]
function handleKeyDown(e) {
  const key = e.code
  if (!handledKeys.includes(key)) return
  e.preventDefault()

  const options = [...e.currentTarget.querySelectorAll("[role='option']")]
  const focusedOption = document.activeElement
  const firstOption = options[0]
  const lastOption = options.at(-1)
  const previousOption = options[options.indexOf(focusedOption) - 1]
  const nextOption = options[options.indexOf(focusedOption) + 1]
  let targetOption

  switch (key) {
    case "ArrowUp": targetOption = previousOption; break
    case "ArrowDown": targetOption = nextOption; break
    case "Home": targetOption = firstOption; break
    case "End": targetOption = lastOption; break
    case "Space":
    case "Enter": focusedOption.click()
  }

  if (targetOption && targetOption !== focusedOption) targetOption.focus()
}



// Ensure there is always an option in the tab sequence, when options are added or removed.
const observerListbox = new MutationObserver(callback)
function callback(mutationList) {
  for (const mutation of mutationList) {
    const firstOption = mutation.target.querySelector("[role='option']")
    const selectedOption = mutation.target.querySelector("[role='option'][aria-selected='true']")
    const tabbableOption = mutation.target.querySelector("[role='option'][tabindex='0']")

    for (const addedNode of mutation.addedNodes) {
      if (addedNode.role !== "option") return

      const addedOption = addedNode

      if (addedOption.ariaSelected !== "true") addedOption.setAttribute("aria-selected", "false")

      if (selectedOption) {
        if (addedOption.getAttribute("tabindex") !== "0") addedOption.setAttribute("tabindex", "-1")
      } else {
        if (addedOption === firstOption) {
          if (addedOption.getAttribute("tabindex") !== "-1") addedOption.setAttribute("tabindex", "0")
        }
        else if (addedOption.getAttribute("tabindex") !== "0") addedOption.setAttribute("tabindex", "-1")
      }
    }

    for (const removedNode of mutation.removedNodes) {
      if (removedNode.role !== "option") return

      if (!selectedOption) {
        if (!tabbableOption) {
          if (firstOption && firstOption.getAttribute("tabindex") !== "-1") {
            firstOption.setAttribute("tabindex", "0")
          }
        }
        else if (tabbableOption !== firstOption) {
          if (firstOption.getAttribute("tabindex") !== "-1") firstOption.setAttribute("tabindex", "0")
          if (tabbableOption.getAttribute("tabindex") !== "0") tabbableOption.setAttribute("tabindex", "-1")
        }
      }
    }
  }
}