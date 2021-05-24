import React, { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { CanvasTexture, BackSide } from "three"

export default ({ shouldTransition }) => {
  const mesh = useRef()
  const radius = 8

  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 32
    const context = canvas.getContext("2d")
    const gradient = context.createLinearGradient(0, 0, 0, 32)
    gradient.addColorStop(0.0, "#014a84")
    gradient.addColorStop(0.5, "#0561a0")
    gradient.addColorStop(1.0, "#437ab6")
    context.fillStyle = gradient
    context.fillRect(0, 0, 1, 32)

    return new CanvasTexture(canvas)
  }, [])

  useFrame(() => {
    if (shouldTransition && mesh.current.material.opacity > 0) {
      mesh.current.material.opacity -= 0.008
    }
  })

  return (
    <>
      <mesh ref={mesh} rotation={[0, 0, 0.12]}>
        <sphereBufferGeometry attach="geometry" args={[radius, 30, 30]} />
        <meshBasicMaterial
          map={canvasTexture}
          attach="material"
          side={BackSide}
          transparent
          opacity={1}
        />
      </mesh>
    </>
  )
}
