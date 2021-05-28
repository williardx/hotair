import React from "react"
import { BiCalendar } from "react-icons/bi"

export default ({ onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: 100,
        height: 100,
        border: "none",
        position: "fixed",
        borderRadius: 100,
        bottom: 100,
        right: 100,
        backgroundColor: "#2693ff",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 60,
          position: "absolute",
          top: 17,
          left: 22,
        }}
      >
        <BiCalendar />
      </div>
    </button>
  )
}
