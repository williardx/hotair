import React from "react"
import { BiX } from "react-icons/bi"

export default ({ tile, numRows, handleCloseModal }) => {
  const { day, startTime } = tile
  const modalWidth = 200
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / numRows
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.8
  const tileLeft = window.innerWidth * calendarColumnWidthPct * day
  const left = day < 4 ? tileLeft + tileWidth + 20 : tileLeft - modalWidth - 20
  const top = window.innerHeight * calendarRowHeightPct * (startTime + 2)

  return (
    <div id="tile-modal" style={{ top, left }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <BiX onClick={handleCloseModal} />
      </div>
      <h4>{tile.text}</h4>
    </div>
  )
}
