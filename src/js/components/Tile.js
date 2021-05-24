import React, { useRef, useEffect } from "react"
import roundRect from "~js/helpers/roundedRectangle"

export default ({
  position,
  color,
  text,
  // tileHeight,
  day,
  startTime,
  endTime,
}) => {
  const canvasRef = useRef(null)
  const maxTextWidth = 130
  const textVerticalOffset = 20
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / 13
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.9
  const tileHeight =
    (window.innerHeight * calendarRowHeightPct * (endTime - startTime)) / 2

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
    context.font = "18pt Roboto"
    context.fillStyle = color
    roundRect(context, 0, 0, tileWidth, tileHeight, 10, true, false)
    context.fillStyle = "white"
    const lines = getLines(context, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], 10, 25 + i * textVerticalOffset)
    }
  }, [])

  return (
    <canvas
      width={150}
      height={200}
      style={{
        position: "fixed",
        left: window.innerWidth * calendarColumnWidthPct * day + 10,
        top: (window.innerHeight * calendarRowHeightPct * startTime) / 2,
      }}
      ref={canvasRef}
    />
  )
}