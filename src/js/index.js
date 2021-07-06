import "normalize.css"
import "~css/main.css"
import "core-js/stable"
import "regenerator-runtime/runtime"

import React, { useEffect, useCallback, useState, useRef } from "react"
import { render } from "react-dom"
import { useDebugMode } from "~js/hooks"

import Canvas from "~js/components/Canvas"
import Camera from "~js/components/Canvas/Camera"
import Sphere from "~js/components/Canvas/Sphere"
import Environment from "~js/components/Canvas/Environment"
import Calendar from "~js/components/Calendar"
import CalendarButton from "~js/components/CalendarButton"
import randomChoice from "~js/helpers/randomChoice"
import calendarTiler from "~js/helpers/calendarTiler"
import initialTiles from "~js/initialTiles"
import NextCloudsIndicator from "~js/components/NextCloudsIndicator"
import { DAYS } from "~js/constants"

/**
 * app
 */
const App = () => {
  const debugMode = useDebugMode()

  let initialArrangedTiles = []
  DAYS.forEach((day) => {
    initialArrangedTiles = initialArrangedTiles.concat(
      calendarTiler(initialTiles.filter((t) => t.day === day)),
    )
  })

  const [tiles, setTiles] = useState(initialArrangedTiles)

  // Tiles that are queued up to be added to sky
  const [nextTiles, setNextTiles] = useState([])
  window.allTiles = tiles.concat(nextTiles)

  // Tiles that are in the sky
  const [clouds, setClouds] = useState([])
  const [nextClouds, setNextClouds] = useState([])
  const resetTilesTimeout = 60000 * 4
  const timeoutRef = useRef(null)
  const cloudsInitialized = useRef(false)
  const maxNumClouds = 9

  const [calendarVisibilityToggle, setCalendarVisibilityToggle] =
    useState(false)

  const handleAddTile = (tile) => {
    setNextTiles([...nextTiles, tile])
  }

  const handleRemoveCloud = (cloudID) => {
    setClouds([...clouds.filter((activeCloud) => cloudID !== activeCloud.id)])
  }

  const handleResetTiles = () => {
    setTiles(initialTiles)
    setNextTiles([])
    setNextClouds([])
    setClouds([])
  }

  const toggleCalendarVisibility = () => {
    if (calendarVisibilityToggle && nextTiles.length > 0) {
      const numTilesToAdd = Math.min(maxNumClouds, nextTiles.length)
      const cloudsToAddNow = nextTiles.slice(0, numTilesToAdd)
      const newCloudsInQueue = nextTiles.slice(numTilesToAdd)
      const currentClouds = [
        ...clouds.slice(0, clouds.length - numTilesToAdd),
        ...cloudsToAddNow,
      ]

      // Put new user-generated tiles at the front of the line since
      // they're more likely to be there
      setNextTiles([])
      setTiles([...tiles, ...newCloudsInQueue])
      setClouds(currentClouds)
      setNextClouds([...newCloudsInQueue, ...nextClouds])
      if (!cloudsInitialized.current) {
        cloudsInitialized.current = true
      }
    }
    setCalendarVisibilityToggle(!calendarVisibilityToggle)
  }

  const addCloudsToSky = useCallback(() => {
    const handleRemoveTile = (tile) => {
      const newTiles = tiles.filter((t) => t.id !== tile.id)
      setTiles(newTiles)
    }
    if (tiles.length > 0 && clouds.length < maxNumClouds) {
      // Otherwise randomly pick from the tiles in the calendar
      let newCloud
      // If we have queued up tiles add them first
      if (nextClouds.length > 0) {
        newCloud = nextClouds.shift()
        setNextClouds(nextClouds)
      } else {
        const activeCloudIds = clouds.map((cloud) => cloud.id)
        newCloud = randomChoice(
          tiles.filter((tile) => activeCloudIds.indexOf(tile.id) === -1),
        )
      }
      if (newCloud) {
        setClouds([...clouds, newCloud])
        handleRemoveTile(newCloud)
      }
    }
  }, [clouds, nextClouds, tiles])

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!cloudsInitialized.current) {
  //       addCloudsToSky()
  //       cloudsInitialized.current = true
  //     }
  //   }, 10000)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    // Automatically add a new cloud when we have nothing new to show
    // and a cloud goes off screen
    const interval = setInterval(addCloudsToSky, 5000)
    return () => clearInterval(interval)
  }, [addCloudsToSky])

  useEffect(() => {
    const isContentEmpty =
      tiles.length === 0 &&
      nextTiles.length === 0 &&
      clouds.length === 0 &&
      nextClouds.length === 0
    if (isContentEmpty && timeoutRef.current === null) {
      timeoutRef.current = setTimeout(handleResetTiles, resetTilesTimeout)
      window.timeout = timeoutRef.current
    } else if (!isContentEmpty && timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      window.timeout = timeoutRef.current
    }
    return () => clearTimeout(timeoutRef.current)
  }, [tiles, nextTiles, clouds, nextClouds, resetTilesTimeout])

  return (
    <>
      <CalendarButton onClick={toggleCalendarVisibility} />
      {nextClouds.length > 0 && (
        <NextCloudsIndicator numNextClouds={nextClouds.length} />
      )}
      {calendarVisibilityToggle && (
        <Calendar
          tiles={tiles}
          nextTiles={nextTiles}
          setTiles={setTiles}
          isVisible={calendarVisibilityToggle}
          handleAddTile={handleAddTile}
          handleResetTiles={handleResetTiles}
          toggleCalendarVisibility={toggleCalendarVisibility}
          setNextTiles={setNextTiles}
          setClouds={setClouds}
        />
      )}
      <Canvas>
        <Camera />
        <Environment tiles={clouds} handleRemoveCloud={handleRemoveCloud} />
        {debugMode && <Sphere />}
      </Canvas>
    </>
  )
}

/**
 * render app
 */
render(<App />, document.getElementById("app"))
