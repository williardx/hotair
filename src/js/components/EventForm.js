import React, { useState, useRef, useEffect } from "react"
import { BiCheck, BiX } from "react-icons/bi"
import { NUM_ROWS, COLORS } from "~js/constants"

export default ({
  onSubmit,
  isVisible,
  onCancel,
  pendingTile,
  setPendingTile,
}) => {
  const {
    startTime,
    endTime,
    day,
    numOverlappingTiles,
    overlappingTiles,
    color: initialColor,
  } = pendingTile
  const formWidth = 275
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / NUM_ROWS
  const tileWidth = calendarColumnWidthPct * window.innerWidth * 0.8
  const tileLeft = window.innerWidth * calendarColumnWidthPct * day
  const left = day < 4 ? tileLeft + tileWidth + 20 : tileLeft - formWidth - 20
  const topRowAdjustment = startTime > 20 ? -4 : startTime >= 17 ? -2 : 2
  const top =
    window.innerHeight * calendarRowHeightPct * (startTime + topRowAdjustment)
  const [text, setText] = useState("")
  const [color, setColor] = useState(initialColor)
  const [isSubmitPressed, setIsSubmitPressed] = useState(false)
  const inputRef = useRef(null)
  const isSubmitDisabled = text.length === 0

  const togglePress = () => {
    if (!isSubmitDisabled) {
      setIsSubmitPressed(!isSubmitPressed)
    }
  }

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

  const ColorOption = ({ color, selectedColor }) => {
    return (
      <div
        onClick={onSelectColorChange}
        color={color}
        className="colorOption"
        style={{
          backgroundColor: color,
          opacity: color === selectedColor ? "100%" : "50%",
          cursor: "pointer",
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
        width: formWidth,
        cursor: "initial",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 style={{ color: "#424247", marginBottom: 5 }}>
          Where is your time?
        </h4>
        <h5 style={{ color: "rgb(132 132 132)" }}>你的时间在哪儿？</h5>
        <input
          ref={inputRef}
          style={{
            marginTop: 15,
            marginBottom: 15,
            padding: 5,
            border: 0,
            outline: 0,
            borderBottom: "1px rgb(189 189 189) solid",
            lineHeight: "initial",
          }}
          onChange={onTextInputChange}
          value={text}
          type="text"
        />
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {COLORS.map((colorCode) => (
              <ColorOption
                key={colorCode}
                color={colorCode}
                selectedColor={color}
              />
            ))}
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
            disabled={isSubmitDisabled}
            className="eventFormButton"
            style={{
              backgroundColor: isSubmitPressed ? "#4da6ff" : "#2693ff",
              color: "white",
              opacity: isSubmitDisabled ? "50%" : "100%",
            }}
            onMouseDown={togglePress}
            onTouchStart={togglePress}
            onTouchEnd={togglePress}
            onTouchCancel={togglePress}
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
