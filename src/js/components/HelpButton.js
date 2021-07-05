import React, { useState } from "react"
import { BiHelpCircle } from "react-icons/bi"

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
      id="help-button"
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
          top: 10,
          left: 11,
        }}
      >
        <BiHelpCircle />
      </div>
    </button>
  )
}
