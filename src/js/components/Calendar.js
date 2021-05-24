import React from "react"

const Calendar = ({ isVisible }) => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 1000,
        display: isVisible ? "flex" : "none",
      }}
    >
      {/* <Sidebar /> */}
      <Grid numRows={12} />
    </div>
  )
}

const Sidebar = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "300px",
      }}
    ></div>
  )
}

const Grid = ({ numRows }) => {
  const createRows = () => {
    return Array.from(Array(numRows)).flatMap(() => {
      return [
        <div className="cell"></div>,
        <div className="cell"></div>,
        <div className="cell"></div>,
        <div className="cell"></div>,
        <div className="cell"></div>,
        <div className="cell"></div>,
        <div className="cell"></div>,
      ]
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

export default Calendar
