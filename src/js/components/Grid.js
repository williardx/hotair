import React from "react"
import { NUM_ROWS } from "~js/constants"

export default ({ disabled }) => {
  const debugGrid = false
  const createRows = () => {
    return Array.from(Array(NUM_ROWS)).flatMap((val, rowIndex) => {
      return Array.from(Array(7)).map((_, colIndex) => {
        return (
          <div
            className={`cell${disabled ? " disabled" : ""}`}
            row={rowIndex}
            col={colIndex}
            key={`${rowIndex}-${colIndex}`}
            style={{
              borderRight: "1px solid #eee",
              borderBottom: rowIndex % 2 === 1 ? "1px solid #eee" : "none",
            }}
          >
            {debugGrid ? `(${rowIndex}, ${colIndex})` : ""}
          </div>
        )
      })
    })
  }

  return (
    <div
      className="grid"
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
    >
      <div className="header">
        <h1 className="day">Sun</h1>
      </div>
      <div className="header">
        <h1 className="day">Mon</h1>
      </div>
      <div className="header">
        <h1 className="day">Tue</h1>
      </div>
      <div className="header">
        <h1 className="day">Wed</h1>
      </div>
      <div className="header">
        <h1 className="day">Thu</h1>
      </div>
      <div className="header">
        <h1 className="day">Fri</h1>
      </div>
      <div className="header">
        <h1 className="day">Sat</h1>
      </div>
      {createRows()}
    </div>
  )
}
