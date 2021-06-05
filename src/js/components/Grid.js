import React from "react"

export default ({ numRows }) => {
  const debugGrid = false
  // function dates(current) {
  //   var week = new Array()
  //   // Starting Monday not Sunday
  //   current.setDate(current.getDate() - current.getDay() + 1)
  //   for (var i = 0; i < 7; i++) {
  //     week.push(new Date(current))
  //     current.setDate(current.getDate() + 1)
  //   }
  //   return week
  // }

  // const createHeaderRow = () => {
  //   return dates(new Date()).map((d) => (
  //     <div className="cell header">
  //       <h1 className="day">
  //         {d.toLocaleDateString("zh-ZH", { month: "long", day: "numeric" })}
  //       </h1>
  //     </div>
  //   ))
  // }

  const createRows = () => {
    return Array.from(Array(numRows)).flatMap((val, rowIndex) => {
      return Array.from(Array(7)).map((_, colIndex) => {
        return (
          <div
            className="cell"
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
