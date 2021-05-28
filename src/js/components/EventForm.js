import React, { useState, useCallback } from "react"

export default ({ onSubmit, isVisible }) => {
  const initialState = {
    text: "",
    size: "small",
    color: "#4285f4",
    day: 0,
    startTime: 0,
    endTime: 1,
  }

  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / 13

  const [text, setText] = useState(initialState.text)
  const [size, setSize] = useState(initialState.size)
  const [color, setColor] = useState(initialState.color)
  const [day, setDay] = useState(initialState.day)
  const [startTime, setStartTime] = useState(initialState.startTime)
  const [endTime, setEndTime] = useState(initialState.endTime)

  const onTextInputChange = useCallback(
    (e) => {
      setText(e.target.value)
    },
    [setText]
  )

  const onSelectSizeChange = (e) => {
    setSize(e.target.value)
  }

  const onSelectColorChange = (e) => {
    setColor(e.target.value)
  }

  const onSelectDayChange = (e) => {
    setDay(e.target.value)
  }

  const onSelectStartTimeChange = (e) => {
    setStartTime(e.target.value)
  }

  const onSelectEndTimeChange = (e) => {
    setEndTime(e.target.value)
  }

  const resetForm = () => {
    setText(initialState.text)
    setSize(initialState.size)
    setColor(initialState.color)
    setDay(initialState.day)
    setStartTime(initialState.startTime)
    setEndTime(initialState.endTime)
  }

  const generateTimeSeries = (hourStart, hourEnd, step) => {
    const dt = new Date(1970, 0, 1, hourStart)
    const rc = []
    let counter = 0
    while (dt.getHours() < hourEnd) {
      rc.push({
        value: counter,
        display: dt.toLocaleTimeString("en-US"),
      })
      dt.setMinutes(dt.getMinutes() + step)
      counter += 1
    }
    return rc
  }

  const times = generateTimeSeries(7, 22, 30)

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: 1000,
        display: isVisible ? "flex" : "none",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>What are you busy with?</label>
        <input onChange={onTextInputChange} value={text} type="text" />
        <label>How much time does it take?</label>
        <select value={size} onChange={onSelectSizeChange}>
          <option value="small">A little</option>
          <option value="medium">A normal amount</option>
          <option value="large">A lot</option>
        </select>
        <label>Choose event color</label>
        <select value={size} onChange={onSelectColorChange}>
          <option value="#4285f4">Blue</option>
          <option value="#33b679">Green</option>
          <option value="#f4511e">Orange</option>
          <option value="#f6bf26">Yellow</option>
          <option value="#cd60eb">Purple</option>
          <option value="#ff3232">Red</option>
        </select>
        <label>Choose day</label>
        <select value={day} onChange={onSelectDayChange}>
          <option value={0}>周日</option>
          <option value={1}>周一</option>
          <option value={2}>周二</option>
          <option value={3}>周三</option>
          <option value={4}>周四</option>
          <option value={5}>周五</option>
          <option value={6}>周六</option>
        </select>
        <label>Choose start time</label>
        <select value={startTime} onChange={onSelectStartTimeChange}>
          {times.map((t) => (
            <option key={"end" + t.display} value={t.value}>
              {t.display}
            </option>
          ))}
        </select>
        <label>Choose end time</label>
        <select value={endTime} onChange={onSelectEndTimeChange}>
          {times.map((t) => (
            <option key={"start" + t.display} value={t.value}>
              {t.display}
            </option>
          ))}
        </select>
        <button
          onClick={(e) => {
            e.preventDefault()
            const tile = {
              text,
              size,
              color,
              day,
              startTime,
              endTime,
              tileHeight:
                (window.innerHeight *
                  calendarRowHeightPct *
                  (endTime - startTime)) /
                2,
              tileWidth: calendarColumnWidthPct * window.innerWidth * 0.9,
              x: window.innerWidth * calendarColumnWidthPct * day + 10,
              y: (window.innerHeight * calendarRowHeightPct * startTime) / 2,
              id: Math.floor(Math.random() * 100000),
            }
            console.log(tile)
            onSubmit && onSubmit(tile)
            resetForm()
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
