import React from "react"
import { AiOutlineCloudSync } from "react-icons/ai"

export default ({ numNextClouds }) => {
  return (
    <button id="next-clouds-indicator">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "white",
          fontSize: 20,
          position: "absolute",
          top: 12,
          left: 11,
        }}
      >
        <div
          style={{
            fontSize: 14,
            position: "absolute",
            top: 3,
            left: numNextClouds > 9 ? -4 : 0,
          }}
        >
          {numNextClouds}
        </div>
        <AiOutlineCloudSync
          style={{ position: "absolute", left: 11, top: 2 }}
        />
      </div>
    </button>
  )
}
