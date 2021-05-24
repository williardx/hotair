import React from "react"

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
        right: 100,
        backgroundColor: "#2693ff",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 80,
          position: "absolute",
          top: -2,
          left: 28,
        }}
      >
        +
      </div>
    </button>
  )
}
