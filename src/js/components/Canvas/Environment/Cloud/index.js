import React, { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { ShaderMaterial, UniformsUtils, ShaderLib, CanvasTexture } from "three"
import { useAssets, useTexture } from "~js/hooks"
import gui from "~js/helpers/gui"
import fragment from "~shaders/cloud.frag"
import vertex from "~shaders/cloud.vert"
import roundRect from "../../../../helpers/roundedRectangle"

/**
 * To go from opaque texture -> cloud texture
 * Start uDisplStrenght* at 0 and animate to larger value
 * Start alpha max output at alpha min input, animate to larger value
 */

export default ({
  size,
  position,
  color,
  shouldTransition,
  text,
  tileHeight,
}) => {
  const group = useRef()
  const mesh = useRef()
  const [width, height] = size
  const maxBlurAmount = 20
  const tileWidth = 150
  const maxTextWidth = 130
  const textVerticalOffset = 20

  const src2 = useAssets("images/clouds/2.jpg")
  const t2 = useTexture(src2)

  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ")
    var lines = []
    var currentLine = words[0]

    for (var i = 1; i < words.length; i++) {
      var word = words[i]
      var width = ctx.measureText(currentLine + " " + word).width
      if (width < maxWidth) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = 512
    canvas.height = 512
    context.font = "18pt Roboto"
    context.fillStyle = color
    roundRect(context, 140, 120, tileWidth, tileHeight, 10, true, false)
    context.fillStyle = "white"
    const lines = getLines(context, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], 150, 170 + i * textVerticalOffset)
    }
    context.blurAmount = 0
    context.brightnessAmount = 1
    context.borderRadius = 10
    return new CanvasTexture(canvas)
  }, [color])

  const transitionCanvas = (ctx, scalingFactor = 1) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.blurAmount += 0.03 * scalingFactor
    ctx.brightnessAmount += 0.001 * scalingFactor
    ctx.filter = `blur(${ctx.blurAmount}px) brightness(${ctx.brightnessAmount})`
    ctx.fillStyle = color
    roundRect(ctx, 140, 120, tileWidth, tileHeight, 10, true, false)
    ctx.filter = "none"
    ctx.fillStyle = "white"
    const lines = getLines(ctx, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 150, 170 + i * textVerticalOffset)
    }
  }

  const myUniforms = useMemo(
    () => ({
      // rotation: { value: Math.PI / 2 },
      uTime: { value: Math.random() * 100000 },
      uTxtCloudNoise: { value: t2 },
      uFac1: { value: 17.8 },
      uFac2: { value: 2.7 },
      uTimeFactor1: { value: 0.002 },
      uTimeFactor2: { value: 0.0015 },
      uDisplStrenght1: { value: 0 },
      uDisplStrenght2: { value: 0 },
      alphaMaxOutput: { value: 0.2 },
      uColorFactor: { value: 0.6 },
      uLevelsMinInput: { value: 0.2 },
      uGamma: { value: 3 },
      canvasTexture: { type: "t", value: canvasTexture },
    }),
    []
  )

  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      uniforms: {
        ...UniformsUtils.clone(ShaderLib.sprite.uniforms),
        ...myUniforms,
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    })

    return mat
  }, [])

  useEffect(() => {
    if (material) {
      material.uniforms.uTxtCloudNoise.value = t2
    }
  }, [t2])

  useFrame(() => {
    if (material) {
      const scalingFactor = 3
      material.uniforms.uTime.value += 1
      const ctx = material.uniforms.canvasTexture.value.image.getContext("2d")
      if (ctx.blurAmount < maxBlurAmount) {
        transitionCanvas(ctx, scalingFactor)
        material.uniforms.canvasTexture.value.needsUpdate = true
      }

      if (material.uniforms.uDisplStrenght1.value < 0.04) {
        material.uniforms.uDisplStrenght1.value += 0.00015 * scalingFactor
      }
      if (material.uniforms.uDisplStrenght2.value < 0.08) {
        material.uniforms.uDisplStrenght2.value += 0.0003 * scalingFactor
      }
      if (material.uniforms.alphaMaxOutput.value < 0.7) {
        material.uniforms.alphaMaxOutput.value += 0.002 * scalingFactor
      }
      mesh.current.position.x += 0.0001
    }
  })

  /**
   * DAT GUI
   */
  // useEffect(() => {
  //   if (material) {
  //     gui.get((gui) => {
  //       gui
  //         .add(material.uniforms.uFac1, "value", 0.00001, 30)
  //         .step(0.1)
  //         .name("1-ScaleFactor")
  //       gui
  //         .add(material.uniforms.uTimeFactor1, "value", 0.00001, 0.009)
  //         .step(0.0001)
  //         .name("1-TimeFactor")
  //       gui
  //         .add(material.uniforms.uDisplStrenght1, "value", 0.00001, 0.3)
  //         .step(0.01)
  //         .name("1-Strength")
  //       gui
  //         .add(material.uniforms.uTimeFactor2, "value", 0.00001, 0.009)
  //         .step(0.0001)
  //         .name("2-TimeFactor")
  //       gui
  //         .add(material.uniforms.uFac2, "value", 0.00001, 100)
  //         .name("2-ScaleFactor")
  //       gui
  //         .add(material.uniforms.uDisplStrenght2, "value", 0.00001, 0.3)
  //         .step(0.01)
  //         .name("2-Strength")
  //       gui
  //         .add(material.uniforms.uColorFactor, "value", 0.00001, 1)
  //         .step(0.01)
  //         .name("Color factor")
  //       gui
  //         .add(material.uniforms.uLevelsMinInput, "value", 0.00001, 1)
  //         .step(0.01)
  //         .name("Levels min input")
  //       gui
  //         .add(material.uniforms.uGamma, "value", 0.00001, 3)
  //         .step(0.01)
  //         .name("Gamma")
  //     })
  //   }
  // }, [material])

  return (
    <group ref={group}>
      <mesh ref={mesh} position={position} scale={[width, height, 1]}>
        <planeBufferGeometry args={[1.0, 1.0, 5, 5]} attach="geometry" />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}
