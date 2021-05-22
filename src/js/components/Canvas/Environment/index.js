import React, { useState, useEffect } from "react"
import Background from "./Background"
import Cloud from "./Cloud"

const GOOGLE_COLORS_CSS = [
  "#4285f4",
  "#33b679",
  "#f4511e",
  "#f6bf26",
  "#cd60eb",
  "#ff3232",
]

const createPositions = (numPositions) => {
  const numCols = 7
  const numRows = 5
  const colStart = -0.91
  const rowStart = 0.7
  const colOffset = 0.325
  const rowOffset = 0.5
  return Array.from(Array(numPositions)).map((_, index) => {
    return [
      colStart + colOffset * (index % numCols),
      rowStart - rowOffset * (index % numRows),
      0,
    ]
  })
}

const TEXT = ["so busy", "hella busy", "太忙", "非常忙"]
// const SIZES = [75, 150, 250, 350]
const SIZES = {
  small: 75,
  medium: 200,
  large: 300,
}

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

export default ({ tiles }) => {
  const [shouldTransition, setShouldTransition] = useState(false)
  const POSITIONS = createPositions(tiles.length)

  useEffect(() => {
    const eventListener = (event) => {
      console.log(event)
      if (event.code === "Backslash") {
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
      {tiles.map((tile, index) => (
        <Cloud
          shouldTransition={shouldTransition}
          size={[1, 1]}
          position={POSITIONS[index]}
          color={cycleArray(GOOGLE_COLORS_CSS)}
          key={index.toString()}
          text={tile.text}
          tileHeight={SIZES[tile.size]}
        />
      ))}
    </>
  )
}
