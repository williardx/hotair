import React, { useRef, useEffect, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  ShaderMaterial,
  UniformsUtils,
  ShaderLib,
  CanvasTexture,
  Frustum,
  Matrix4,
  Vector3,
  MeshBasicMaterial,
  TextureLoader,
} from "three"
import { useAssets, useTexture } from "~js/hooks"
import gui from "~js/helpers/gui"
import fragment from "~shaders/cloud.frag"
import vertex from "~shaders/cloud.vert"
import roundRect from "../../../../helpers/roundedRectangle"

const SIZES = {
  small: 75,
  medium: 200,
  large: 300,
}

/**
 * To go from opaque texture -> cloud texture
 * Start uDisplStrenght* at 0 and animate to larger value
 * Start alpha max output at alpha min input, animate to larger value
 */

export default ({ tile, size, shouldTransition, handleRemoveCloud }) => {
  const { text, color, position, id } = tile
  const { camera } = useThree()
  // Need a scaling factor because the camera is at a distance
  const tileScalingFactor = 1
  const tileHeight = tile.tileHeight * tileScalingFactor
  const tileWidth = tile.tileWidth * tileScalingFactor
  let tilePosition
  if (tile.x !== undefined && tile.y !== undefined) {
    // Convert screen coordinates to world space
    // https://stackoverflow.com/a/13091694
    var vec = new Vector3() // create once and reuse
    var pos = new Vector3() // create once and reuse

    // tile.x and tile.y are the coordinates of the top left corner
    // of the tile in calendar view. Adjust by 1/2 tile width and
    // tile height to align the centers of the calendar and cloud
    vec.set(
      ((tile.x + tileWidth / 2) / window.innerWidth) * 2 - 1,
      -((tile.y + tileHeight / 2) / window.innerHeight) * 2 + 1,
      0
    )
    vec.unproject(camera)
    vec.sub(camera.position).normalize()
    var distance = -camera.position.z / vec.z
    pos.copy(camera.position).add(vec.multiplyScalar(distance))
    tilePosition = [pos.x, pos.y, 0]
  } else {
    tilePosition = position
  }
  const group = useRef()
  const mesh = useRef()
  const [width, height] = size
  const maxBlurAmount = 20
  const maxTextWidth = 130
  const textVerticalOffset = 20
  const textXOffset = 10
  const textYOffset = 25

  const src2 = useAssets("images/clouds/2.jpg")
  const t2 = useTexture(src2)
  t2.repeat.set(width, height)

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
    const tilePosX = (canvas.width - tileWidth) / 2
    const tilePosY = (canvas.height - tileHeight) / 2
    roundRect(
      context,
      tilePosX,
      tilePosY,
      tileWidth,
      tileHeight,
      10,
      true,
      false
    )
    context.fillStyle = "white"
    const lines = getLines(context, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      context.fillText(
        lines[i],
        tilePosX + textXOffset,
        tilePosY + textYOffset + i * textVerticalOffset
      )
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
    const tilePosX = (ctx.canvas.width - tileWidth) / 2
    const tilePosY = (ctx.canvas.height - tileHeight) / 2
    roundRect(ctx, tilePosX, tilePosY, tileWidth, tileHeight, 10, true, false)
    ctx.filter = "none"
    ctx.fillStyle = "white"
    const lines = getLines(ctx, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(
        lines[i],
        tilePosX + textXOffset,
        tilePosY + textYOffset + i * textVerticalOffset
      )
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

  // const material = new MeshBasicMaterial({ map: t2 })

  useEffect(() => {
    if (material) {
      material.uniforms.uTxtCloudNoise.value = t2
    }
  }, [t2])

  useFrame(() => {
    if (material) {
      // Remove cloud from scene if cloud goes off screen
      const frustum = new Frustum()
      frustum.setFromMatrix(
        new Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse
        )
      )
      if (!frustum.containsPoint(mesh.current.position)) {
        handleRemoveCloud(id)
      } else {
        // return
        // Otherwise keep animating
        const scalingFactor = 0.5
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
      <mesh ref={mesh} position={tilePosition} scale={[width, height, 1]}>
        <planeBufferGeometry args={[1, 1, 5, 5]} attach="geometry" />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}
