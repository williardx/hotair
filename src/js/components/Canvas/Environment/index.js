import React, { useState, useEffect } from "react"
import Background from "./Background"
import Cloud from "./Cloud"

const GOOGLE_COLORS = [
  0x4285f4, 0x33b679, 0xf4511e, 0xf6bf26, 0xcd60eb, 0xff3232, 0x6b7fdf,
]

const GOOGLE_COLORS_CSS = [
  "#4285f4",
  "#33b679",
  "#f4511e",
  "#f6bf26",
  "#cd60eb",
  "#ff3232",
  "#6b7fdf",
]

const POSITIONS = [
  [0, 0, 0],
  [0, 0.7, 0],
  [0, -0.7, 0],
  [1, 0, 0],
  [1, 0.7, 0],
  [1, -0.7, 0],
  [-1, 0, 0],
  [-1, 0.7, 0],
  [-1, -0.7, 0],
]

const MASK_NAMES = ["mask"]

const numClouds = 9

const cycleArray = (arr) => {
  const originalFirst = arr[0]
  for (var i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      arr[i] = originalFirst
    } else {
      arr[i] = arr[i + 1]
    }
  }
  return arr[0]
}

export default () => {
  const [shouldTransition, setShouldTransition] = useState(false)

  useEffect(() => {
    const eventListener = (event) => {
      console.log(event)
      if (event.keyCode === 32) {
        setShouldTransition(true)
      }
    }
    window.addEventListener("keypress", eventListener)

    return () => {
      element.removeEventListener("keypress", eventListener)
    }
  }, [])

  return (
    <>
      <Background shouldTransition={shouldTransition} />
      {Array.from(Array(numClouds)).map((_, index) => (
        <Cloud
          shouldTransition={shouldTransition}
          size={[1, 1]}
          position={POSITIONS[index]}
          color={cycleArray(GOOGLE_COLORS_CSS)}
          key={index.toString()}
          maskName={cycleArray(MASK_NAMES)}
        />
      ))}
    </>
  )
}
