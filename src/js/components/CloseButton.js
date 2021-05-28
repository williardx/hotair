import React from "react"
import { BiCheck } from "react-icons/bi"

export default ({ onClick }) => {
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
        right: 220,
        backgroundColor: "#289117",
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
