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

export default ({ tiles, handleRemoveCloud }) => {
  const [shouldTransition, setShouldTransition] = useState(false)
  const POSITIONS = createPositions(tiles.length)

  useEffect(() => {
    const eventListener = (event) => {
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
      {tiles.map((tile, index) => {
        console.log("------------tileHeight", tile.tileHeight)
        const scaleHeight = tile.tileHeight > 512 * 0.8 ? 2 : 1
        console.log("----------scaleHeight", scaleHeight)
        return (
          <Cloud
            shouldTransition={shouldTransition}
            size={[1, scaleHeight]}
            tile={tile}
            key={tile.id.toString()}
            handleRemoveCloud={handleRemoveCloud}
          />
        )
      })}
    </>
  )
}
