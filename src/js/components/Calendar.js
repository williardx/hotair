import React, { useState, useRef, useEffect } from "react"
import EventForm from "~js/components/EventForm"
import Grid from "~js/components/Grid"
import Tile from "~js/components/Tile"
import CloseButton from "~js/components/CloseButton"
import EraseButton from "~js/components/EraseButton"
import HelpButton from "~js/components/HelpButton"
import TileModal from "~js/components/TileModal"
import HelpModal from "~js/components/HelpModal"
import randomChoice from "~js/helpers/randomChoice"
import { MAX_NUM_CLOUDS, COLORS } from "~js/constants"
import calendarTiler from "~js/helpers/calendarTiler"
import ResetButton from "./ResetButton"

export default ({
  isVisible,
  handleAddTile,
  tiles,
  toggleCalendarVisibility,
  setTiles,
  nextTiles,
  setNextTiles,
  setClouds,
  handleResetTiles,
}) => {
  const [formVisibilityToggle, setFormVisibilityToggle] = useState(false)
  const [tileModalVisibilityToggle, setTileModalVisibilityToggle] =
    useState(false)
  const [pendingTile, setPendingTile] = useState(null)
  const [selectedTile, setSelectedTile] = useState(null)
  const [helpModalVisibilityToggle, setHelpModalVisibilityToggle] =
    useState(false)
  const shouldPulse = nextTiles.length === MAX_NUM_CLOUDS
  const isDrawingTile = useRef(false)
  const lastMouseMove = useRef(null)
  const intervalInitTimestamp = useRef(null)

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
    const allTilesOnDay = tiles
      .concat(nextTiles)
      .concat([tile])
      .filter((t) => t.day === tile.day)
    const arrangedTiles = calendarTiler(allTilesOnDay)
    arrangedTiles.forEach((at) => {
      if (at.id === tile.id) {
        tile = at
      } else {
        const tilesIndex = tiles.findIndex((t) => t.id === at.id)
        if (tilesIndex > -1) {
          tiles[tilesIndex] = at
        } else {
          const nextTilesIndex = nextTiles.findIndex((t) => t.id === at.id)
          nextTiles[nextTilesIndex] = at
        }
      }
    })

    setTiles([...tiles])
    setNextTiles([...nextTiles])
    handleAddTile(tile)
    setPendingTile(null)
    toggleFormVisibility()
  }

  const handleCancelCreateTile = () => {
    setPendingTile(null)
    isDrawingTile.current = false
    hideForm()
  }

  const handleCloseCalendar = () => {
    if (!formVisibilityToggle) {
      if (pendingTile) {
        setPendingTile(null)
      }
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

  const handleToggleHelpModalVisibility = () => {
    setHelpModalVisibilityToggle(!helpModalVisibilityToggle)
  }

  const tappedOnTile = (targets) => {
    return targets.filter((obj) => obj?.className === "tile").length > 0
  }

  const tappedOnInput = (targets) => {
    return (
      targets.filter((obj) =>
        [
          "event-form",
          "close-button",
          "tile-modal",
          "erase-button",
          "help-modal",
          "reset-button",
          "help-button",
        ].includes(obj?.id),
      ).length > 0
    )
  }

  const createPendingTile = (cell) => {
    const start = {
      row: parseInt(cell.getAttribute("row")),
      col: parseInt(cell.getAttribute("col")),
    }
    const day = start.col
    const startTime = start.row
    const endTime = start.row + 1
    setPendingTile({
      day,
      startTime,
      endTime,
      color: randomChoice(COLORS),
      text: "",
      id: Math.floor(Math.random() * 100000),
      opacity: 1,
      zIndex: 1000,
    })
  }

  const updatePendingTile = (cell) => {
    const move = {
      row: parseInt(cell.getAttribute("row")) + 1,
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
    targets.filter((obj) => obj?.className.startsWith("cell")).pop()

  const handleClick = (e) => {
    if (!isDrawingTile.current) {
      if (nextTiles.length >= MAX_NUM_CLOUDS) {
        return
      }
      const targets = document.elementsFromPoint(e.clientX, e.clientY)
      if (tappedOnInput(targets) || tappedOnTile(targets)) {
        return
      }
      if (!pendingTile) {
        const cell = getCell(targets)
        if (cell) {
          isDrawingTile.current = true
          createPendingTile(cell)
        }
      }
    } else {
      e.preventDefault()
      isDrawingTile.current = false
      if (pendingTile) {
        setPendingTile({
          ...pendingTile,
        })
      }
      showForm()
    }
  }

  const handleMouseMove = (e) => {
    e.preventDefault()
    lastMouseMove.current = Date.now()
    if (isDrawingTile.current) {
      if (pendingTile !== null) {
        const targets = document.elementsFromPoint(e.clientX, e.clientY)
        const cell = getCell(targets)
        if (cell) {
          updatePendingTile(cell)
        }
      }
    }
  }

  // Check every so often that someone is using the calendar. If not
  // turn it back to sky view which is more interesting.
  const closeCalendarInterval = 60000 * 5
  useEffect(() => {
    intervalInitTimestamp.current = Date.now()
    const interval = setInterval(() => {
      if (
        lastMouseMove.current === null ||
        lastMouseMove.current - intervalInitTimestamp.current <= 0
      ) {
        handleCloseCalendar()
        handleResetTiles()
      } else {
        intervalInitTimestamp.current = Date.now()
      }
    }, closeCalendarInterval)
    return () => clearInterval(interval)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && pendingTile !== null) {
      handleCancelCreateTile()
    }
  }

  const handleDeleteTile = (tile) => {
    const tilesOnSameDay = tiles.filter(
      (t) => t.id !== tile.id && t.day === tile.day,
    )
    const nextTilesOnSameDay = nextTiles.filter(
      (t) => t.id !== tile.id && t.day === tile.day,
    )
    const allTilesOnDay = tilesOnSameDay.concat(nextTilesOnSameDay)
    const arrangedTiles = calendarTiler(allTilesOnDay)
    arrangedTiles.forEach((at) => {
      const tilesIndex = tilesOnSameDay.findIndex((t) => t.id === at.id)
      if (tilesIndex > -1) {
        tilesOnSameDay[tilesIndex] = at
      } else {
        const nextTilesIndex = nextTilesOnSameDay.findIndex(
          (t) => t.id === at.id,
        )
        nextTilesOnSameDay[nextTilesIndex] = at
      }
    })
    const restOfTiles = tiles.filter((t) => t.day !== tile.day)
    const restOfNextTiles = nextTiles.filter((t) => t.day !== tile.day)
    setNextTiles([...restOfNextTiles, ...nextTilesOnSameDay])
    setTiles([...restOfTiles, ...tilesOnSameDay])
    handleCloseModal()
  }

  const handleDeleteAllTiles = () => {
    setNextTiles([])
    setTiles([])
    setClouds([])
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  })

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
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      {pendingTile && (
        <Tile
          tile={pendingTile}
          isPending={true}
          isFormOpen={formVisibilityToggle}
          setPendingTile={setPendingTile}
        />
      )}
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
        disabled={pendingTile !== null}
        shouldPulse={shouldPulse}
      />
      <HelpButton
        onClick={handleToggleHelpModalVisibility}
        disabled={helpModalVisibilityToggle}
      />
      <EraseButton
        onClick={handleDeleteAllTiles}
        disabled={pendingTile !== null}
      />
      <ResetButton onClick={handleResetTiles} disabled={pendingTile !== null} />
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
        <TileModal
          tile={selectedTile}
          handleCloseModal={handleCloseModal}
          handleDeleteTile={handleDeleteTile}
        />
      )}
      {helpModalVisibilityToggle && (
        <HelpModal handleClose={handleToggleHelpModalVisibility} />
      )}
      <Grid
        disabled={pendingTile !== null || nextTiles.length >= MAX_NUM_CLOUDS}
      />
    </div>
  )
}
