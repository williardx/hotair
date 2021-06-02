import React, { useState, useRef } from "react"
import PlusButton from "./PlusButton"
import EventForm from "~js/components/EventForm"
import Grid from "~js/components/Grid"
import Tile from "~js/components/Tile"
import CloseButton from "~js/components/CloseButton"

export default ({
  isVisible,
  handleAddTile,
  tiles,
  toggleCalendarVisibility,
}) => {
  const numRows = 26
  const [formVisibilityToggle, setFormVisibilityToggle] = useState(false)
  const [pendingTile, setPendingTile] = useState(null)
  const mouseDown = useRef(false)

  const hideForm = () => {
    if (formVisibilityToggle) {
      setFormVisibilityToggle(!formVisibilityToggle)
    }
  }

  const showForm = () => {
    if (!formVisibilityToggle) {
      setFormVisibilityToggle(!formVisibilityToggle)
    }
  }

  const toggleFormVisibility = () => {
    setFormVisibilityToggle(!formVisibilityToggle)
  }

  const onEventFormSubmit = (tile) => {
    handleAddTile(tile)
    setPendingTile(null)
    toggleFormVisibility()
  }

  const handleCancelCreateTile = () => {
    setPendingTile(null)
    hideForm()
  }

  const handleCloseCalendar = () => {
    if (!formVisibilityToggle) {
      toggleCalendarVisibility()
    }
  }

  const tappedOnInput = (targets) => {
    return (
      targets.filter(
        (obj) => obj?.id === "event-form" || obj?.id === "close-button"
      ).length > 0
    )
  }

  const createPendingTile = (cell) => {
    const start = {
      row: cell.getAttribute("row"),
      col: cell.getAttribute("col"),
    }
    const day = parseInt(start.col)
    const startTime = parseInt(start.row)
    const endTime = parseInt(start.row)
    setPendingTile({
      day,
      startTime,
      endTime,
      color: "#4285f4",
      text: "",
      id: Math.floor(Math.random() * 100000),
      opacity: 1,
    })
  }

  const updatePendingTile = (cell) => {
    const move = {
      row: parseInt(cell.getAttribute("row")),
      col: parseInt(cell.getAttribute("col")),
    }
    if (move.row !== pendingTile.endTime) {
      setPendingTile({
        ...pendingTile,
        endTime: move.row,
      })
    }
  }

  const handleMouseDown = (e) => {
    const targets = document.elementsFromPoint(e.clientX, e.clientY)
    if (tappedOnInput(targets)) {
      return
    }
    const cell = targets.filter((obj) => obj?.className === "cell").pop()
    if (cell) {
      mouseDown.current = true
      createPendingTile(cell)
    }
  }

  const handleMouseMove = (e) => {
    e.preventDefault()
    if (mouseDown.current) {
      console.log("mousemove", e.clientX, e.clientY)
      const targets = document.elementsFromPoint(e.clientX, e.clientY)
      const cell = targets.filter((obj) => obj?.className === "cell").pop()
      if (cell) {
        updatePendingTile(cell)
      }
    }
  }

  const handleMouseUp = (e) => {
    e.preventDefault()
    if (mouseDown.current) {
      console.log("mouseup")
      mouseDown.current = false
      showForm()
    }
  }

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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {pendingTile && <Tile numRows={numRows} tile={pendingTile} />}
      {tiles.map((tile, index) => (
        <Tile numRows={numRows} tile={tile} key={index.toString()} />
      ))}
      <CloseButton
        onClick={handleCloseCalendar}
        disabled={formVisibilityToggle}
      />
      {pendingTile !== null && (
        <EventForm
          numRows={numRows}
          pendingTile={pendingTile}
          isVisible={formVisibilityToggle}
          onSubmit={onEventFormSubmit}
          onCancel={handleCancelCreateTile}
          setPendingTile={setPendingTile}
        />
      )}
      <Grid
        numRows={numRows}
        pendingTile={pendingTile}
        setPendingTile={setPendingTile}
        handleCancelCreateTile={handleCancelCreateTile}
        toggleFormVisibility={toggleFormVisibility}
        showForm={showForm}
      />
    </div>
  )
}
