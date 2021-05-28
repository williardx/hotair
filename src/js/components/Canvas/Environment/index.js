import React, { useState, useEffect } from "react"
import Background from "./Background"
import Cloud from "./Cloud"

export default ({ tiles, handleRemoveCloud }) => {
  const [shouldTransition, setShouldTransition] = useState(false)

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
      {tiles.map((tile) => {
        const scaleHeight = tile.tileHeight > 512 * 0.8 ? 2 : 1
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
