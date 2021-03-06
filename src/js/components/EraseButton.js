import React, { useState } from "react"
import { BiEraser } from "react-icons/bi"

export default ({ onClick, disabled }) => {
  const [isPressed, setIsPressed] = useState(false)
  const togglePress = () => {
    if (!disabled) {
      setIsPressed(!isPressed)
    }
  }
  const className = disabled ? "bottomRowButton disabled" : "bottomRowButton"
  return (
    <button
      title="Remove all events"
      id="erase-button"
      className={className}
      onClick={() => {
        if (!disabled) {
          onClick()
          togglePress()
        }
      }}
      onMouseDown={togglePress}
      onTouchStart={togglePress}
      onTouchEnd={togglePress}
      onTouchCancel={togglePress}
      style={{
        backgroundColor: isPressed ? "#e2e2e2" : "",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 30,
          position: "absolute",
          top: 9,
          left: 11,
        }}
      >
        <BiEraser />
      </div>
    </button>
  )
}
