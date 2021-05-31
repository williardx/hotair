import React, { useState, useRef } from "react"

export default ({
  numRows,
  pendingTile,
  setPendingTile,
  toggleFormVisibility,
}) => {
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

  const handleTouchStart = (e) => {
    const targets = document.elementsFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    const cell = targets.filter((obj) => obj?.className === "cell").pop()
    if (cell) {
      const touchStart = {
        row: cell.getAttribute("row"),
        col: cell.getAttribute("col"),
      }
      const day = parseInt(touchStart.col)
      const startTime = parseInt(touchStart.row)
      const endTime = parseInt(touchStart.row)
      setPendingTile({
        day,
        startTime,
        endTime,
        color: "#4285f4",
        text: "",
        id: Math.floor(Math.random() * 100000),
        opacity: 1,
      })
    }
  }

  const handleTouchMove = (e) => {
    const targets = document.elementsFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    const cell = targets.filter((obj) => obj?.className === "cell").pop()
    if (cell) {
      const touchMove = {
        row: parseInt(cell.getAttribute("row")),
        col: parseInt(cell.getAttribute("col")),
      }
      if (touchMove.row !== pendingTile.endTime) {
        setPendingTile({
          ...pendingTile,
          endTime: touchMove.row,
        })
      }
    }
  }

  const handleTouchEnd = () => {
    toggleFormVisibility()
  }

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="header">
        <h1 className="day">周一</h1>
      </div>
      <div className="header">
        <h1 className="day">周二</h1>
      </div>
      <div className="header">
        <h1 className="day">周三</h1>
      </div>
      <div className="header">
        <h1 className="day">周四</h1>
      </div>
      <div className="header">
        <h1 className="day">周五</h1>
      </div>
      <div className="header">
        <h1 className="day">周六</h1>
      </div>
      <div className="header">
        <h1 className="day">周日</h1>
      </div>
      {createRows()}
    </div>
  )
}
