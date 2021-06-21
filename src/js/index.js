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
  const cloudsInitialized = useRef(false)
  const maxNumClouds = 6

  const [calendarVisibilityToggle, setCalendarVisibilityToggle] =
    useState(false)

  const handleAddTile = (tile) => {
    setNextTiles([...nextTiles, tile])
  }

  const handleRemoveCloud = (cloudID) => {
    setClouds([...clouds.filter((activeCloud) => cloudID !== activeCloud.id)])
  }

  const toggleCalendarVisibility = () => {
    if (calendarVisibilityToggle && nextTiles.length > 0) {
      const numTilesToAdd = Math.min(maxNumClouds, nextTiles.length)
      const currentClouds = [
        ...clouds.slice(0, clouds.length - numTilesToAdd),
        ...nextTiles.slice(0, numTilesToAdd),
      ]

      // Put new user-generated tiles at the front of the line since
      // they're more likely to be there
      setTiles([...tiles, ...nextTiles])
      setNextTiles([])
      setClouds(currentClouds)
      setNextClouds([...nextTiles.slice(numTilesToAdd), ...nextClouds])
      if (!cloudsInitialized.current) {
        cloudsInitialized.current = true
      }
    }
    setCalendarVisibilityToggle(!calendarVisibilityToggle)
  }

  const addCloudsToSky = useCallback(() => {
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
      }
    }
  }, [clouds, nextClouds, tiles])

  useEffect(() => {
    setTimeout(() => {
      if (!cloudsInitialized.current) {
        addCloudsToSky()
        cloudsInitialized.current = true
      }
    }, 5000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Automatically add a new cloud when we have nothing new to show
    // and a cloud goes off screen
    const interval = setInterval(addCloudsToSky, 30000)
    return () => clearInterval(interval)
  }, [addCloudsToSky])

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
