import React, { useRef, useEffect } from "react"
import roundRect from "~js/helpers/roundedRectangle"

export default ({ tile, numRows }) => {
  const { color, text, startTime, day, endTime } = tile
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / numRows
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.9
  const tileHeight =
    window.innerHeight * calendarRowHeightPct * (endTime - startTime + 1)
  const tileX = window.innerWidth * calendarColumnWidthPct * day
  const tileY = window.innerHeight * calendarRowHeightPct * (startTime + 2)
  const canvasRef = useRef(null)
  const maxTextWidth = 130
  const textVerticalOffset = 20

  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ")
    var lines = []
    var currentLine = words[0]

    for (var i = 1; i < words.length; i++) {
      var word = words[i]
      var width = ctx.measureText(currentLine + " " + word).width
      if (width < maxWidth) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    canvas.width = tileWidth
    canvas.height = tileHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.font = "18pt sans-serif"
    context.fillStyle = color
    roundRect(context, 0, 0, tileWidth, tileHeight, 10, true, false)
    context.fillStyle = "white"
    if (text) {
      const lines = getLines(context, text, maxTextWidth)
      for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], 10, 25 + i * textVerticalOffset)
      }
    }
  }, [tileHeight, color, text])

  return (
    <canvas
      width={150}
      height={200}
      style={{
        position: "fixed",
        left: tileX,
        top: tileY,
      }}
      ref={canvasRef}
    />
  )
}
