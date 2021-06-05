import "normalize.css"
import "~css/fonts.css"
import "~css/main.css"
import "core-js/stable"
import "regenerator-runtime/runtime"

import React, { useEffect, useCallback, useState } from "react"
import { render } from "react-dom"

import gui from "~js/helpers/gui"
import { useDebugMode } from "~js/hooks"

import Canvas from "~js/components/Canvas"
import Camera from "~js/components/Canvas/Camera"
import Sphere from "~js/components/Canvas/Sphere"
import Environment from "~js/components/Canvas/Environment"
import Calendar from "~js/components/Calendar"
import CalendarButton from "~js/components/CalendarButton"
import randomChoice from "~js/helpers/randomChoice"

/**
 * app
 */
const App = () => {
  const debugMode = useDebugMode()

  // useEffect(() => {
  //   gui.init()
  // }, [])

  const randomRange = (lower, upper) => {
    return lower + Math.random() * (upper - lower)
  }

  const [tiles, setTiles] = useState([
    {
      text: "life",
      size: "small",
      color: "#33b679",
      day: 2,
      startTime: 4,
      endTime: 9,
      id: 92001,
      opacity: 0,
      initNumOverlappingTiles: 0,
      numOverlappingTiles: 0,
    },
    {
      text: "work",
      size: "small",
      color: "#cd60eb",
      day: 4,
      startTime: 12,
      endTime: 18,
      id: 14100,
      opacity: 0,
      initNumOverlappingTiles: 0,
      numOverlappingTiles: 0,
    },
    {
      text: "THIS PROJECT",
      size: "small",
      color: "#f6bf26",
      day: 3,
      startTime: 12,
      endTime: 17,
      id: 60997,
      opacity: 0,
      initNumOverlappingTiles: 0,
      numOverlappingTiles: 0,
    },
    {
      text: "startup",
      size: "small",
      color: "#ff3232",
      day: 1,
      startTime: 4,
      endTime: 15,
      id: 97950,
      opacity: 0,
      initNumOverlappingTiles: 0,
      numOverlappingTiles: 0,
    },
    {
      text: "lol art",
      color: "#4285f4",
      day: 5,
      startTime: 6,
      endTime: 11,
      id: 89468,
      opacity: 0,
      initNumOverlappingTiles: 0,
      numOverlappingTiles: 0,
    },
    {
      text: "thinking thinking thinking",
      color: "#f4511e",
      day: 3,
      startTime: 5,
      endTime: 9,
      id: 64432,
      opacity: 1,
      initNumOverlappingTiles: 0,
      numOverlappingTiles: 0,
    },
  ])

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

  useEffect(() => {
    // Automatically add a new cloud when we have nothing new to show
    // and a cloud goes off screen
    const interval = setInterval(() => {
      if (clouds.length < maxNumClouds) {
        // Otherwise randomly pick from the tiles in the calendar
        const activeCloudIds = clouds.map((cloud) => cloud.id)
        const newCloud = randomChoice(
          tiles.filter((tile) => activeCloudIds.indexOf(tile.id) === -1)
        )
        setClouds([...clouds, newCloud])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [clouds])

  return (
    <>
      <CalendarButton onClick={toggleCalendarVisibility} />
      <Calendar
        tiles={tiles}
        nextTiles={nextTiles}
        setTiles={setTiles}
        isVisible={calendarVisibilityToggle}
        handleAddTile={handleAddTile}
        toggleCalendarVisibility={toggleCalendarVisibility}
        setNextTiles={setNextTiles}
      />
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
