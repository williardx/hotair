import React, { useState, useCallback } from "react"

export default ({ onSubmit, isVisible }) => {
  const [text, setText] = useState("")
  const [size, setSize] = useState("small")
  const onTextInputChange = useCallback(
    (e) => {
      setText(e.target.value)
    },
    [setText]
  )

  const onSelectInputChange = (e) => {
    setSize(e.target.value)
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
        <select value={size} onChange={onSelectInputChange}>
          <option value="small">A little</option>
          <option value="medium">A normal amount</option>
          <option value="large">A lot</option>
        </select>
        <button
          onClick={(e) => {
            e.preventDefault()
            const tile = { text: text, size: size }
            onSubmit && onSubmit(tile)

            // Reset form
            setText("")
            setSize("small")
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
