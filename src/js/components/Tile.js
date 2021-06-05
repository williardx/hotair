import React, { useRef, useEffect } from "react"
import roundRect from "~js/helpers/roundedRectangle"
import getLines from "~js/helpers/getLines"
import { NUM_ROWS } from "~js/constants"

export default ({ tile, isPending, handleOpenModal }) => {
  const {
    color,
    text,
    startTime,
    day,
    endTime,
    numOverlappingTiles = 0,
    initNumOverlappingTiles = 0,
  } = tile
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / NUM_ROWS
  const fullTileWidth = calendarColumnWidthPct * window.innerWidth * 0.8
  const tileWidth =
    fullTileWidth / (isPending ? 1 : (numOverlappingTiles ?? 0) + 1)
  const tileHeight =
    window.innerHeight * calendarRowHeightPct * (endTime - startTime + 1)
  const tileX =
    window.innerWidth * calendarColumnWidthPct * day +
    (numOverlappingTiles > 0
      ? (fullTileWidth / (numOverlappingTiles + 1) - 10) *
        initNumOverlappingTiles
      : 0)
  const tileY = window.innerHeight * calendarRowHeightPct * (startTime + 2)
  const canvasRef = useRef(null)
  const maxTextWidth = tileWidth - 10
  const textVerticalOffset = 25

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    canvas.width = tileWidth
    canvas.height = tileHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.font = "18pt sans-serif"
    context.fillStyle = color
    // Subtract one to ensure the white stroke is visible
    roundRect(context, 0, 0, tileWidth - 1, tileHeight - 1, 10, true, true)
    context.fillStyle = "white"
    if (text) {
      const lines = getLines(context, text, maxTextWidth)
      for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], 10, 25 + i * textVerticalOffset)
      }
    }
  }, [tileWidth, tileHeight, color, text])

  return (
    <canvas
      onClick={() => !isPending && handleOpenModal(tile)}
      className="tile"
      width={150}
      height={200}
      style={{
        position: "fixed",
        left: tileX,
        top: tileY,
        zIndex: tile.zIndex,
      }}
      ref={canvasRef}
    />
  )
}
