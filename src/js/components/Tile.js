import React, { useRef, useEffect, useState } from "react"
import roundRect from "~js/helpers/roundedRectangle"
import getLines from "~js/helpers/getLines"
import { NUM_ROWS } from "~js/constants"

export default ({
  tile,
  isPending,
  handleOpenModal,
  setPendingTile,
  isFormOpen,
}) => {
  const {
    color,
    text,
    startTime,
    day,
    endTime,
    numOverlappingTiles = 0,
    initNumOverlappingTiles = 0,
    id,
  } = tile

  const [fontLoaded, setFontLoaded] = useState(false)

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
  const maxTextWidth = tileWidth - 30
  const textVerticalOffset = 25

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontLoaded(true)
    })
  }, [setFontLoaded])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    canvas.width = tileWidth
    canvas.height = tileHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.font = "18pt NotoSansSC"
    context.fillStyle = color
    // Subtract one to ensure the white stroke is visible
    roundRect(context, 0, 0, tileWidth - 1, tileHeight - 1, 10, true, true)
    context.fillStyle = "white"
    if (text) {
      const lines = getLines(context, text, maxTextWidth)
      for (let i = 0; i < lines.length; i++) {
        const offset = 25 + i * textVerticalOffset
        if (isPending && offset > tileHeight) {
          setPendingTile({
            ...tile,
            endTime: Math.min(tile.endTime + 1, NUM_ROWS),
          })
        }
        context.fillText(lines[i], 15, 30 + i * textVerticalOffset)
      }
    }
  }, [tileWidth, tileHeight, color, text, fontLoaded])

  return (
    <canvas
      onClick={() => !isPending && handleOpenModal(tile)}
      tileId={`${id}`}
      className={`tile${isPending ? " pending" : ""}${
        isFormOpen ? " editing" : ""
      }`}
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
