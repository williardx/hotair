import React from "react"
import { BiX, BiTrash } from "react-icons/bi"
import { NUM_ROWS } from "~js/constants"

export default ({ tile, handleCloseModal, handleDeleteTile }) => {
  const { day, startTime } = tile
  const modalWidth = 200
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / NUM_ROWS
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.8
  const tileLeft = window.innerWidth * calendarColumnWidthPct * day
  const left = day < 4 ? tileLeft + tileWidth + 20 : tileLeft - modalWidth - 20
  const topRowAdjustment = startTime > 20 ? -1 : startTime >= 17 ? 0 : 2
  const top =
    window.innerHeight * calendarRowHeightPct * (startTime + topRowAdjustment)

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
        <BiTrash
          style={{ marginRight: 5 }}
          color="rgb(232 160 160)"
          onClick={() => handleDeleteTile(tile)}
        />
        <BiX size={23} color="rgb(160 160 160)" onClick={handleCloseModal} />
      </div>
      <h3>{tile.text}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      ></div>
    </div>
  )
}
