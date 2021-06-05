import React, { useState, useRef } from "react"
import EventForm from "~js/components/EventForm"
import Grid from "~js/components/Grid"
import Tile from "~js/components/Tile"
import CloseButton from "~js/components/CloseButton"
import TileModal from "~js/components/TileModal"
import randomChoice from "~js/helpers/randomChoice"
import { MAX_NUM_CLOUDS } from "~js/constants"

export default ({
  isVisible,
  handleAddTile,
  tiles,
  toggleCalendarVisibility,
  setTiles,
  nextTiles,
  setNextTiles,
}) => {
  const [formVisibilityToggle, setFormVisibilityToggle] = useState(false)
  const [tileModalVisibilityToggle, setTileModalVisibilityToggle] =
    useState(false)
  const [pendingTile, setPendingTile] = useState(null)
  const [selectedTile, setSelectedTile] = useState(null)
  const shouldPulse = nextTiles.length === MAX_NUM_CLOUDS
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
        const tilesIndex = tiles.findIndex((t) => t.id === ut.id)
        if (tilesIndex > -1) {
          tiles[tilesIndex] = ut
        } else {
          const nextTilesIndex = nextTiles.findIndex((t) => t.id === ut.id)
          nextTiles[nextTilesIndex] = ut
        }
      })
      setTiles([...tiles])
      setNextTiles([...nextTiles])
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

  const handleOpenModal = (tile) => {
    setSelectedTile(tile)
    setTileModalVisibilityToggle(!tileModalVisibilityToggle)
  }

  const handleCloseModal = () => {
    setSelectedTile(null)
    setTileModalVisibilityToggle(!tileModalVisibilityToggle)
  }

  const tappedOnTile = (targets) => {
    return targets.filter((obj) => obj?.className === "tile").length > 0
  }

  const tappedOnInput = (targets) => {
    return (
      targets.filter(
        (obj) =>
          obj?.id === "event-form" ||
          obj?.id === "close-button" ||
          obj?.id === "tile-modal"
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
      color: randomChoice([
        "#4285f4",
        "#33b679",
        "#f4511e",
        "#f6bf26",
        "#cd60eb",
        "#ff3232",
      ]),
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
    if (nextTiles.length >= MAX_NUM_CLOUDS) {
      return
    }
    const targets = document.elementsFromPoint(e.clientX, e.clientY)
    if (tappedOnInput(targets) || tappedOnTile(targets)) {
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
    if (mouseDown.current && pendingTile !== null) {
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
      if (pendingTile) {
        const overlappingTiles = tiles
          .concat(nextTiles)
          .filter((tile) => isOverlapping(pendingTile, tile))
        setPendingTile({
          ...pendingTile,
          zIndex: overlappingTiles.length, // This value never changes
          overlappingTiles: overlappingTiles,
          numOverlappingTiles: overlappingTiles.length, // This value updates
        })
      }
      showForm()
    }
  }

  const handleTouchStart = (e) => {
    if (nextTiles.length >= MAX_NUM_CLOUDS) {
      return
    }
    const targets = document.elementsFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    if (tappedOnInput(targets) || tappedOnTile(targets)) {
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
    const targets = document.elementsFromPoint(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    )
    if (tappedOnInput(targets)) {
      return
    }
    if (pendingTile) {
      const overlappingTiles = tiles
        .concat(nextTiles)
        .filter((tile) => isOverlapping(pendingTile, tile))
      setPendingTile({
        ...pendingTile,
        zIndex: overlappingTiles.length, // This value never changes
        overlappingTiles: overlappingTiles,
        numOverlappingTiles: overlappingTiles.length, // This value updates
      })
    }
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
      {pendingTile && <Tile tile={pendingTile} isPending={true} />}
      {nextTiles.map((tile, index) => (
        <Tile
          tile={tile}
          key={index.toString()}
          handleOpenModal={handleOpenModal}
        />
      ))}
      {tiles.map((tile, index) => (
        <Tile
          tile={tile}
          key={index.toString()}
          handleOpenModal={handleOpenModal}
        />
      ))}
      <CloseButton
        onClick={handleCloseCalendar}
        disabled={formVisibilityToggle}
        shouldPulse={shouldPulse}
      />
      {pendingTile !== null && (
        <EventForm
          pendingTile={pendingTile}
          isVisible={formVisibilityToggle}
          onSubmit={onEventFormSubmit}
          onCancel={handleCancelCreateTile}
          setPendingTile={setPendingTile}
          setTiles={setTiles}
        />
      )}
      {selectedTile !== null && (
        <TileModal tile={selectedTile} handleCloseModal={handleCloseModal} />
      )}
      <Grid
        pendingTile={pendingTile}
        setPendingTile={setPendingTile}
        handleCancelCreateTile={handleCancelCreateTile}
        toggleFormVisibility={toggleFormVisibility}
        showForm={showForm}
      />
    </div>
  )
}
