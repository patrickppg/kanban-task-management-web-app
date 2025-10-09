function Switch({ isOn, onSwitch, className, controlClassName, thumbClassName, trackClassName, ...rest }) {
  return (
    <span className={className}>
      <span className={trackClassName}></span>
      <span className={thumbClassName}></span>
      <input className={controlClassName} type="checkbox" checked={isOn} role="switch" onChange={() => onSwitch()} { ...rest } />
    </span>
  )
}

export default Switch