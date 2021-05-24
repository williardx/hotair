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
      text: "THIS FUCKING PROJECT",
      size: "large",
      color: "#ff3232",
      position: [randomRange(-1.5, 1.5), randomRange(-1, 1), 0],
    },
    {
      text: "THIS FUCKING PROJECT",
      size: "large",
      color: "#33b679",
      position: [randomRange(-1.5, 1.5), randomRange(-1, 1), 0],
    },
    {
      text: "THIS FUCKING PROJECT",
      size: "large",
      color: "#f6bf26",
      position: [randomRange(-1.5, 1.5), randomRange(-1, 1), 0],
    },
  ])
  const [formVisibilityToggle, setFormVisibilityToggle] = useState(false)

  const handleAddEvent = (tile) => {
    setTiles([...tiles, tile])
    toggleFormVisibility()
  }

  const toggleFormVisibility = () => {
    setFormVisibilityToggle(!formVisibilityToggle)
  }

  return (
    <>
      <PlusButton />
      <EventForm isVisible={formVisibilityToggle} onSubmit={handleAddEvent} />
      <Canvas>
        <Camera />
        <Environment tiles={tiles} />
        {debugMode && <Sphere />}
      </Canvas>
    </>
  )
}

/**
 * render app
 */
render(<App />, document.getElementById("app"))
