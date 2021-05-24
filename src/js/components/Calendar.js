import React from "react"

export default ({ isVisible }) => {
  return (
    <div
      class="grid"
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 1000,
        display: isVisible ? "grid" : "none",
      }}
    >
      <div class="cell header">
        <h1 class="day">周日</h1>
      </div>
      <div class="cell header">
        <h1 class="day">周一</h1>
      </div>
      <div class="cell header">
        <h1 class="day">周二</h1>
      </div>
      <div class="cell header">
        <h1 class="day">周三</h1>
      </div>
      <div class="cell header">
        <h1 class="day">周四</h1>
      </div>
      <div class="cell header">
        <h1 class="day">周五</h1>
      </div>
      <div class="cell header">
        <h1 class="day">周六</h1>
      </div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      {/* <!-- Row --> */}
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
    </div>
  )
}
