import { useEffect, useRef } from "react"
import "./Dialog.css"

function Dialog({ isOpen, isModal = false, onClose, children, ...rest }) {
  useEffect(() => {
    if (isOpen) {
      if (isModal) dialogRef.current.showModal()
      else dialogRef.current.show()
    }
    else dialogRef.current.close()
  }, [isOpen, isModal])

  const dialogRef = useRef(null)
  
  return (
    <dialog ref={dialogRef} onClose={(e) => {e.stopPropagation(); onClose()}} {...rest}>
      {children}
    </dialog>
  )
}

export default Dialog