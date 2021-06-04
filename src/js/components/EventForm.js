import React, { useState, useRef, useEffect } from "react"
import { BiCheck, BiX } from "react-icons/bi"

export default ({
  onSubmit,
  isVisible,
  onCancel,
  pendingTile,
  numRows,
  setPendingTile,
}) => {
  const { startTime, endTime, day, numOverlappingTiles, overlappingTiles } =
    pendingTile
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / numRows
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.9
  const left = window.innerWidth * calendarColumnWidthPct * day + tileWidth + 20
  const top = window.innerHeight * calendarRowHeightPct * (startTime + 2)
  const initialColor = "#4285f4"
  const [text, setText] = useState("")
  const [color, setColor] = useState(initialColor)
  const inputRef = useRef(null)

  const onTextInputChange = (e) => {
    const text = e.target.value
    setText(text)
    setPendingTile({ ...pendingTile, text: text })
  }

  const onSelectColorChange = (e) => {
    const color = e.target.getAttribute("color")
    setColor(color)
    setPendingTile({ ...pendingTile, color: color })
  }

  const resetForm = () => {
    setText("")
    setColor(initialColor)
  }

  const ColorOption = ({ color }) => {
    return (
      <div
        onClick={onSelectColorChange}
        color={color}
        className="colorOption"
        style={{
          backgroundColor: color,
        }}
      />
    )
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [isVisible])

  return (
    <div
      id="event-form"
      style={{
        position: "fixed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: 1000,
        top: top,
        left: left,
        display: isVisible ? "flex" : "none",
        border: "1px solid #d0d0d0",
        padding: 20,
        borderRadius: 10,
        fontSize: 20,
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 style={{ color: "#424247" }}>Why are you busy?</h4>
        <input
          ref={inputRef}
          style={{
            marginTop: 5,
            padding: 2,
            border: 0,
            outline: 0,
            borderBottom: "1px #969696 solid",
          }}
          onChange={onTextInputChange}
          value={text}
          type="text"
        />
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ColorOption color="#4285f4" />
            <ColorOption color="#33b679" />
            <ColorOption color="#f4511e" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ColorOption color="#f6bf26" />
            <ColorOption color="#cd60eb" />
            <ColorOption color="#ff3232" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <button
            className="eventFormButton"
            style={{
              border: "1px solid #cccccc",
              backgroundColor: "white",
              color: "#929292",
            }}
            onClick={(e) => {
              e.preventDefault()
              onCancel()
            }}
          >
            <BiX />
          </button>
          <button
            className="eventFormButton"
            style={{
              backgroundColor: "#2693ff",
              color: "white",
            }}
            onClick={(e) => {
              e.preventDefault()
              const tile = {
                text,
                color,
                day,
                startTime,
                endTime,
                initNumOverlappingTiles: numOverlappingTiles,
                numOverlappingTiles,
                overlappingTiles,
                id: Math.floor(Math.random() * 100000),
                opacity: 1,
              }
              onSubmit(tile)
              resetForm()
            }}
          >
            <BiCheck />
          </button>
        </div>
      </form>
    </div>
  )
}
