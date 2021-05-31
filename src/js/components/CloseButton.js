import React, { useState } from "react"
import { BiCloud } from "react-icons/bi"

export default ({ onClick, disabled }) => {
  const [isPressed, setIsPressed] = useState(false)
  const togglePress = () => {
    if (!disabled) {
      setIsPressed(!isPressed)
    }
  }
  return (
    <button
      onClick={() => {
        onClick()
        togglePress()
      }}
      onMouseDown={togglePress}
      onTouchStart={togglePress}
      onTouchEnd={togglePress}
      onTouchCancel={togglePress}
      style={{
        width: 100,
        height: 100,
        border: "none",
        position: "fixed",
        borderRadius: 100,
        bottom: 100,
        right: 95,
        backgroundColor: isPressed ? "#4da6ff" : "#2693ff",
        zIndex: 1000,
        opacity: disabled ? "50%" : "100%",
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
