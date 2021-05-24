import React, { useEffect, useRef } from "react"
import roundRect from "../helpers/roundedRectangle"
import PlusButton from "./PlusButton"

const Calendar = ({ isVisible }) => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 1000,
        display: isVisible ? "flex" : "none",
      }}
    >
      {/* <Sidebar /> */}
      <Tile />
      <PlusButton />
      <Grid numRows={12} />
    </div>
  )
}

const Tile = () => {
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
    canvas.width = 150
    canvas.height = 200
    context.font = "18pt Roboto"
    context.fillStyle = "#ff3232"
    roundRect(context, 0, 0, 150, 200, 10, true, false)
    context.fillStyle = "white"
    const lines = getLines(
      context,
      "I didn't sign up for this believe me",
      maxTextWidth
    )
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
        left: window.innerWidth * 0.142 * 2,
        top: 200,
      }}
      ref={canvasRef}
    />
  )
}

const Sidebar = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "300px",
      }}
    ></div>
  )
}

const Grid = ({ numRows }) => {
  const createRows = () => {
    return Array.from(Array(numRows)).flatMap((val, rowIndex) => {
      return Array.from(Array(7)).map((_, colIndex) => {
        return <div key={`${rowIndex}-${colIndex}`} className="cell"></div>
      })
    })
  }
  return (
    <div className="grid">
      <div className="cell header">
        <h1 className="day">周日</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周一</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周二</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周三</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周四</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周五</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周六</h1>
      </div>
      {createRows()}
    </div>
  )
}

export default Calendar
