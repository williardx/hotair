import "normalize.css"
import "~css/main.css"
import "core-js/stable"
import "regenerator-runtime/runtime"

import React, { useEffect, useCallback, useState } from "react"
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

/**
 * app
 */
const App = () => {
  const debugMode = useDebugMode()
  const initialTiles = calendarTiler([
    {
      text: "asdf",
      color: "#cd60eb",
      day: 2,
      startTime: 7,
      endTime: 10,
      id: 61124,
      opacity: 1,
    },
    {
      text: "ghghgh",
      color: "#33b679",
      day: 2,
      startTime: 7,
      endTime: 10,
      id: 61125,
      opacity: 1,
    },
  ])

  const [tiles, setTiles] = useState(initialTiles)

  // Tiles that are queued up to be added to sky
  const [nextTiles, setNextTiles] = useState([])

  // Tiles that are in the sky
  const [clouds, setClouds] = useState([])
  const maxNumClouds = 3

  const [calendarVisibilityToggle, setCalendarVisibilityToggle] = useState(true)

  const handleAddTile = (tile) => {
    setNextTiles([...nextTiles, tile])
  }

  const handleRemoveCloud = (cloudID) => {
    setClouds([...clouds.filter((activeCloud) => cloudID !== activeCloud.id)])
  }

  const toggleCalendarVisibility = () => {
    if (calendarVisibilityToggle && nextTiles.length > 0) {
      let nextClouds
      if (clouds.length + nextTiles.length <= maxNumClouds) {
        nextClouds = [...clouds, ...nextTiles]
      } else {
        nextClouds = [...clouds.slice(nextTiles.length), ...nextTiles]
      }
      setTiles([...tiles, ...nextTiles])
      setNextTiles([])
      setClouds(nextClouds)
    }
    setCalendarVisibilityToggle(!calendarVisibilityToggle)
  }

  const addCloudsToSky = useCallback(() => {
    if (tiles.length > 0 && clouds.length < maxNumClouds) {
      // Otherwise randomly pick from the tiles in the calendar
      const activeCloudIds = clouds.map((cloud) => cloud.id)
      const newCloud = randomChoice(
        tiles.filter((tile) => activeCloudIds.indexOf(tile.id) === -1),
      )
      setClouds([...clouds, newCloud])
    }
  }, [clouds, tiles])

  useEffect(() => {
    setTimeout(addCloudsToSky, 5000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Automatically add a new cloud when we have nothing new to show
    // and a cloud goes off screen
    const interval = setInterval(addCloudsToSky, 60000)
    return () => clearInterval(interval)
  }, [addCloudsToSky])

  return (
    <>
      <CalendarButton onClick={toggleCalendarVisibility} />
      {calendarVisibilityToggle && (
        <Calendar
          tiles={tiles}
          nextTiles={nextTiles}
          setTiles={setTiles}
          isVisible={calendarVisibilityToggle}
          handleAddTile={handleAddTile}
          toggleCalendarVisibility={toggleCalendarVisibility}
          setNextTiles={setNextTiles}
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
