import React from "react"
import { BiX } from "react-icons/bi"

export default ({ handleClose }) => {
  return (
    <div id="help-modal">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <BiX
          style={{ cursor: "pointer" }}
          size={23}
          color="rgb(160 160 160)"
          onClick={handleClose}
        />
      </div>
      <br />
      <div>1. Think about how you spend your time.</div>
      <br />
      <div>
        2. Fill out your own schedule. Click on the calendar to add events.
      </div>
      <br />
      <div>3. Click on the cloud button.</div>
      <br />
      <br />
      <div style={{ color: "rgb(134 134 134)", textAlign: "right" }}>
        by{" "}
        <a
          style={{ textDecoration: "underline" }}
          href="https://willdoenlen.com"
        >
          Will Doenlen
        </a>
      </div>
    </div>
  )
}
