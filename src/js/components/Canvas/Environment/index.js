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
      {tiles.length > 0 &&
        tiles.map((tile) => {
          return (
            <Cloud
              shouldTransition={shouldTransition}
              tile={tile}
              key={tile.id.toString()}
              handleRemoveCloud={handleRemoveCloud}
            />
          )
        })}
    </>
  )
}
