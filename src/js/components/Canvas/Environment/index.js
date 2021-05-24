import React, { useState, useEffect } from "react"
import Background from "./Background"
import Cloud from "./Cloud"

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

const SIZES = {
  small: 75,
  medium: 200,
  large: 300,
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
          position={tile.position}
          color={tile.color}
          key={index.toString()}
          text={tile.text}
          tileHeight={SIZES[tile.size]}
        />
      ))}
    </>
  )
}
