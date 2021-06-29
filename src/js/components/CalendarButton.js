import React, { useState } from "react"
import { BiCalendar } from "react-icons/bi"

export default ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false)
  const togglePress = () => {
    setIsPressed(!isPressed)
  }
  return (
    <button
      id="calendar-button"
      onClick={() => {
        onClick()
        togglePress()
      }}
      onMouseDown={togglePress}
      onTouchStart={togglePress}
      onTouchEnd={togglePress}
      onTouchCancel={togglePress}
      style={{
        opacity: isPressed ? "65%" : "",
      }}
    >
      <div
        style={{
          color: "#2693ff",
          fontSize: 60,
          position: "absolute",
          top: 17,
          left: 20,
        }}
      >
        <BiCalendar />
      </div>
    </button>
  )
}
