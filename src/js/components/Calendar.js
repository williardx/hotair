import React, { useState } from "react"
import PlusButton from "./PlusButton"
import EventForm from "~js/components/EventForm"
import Grid from "~js/components/Grid"
import Tile from "~js/components/Tile"

const SIZES = {
  small: 75,
  medium: 200,
  large: 300,
}

export default ({ isVisible, handleAddTile, tiles }) => {
  const [formVisibilityToggle, setFormVisibilityToggle] = useState(false)

  const toggleFormVisibility = () => {
    setFormVisibilityToggle(!formVisibilityToggle)
  }

  const onEventFormSubmit = (tile) => {
    handleAddTile(tile)
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
      {/* <Sidebar /> */}
      {tiles.map((tile, index) => (
        <Tile
          color={tile.color}
          text={tile.text}
          tileHeight={SIZES[tile.size]}
          key={index.toString()}
          day={tile.day}
          startTime={tile.startTime}
          endTime={tile.endTime}
        />
      ))}
      <PlusButton onClick={toggleFormVisibility} />
      <EventForm
        isVisible={formVisibilityToggle}
        onSubmit={onEventFormSubmit}
      />
      <Grid numRows={13} />
    </div>
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
