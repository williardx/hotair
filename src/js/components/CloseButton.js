import React, { useState } from "react"
import { BiCheck } from "react-icons/bi"

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
        right: 95,
        backgroundColor: isPressed ? "#2da81a" : "#289117",
        zIndex: 1000,
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
        <BiCheck />
      </div>
    </button>
  )
}
