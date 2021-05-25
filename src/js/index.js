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
import EventForm from "~js/components/EventForm"
import PlusButton from "~js/components/PlusButton"
import CloseButton from "~js/components/CloseButton"
import Calendar from "~js/components/Calendar"

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

  const initialTiles = []
  for (let row = 0; row < 7; row++) {
    for (let col = 1; col < 13; col++) {
      initialTiles.push({
        text: col % 2 === 0 ? "work" : "𝚆𝙾𝚁𝚂𝙷𝙸𝙿 𝚂𝙰𝚃𝙰𝙽 𖤐",
        day: row,
        startTime: col * 2,
        endTime: col * 2 + 2,
        color: col % 2 === 0 ? "#4285f4" : "#ff3232",
      })
    }
  }

  // The set of all tiles in the project - these are definitely visible
  // in the calendar view
  const [tiles, setTiles] = useState([
    // {
    //   text: "𝚆𝙾𝚁𝚂𝙷𝙸𝙿 𝚂𝙰𝚃𝙰𝙽 𖤐",
    //   size: "large",
    //   color: "#ff3232",
    //   day: 3,
    //   startTime: 10,
    //   endTime: 15,
    //   position: [randomRange(-1.5, 1.5), randomRange(-1, 1), 0],
    // },
    // {
    //   text: "THIS FUCKING PROJECT",
    //   size: "large",
    //   color: "#33b679",
    //   position: [randomRange(-1.5, 1.5), randomRange(-1, 1), 0],
    // },
    // {
    //   text: "THIS FUCKING PROJECT",
    //   size: "large",
    //   color: "#f6bf26",
    //   position: [randomRange(-1.5, 1.5), randomRange(-1, 1), 0],
    // },
    // ...initialTiles,
  ])

  // Tiles that are queued up to be added to sky
  const [nextTiles, setNextTiles] = useState([])

  // Tiles that are in the sky
  const [clouds, setClouds] = useState([...tiles])

  const [calendarVisibilityToggle, setCalendarVisibilityToggle] =
    useState(false)

  const handleAddTile = (tile) => {
    setTiles([...tiles, tile])
    setNextTiles([...nextTiles, tile])
  }

  const toggleCalendarVisibility = () => {
    if (calendarVisibilityToggle) {
      // Add new tiles to the scene
      setNextTiles([])
      setClouds([...clouds, ...nextTiles])
    }
    setCalendarVisibilityToggle(!calendarVisibilityToggle)
  }

  return (
    <>
      <PlusButton onClick={toggleCalendarVisibility} />
      <Calendar
        tiles={tiles}
        isVisible={calendarVisibilityToggle}
        handleAddTile={handleAddTile}
        toggleCalendarVisibility={toggleCalendarVisibility}
      />
      <Canvas>
        <Camera />
        <Environment tiles={clouds} />
        {debugMode && <Sphere />}
      </Canvas>
    </>
  )
}

/**
 * render app
 */
render(<App />, document.getElementById("app"))
