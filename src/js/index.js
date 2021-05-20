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

/**
 * app
 */
const App = () => {
  const debugMode = useDebugMode()

  // useEffect(() => {
  //   gui.init()
  // }, [])

  const [tiles, setTiles] = useState([])

  const handleAddEvent = useCallback(() => {
    const tile = { text: "Hello" }
    setTiles([...tiles, tile])
  }, [tiles, setTiles])

  return (
    <>
      <button
        onClick={handleAddEvent}
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
