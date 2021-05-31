import React, { useState, useCallback } from "react"

const generateTimeSeries = (hourStart, hourEnd, step) => {
  const dt = new Date(1970, 0, 1, hourStart)
  const rc = []
  let counter = 0
  while (dt.getHours() < hourEnd) {
    rc.push({
      value: counter,
      display: dt.toLocaleTimeString("en-US"),
    })
    dt.setMinutes(dt.getMinutes() + step)
    counter += 1
  }
  return rc
}

const times = generateTimeSeries(7, 22, 30).slice(2)

export default ({
  onSubmit,
  isVisible,
  onCancel,
  pendingTile,
  numRows,
  setPendingTile,
}) => {
  const { startTime, endTime, day } = pendingTile
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / numRows
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.9
  const left = window.innerWidth * calendarColumnWidthPct * day + tileWidth + 20
  const top = window.innerHeight * calendarRowHeightPct * (startTime + 2)
  const initialColor = "#4285f4"
  const [text, setText] = useState("")
  const [color, setColor] = useState(initialColor)

  const onTextInputChange = (e) => {
    const text = e.target.value
    setText(text)
    setPendingTile({ ...pendingTile, text: text })
  }

  const onSelectColorChange = (e) => {
    const color = e.target.value
    setColor(color)
    setPendingTile({ ...pendingTile, color: color })
  }

  const resetForm = () => {
    setText("")
    setColor(initialColor)
  }

  return (
    <div
      style={{
        position: "fixed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: 1000,
        top: top,
        left: left,
        display: isVisible ? "flex" : "none",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>What are you busy with?</label>
        <input onChange={onTextInputChange} value={text} type="text" />
        <label>Choose event color</label>
        <select value={color} onChange={onSelectColorChange}>
          <option value="#4285f4">Blue</option>
          <option value="#33b679">Green</option>
          <option value="#f4511e">Orange</option>
          <option value="#f6bf26">Yellow</option>
          <option value="#cd60eb">Purple</option>
          <option value="#ff3232">Red</option>
        </select>
        <button
          onClick={(e) => {
            e.preventDefault()
            const tile = {
              text,
              color,
              day,
              startTime,
              endTime,
              tileHeight:
                window.innerHeight *
                calendarRowHeightPct *
                (endTime - startTime + 1),
              tileWidth: calendarColumnWidthPct * window.innerWidth * 0.9,
              x: window.innerWidth * calendarColumnWidthPct * day,
              y: window.innerHeight * calendarRowHeightPct * (startTime + 2),
              id: Math.floor(Math.random() * 100000),
              opacity: 1,
            }
            onSubmit(tile)
            resetForm()
          }}
        >
          Submit
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            onCancel()
          }}
        >
          Close
        </button>
      </form>
    </div>
  )
}
