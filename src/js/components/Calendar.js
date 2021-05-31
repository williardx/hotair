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
    toggleFormVisibility()
  }

  const handleCloseCalendar = () => {
    if (!formVisibilityToggle) {
      toggleCalendarVisibility()
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
          toggleFormVisibility={toggleFormVisibility}
          setPendingTile={setPendingTile}
        />
      )}
      <Grid
        numRows={numRows}
        pendingTile={pendingTile}
        setPendingTile={setPendingTile}
        toggleFormVisibility={toggleFormVisibility}
      />
    </div>
  )
}
