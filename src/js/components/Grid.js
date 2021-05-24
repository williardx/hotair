import React from "react"

export default ({ numRows }) => {
  const createRows = () => {
    return Array.from(Array(numRows)).flatMap((val, rowIndex) => {
      return Array.from(Array(7)).map((_, colIndex) => {
        return <div key={`${rowIndex}-${colIndex}`} className="cell"></div>
      })
    })
  }
  return (
    <div className="grid">
      <div className="cell header">
        <h1 className="day">周日</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周一</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周二</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周三</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周四</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周五</h1>
      </div>
      <div className="cell header">
        <h1 className="day">周六</h1>
      </div>
      {createRows()}
    </div>
  )
}
