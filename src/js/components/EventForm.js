import React, { useState, useCallback } from "react"

export default ({ onSubmit, isVisible }) => {
  const [text, setText] = useState("")
  const [size, setSize] = useState("small")
  const [color, setColor] = useState("#4285f4")
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
        <button
          onClick={(e) => {
            e.preventDefault()
            const tile = { text, size, color }
            onSubmit && onSubmit(tile)

            // Reset form
            setText("")
            setSize("small")
            setColor("#4285f4")
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
