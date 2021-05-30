import React, { useState } from "react"
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

  const handleCreatePendingTile = (tile) => {
    setPendingTile(tile)
    toggleFormVisibility()
  }

  const handleCancelCreateTile = () => {
    setPendingTile(null)
    toggleFormVisibility()
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
      {tiles.map((tile, index) => (
        <Tile
          tile={tile}
          color={tile.color}
          text={tile.text}
          key={index.toString()}
          day={tile.day}
          startTime={tile.startTime}
          endTime={tile.endTime}
        />
      ))}
      <CloseButton onClick={toggleCalendarVisibility} />
      {pendingTile !== null && (
        <EventForm
          pendingTile={pendingTile}
          isVisible={formVisibilityToggle}
          onSubmit={onEventFormSubmit}
          onCancel={handleCancelCreateTile}
          toggleFormVisibility={toggleFormVisibility}
        />
      )}
      <Grid numRows={13} handleCreatePendingTile={handleCreatePendingTile} />
    </div>
  )
}
