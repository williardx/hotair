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
  const originalFirst = arr[0]
  for (var i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      arr[i] = originalFirst
    } else {
      arr[i] = arr[i + 1]
    }
  }
  return arr[0]
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
