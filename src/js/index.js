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

/**
 * app
 */
const App = () => {
  const debugMode = useDebugMode()

  // useEffect(() => {
  //   gui.init()
  // }, [])

  const [tiles, setTiles] = useState([
    {
      text: "Dang I was hanging out with this girl last night and she was really cool",
      size: "large",
      color: "#ff3232",
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
      <button
        onClick={toggleFormVisibility}
        style={{
          width: 100,
          height: 100,
          border: "none",
          position: "fixed",
          borderRadius: 100,
          bottom: 100,
          right: 100,
          backgroundColor: "#2693ff",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 80,
            position: "absolute",
            top: -2,
            left: 28,
          }}
        >
          +
        </div>
      </button>
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
