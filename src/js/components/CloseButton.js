import React, { useState } from "react"
import { BiCloud } from "react-icons/bi"

export default ({ onClick, disabled, shouldPulse }) => {
  const [isPressed, setIsPressed] = useState(false)
  const togglePress = () => {
    if (!disabled) {
      setIsPressed(!isPressed)
    }
  }
  const className = disabled ? "disabled" : shouldPulse ? "pulse" : ""
  return (
    <button
      id="close-button"
      className={className}
      onClick={() => {
        onClick()
        togglePress()
      }}
      onMouseDown={togglePress}
      onTouchStart={togglePress}
      onTouchEnd={togglePress}
      onTouchCancel={togglePress}
      style={{
        backgroundColor: isPressed ? "#85c2ff" : "",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 80,
          position: "absolute",
          top: 6,
          left: 11,
        }}
      >
        <BiCloud />
      </div>
    </button>
  )
}
