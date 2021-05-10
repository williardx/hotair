import React from "react"

import Background from "./Background"
import Cloud from "./Cloud"

const GOOGLE_COLORS = [
  0x4285f4,
  0x33b679,
  0xf4511e,
  0xf6bf26,
  0x8e24aa,
  0xd50000,
  0x3f51b5,
]

const POSITIONS = [
  [0, 0, 0],
  [0, 0.7, 0],
  [0, -0.7, 0],
  [1, 0, 0],
  [1, 0.7, 0],
  [1, -0.7, 0],
  [-1, 0, 0],
  [-1, 0.7, 0],
  [-1, -0.7, 0],
]

const numClouds = 3

const cycleArray = (arr) => {
  const originalFirst = GOOGLE_COLORS[0]
  for (var i = 0; i < GOOGLE_COLORS.length; i++) {
    if (i === GOOGLE_COLORS.length - 1) {
      GOOGLE_COLORS[i] = originalFirst
    } else {
      GOOGLE_COLORS[i] = GOOGLE_COLORS[i + 1]
    }
  }
  console.log(GOOGLE_COLORS)
  return GOOGLE_COLORS[0]
}

export default () => {
  return (
    <>
      <Background />
      {Array.from(Array(numClouds)).map((_, index) => (
        <Cloud
          size={[1, 1]}
          position={POSITIONS[index]}
          color={cycleArray(GOOGLE_COLORS)}
          key={index.toString()}
        />
      ))}
    </>
  )
}
