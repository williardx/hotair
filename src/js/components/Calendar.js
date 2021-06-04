import React, { useState, useRef } from "react"
import EventForm from "~js/components/EventForm"
import Grid from "~js/components/Grid"
import Tile from "~js/components/Tile"
import CloseButton from "~js/components/CloseButton"

export default ({
  isVisible,
  handleAddTile,
  tiles,
  toggleCalendarVisibility,
  setTiles,
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
    const { numOverlappingTiles, overlappingTiles } = tile
    if (numOverlappingTiles > 0) {
      const updatedTiles = overlappingTiles.map((ot) => {
        if (numOverlappingTiles > ot.numOverlappingTiles) {
          return {
            ...ot,
            numOverlappingTiles,
          }
        } else {
          return ot
        }
      })
      updatedTiles.forEach((ut) => {
        const index = tiles.findIndex((t) => t.id === ut.id)
        tiles[index] = ut
      })
      setTiles([...tiles])
    }
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
      zIndex: 1000,
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

  const getCell = (targets) =>
    targets.filter((obj) => obj?.className === "cell").pop()

  const handleMouseDown = (e) => {
    const targets = document.elementsFromPoint(e.clientX, e.clientY)
    if (tappedOnInput(targets)) {
      return
    }
    const cell = getCell(targets)
    if (cell) {
      mouseDown.current = true
      createPendingTile(cell)
    }
  }

  const handleMouseMove = (e) => {
    e.preventDefault()
    if (mouseDown.current) {
      const targets = document.elementsFromPoint(e.clientX, e.clientY)
      const cell = getCell(targets)
      if (cell) {
        updatePendingTile(cell)
      }
    }
  }

  const handleMouseUp = (e) => {
    e.preventDefault()
    if (mouseDown.current) {
      mouseDown.current = false
      showForm()
    }
  }

  const handleTouchStart = (e) => {
    const targets = document.elementsFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    if (tappedOnInput(targets)) {
      return
    }
    const cell = getCell(targets)
    if (cell) {
      createPendingTile(cell)
    }
  }

  const handleTouchMove = (e) => {
    const targets = document.elementsFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    const cell = getCell(targets)
    if (cell) {
      updatePendingTile(cell)
    }
  }

  const isOverlapping = (tileA, tileB) =>
    tileA.day === tileB.day &&
    !(tileA.startTime > tileB.endTime || tileA.endTime < tileB.startTime)

  const handleTouchEnd = (e) => {
    // on touch end compute the number of overlapping tiles
    // Iterate through every tile. If The tile is not in the same day, continue
    const targets = document.elementsFromPoint(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    )
    if (tappedOnInput(targets)) {
      return
    }
    const overlappingTiles = tiles.filter((tile) =>
      isOverlapping(pendingTile, tile)
    )
    setPendingTile({
      ...pendingTile,
      zIndex: overlappingTiles.length, // This value never changes
      overlappingTiles: overlappingTiles,
      numOverlappingTiles: overlappingTiles.length, // This value updates
    })
    showForm()
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
        cursor: "pointer",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pendingTile && (
        <Tile numRows={numRows} tile={pendingTile} isPending={true} />
      )}
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
          setTiles={setTiles}
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
