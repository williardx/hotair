import React, { useState } from "react"
import { BiPlus } from "react-icons/bi"

export default ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false)
  const togglePress = () => {
    setIsPressed(!isPressed)
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
        right: 100,
        backgroundColor: isPressed ? "#4da6ff" : "#2693ff",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 80,
          position: "absolute",
          top: 7,
          left: 12,
        }}
      >
        <BiPlus />
      </div>
    </button>
  )
}
