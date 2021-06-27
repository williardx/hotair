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
} from "three"
import { useAssets, useTexture } from "~js/hooks"
import fragment from "~shaders/cloud.frag"
import vertex from "~shaders/cloud.vert"
import roundRect from "~js/helpers/roundedRectangle"
import getLines from "~js/helpers/getLines"
import { NUM_ROWS } from "~js/constants"
/**
 * To go from opaque texture -> cloud texture
 * Start uDisplStrenght* at 0 and animate to larger value
 * Start alpha max output at alpha min input, animate to larger value
 */

export default ({ tile, handleRemoveCloud }) => {
  const { text, color, id, startTime, endTime, day, position } = tile
  const { camera } = useThree()
  // Need a scaling factor because the camera is at a distance
  const calendarColumnWidthPct = 1 / 7
  const calendarRowHeightPct = 1 / NUM_ROWS
  const tileHeight =
    window.innerHeight * calendarRowHeightPct * (endTime - 1 - startTime + 1)
  const scaleWidth = 1
  const scaleHeight = tileHeight > 512 * 0.8 ? 2 : 1
  const fullTileWidth = calendarColumnWidthPct * window.innerWidth * 0.85
  const tileWidth = fullTileWidth
  const tileX = window.innerWidth * calendarColumnWidthPct * day
  const tileY = window.innerHeight * calendarRowHeightPct * (startTime + 2)

  // Convert screen coordinates to world space
  // https://stackoverflow.com/a/13091694
  const vec = new Vector3() // create once and reuse
  const pos = new Vector3() // create once and reuse

  // tileX and tileY are the coordinates of the top left corner
  // of the tile in calendar view. Adjust by 1/2 tile width and
  // tile height to align the centers of the calendar and cloud
  vec.set(
    ((tileX + tileWidth / 2) / window.innerWidth) * 2 - 1,
    -((tileY + tileHeight / 2) / window.innerHeight) * 2 + 1,
    0,
  )
  vec.unproject(camera)
  vec.sub(camera.position).normalize()
  const distance = -camera.position.z / vec.z
  pos.copy(camera.position).add(vec.multiplyScalar(distance))
  const tilePosition = [pos.x, pos.y, 0]

  const group = useRef()
  const mesh = useRef()
  const initialOpacity = tile.opacity
  const maxBlurAmount = 20
  const maxTextWidth = tileWidth - 30
  const textVerticalOffset = 25
  const textXOffset = 15
  const textYOffset = 30

  const src2 = useAssets("images/clouds/2.jpg")
  const t2 = useTexture(src2)
  t2.repeat.set(scaleWidth, scaleHeight)

  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = 512 * scaleWidth
    canvas.height = 512 * scaleHeight
    context.globalAlpha = initialOpacity
    context.globalAlphaAnimation = initialOpacity
    context.font = "14pt NotoSansSC"
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
      false,
    )
    context.fillStyle = "white"
    const lines = getLines(context, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      const offsetY = textYOffset + i * textVerticalOffset
      if (offsetY > tileHeight) {
        break
      }
      context.fillText(lines[i], tilePosX + textXOffset, tilePosY + offsetY)
    }
    context.blurAmount = 0
    context.brightnessAmount = 1
    context.borderRadius = 10
    context.textAlpha = 1
    context.textAlphaAnimation = 0
    return new CanvasTexture(canvas)
  }, [
    color,
    initialOpacity,
    maxTextWidth,
    scaleHeight,
    text,
    tileHeight,
    tileWidth,
  ])

  function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5)
  }

  const transitionCanvasToCloud = (ctx, scalingFactor = 1) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    if (ctx.globalAlphaAnimation < 1) {
      ctx.globalAlphaAnimation += 0.01 * scalingFactor
      ctx.globalAlpha = easeOutQuint(ctx.globalAlphaAnimation)
    }
    if (ctx.textAlphaAnimation < 1) {
      ctx.textAlphaAnimation += 0.002 * scalingFactor
      ctx.textAlpha = 1 - easeInQuint(ctx.textAlphaAnimation)
    }
    ctx.blurAmount += 0.03 * scalingFactor
    ctx.brightnessAmount += 0.001 * scalingFactor
    ctx.filter = `blur(${ctx.blurAmount}px) brightness(${ctx.brightnessAmount})`
    ctx.fillStyle = color
    const tilePosX = (ctx.canvas.width - tileWidth) / 2
    const tilePosY = (ctx.canvas.height - tileHeight) / 2
    roundRect(ctx, tilePosX, tilePosY, tileWidth, tileHeight, 10, true, false)
    ctx.filter = "none"
    ctx.fillStyle = `rgba(255, 255, 255, ${ctx.textAlpha})`
    const lines = getLines(ctx, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      const offsetY = textYOffset + i * textVerticalOffset
      if (offsetY > tileHeight) {
        break
      }
      ctx.fillText(lines[i], tilePosX + textXOffset, tilePosY + offsetY)
    }
  }

  function easeInQuint(x) {
    return x * x * x * x * x
  }

  const fadeCanvasOut = (ctx, scalingFactor = 1) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    if (ctx.globalAlphaAnimation > 0) {
      ctx.globalAlphaAnimation -= 0.01
      ctx.globalAlpha = easeInQuint(ctx.globalAlphaAnimation)
    }
    ctx.filter = `blur(${ctx.blurAmount}px) brightness(${ctx.brightnessAmount})`
    ctx.fillStyle = color
    const tilePosX = (ctx.canvas.width - tileWidth) / 2
    const tilePosY = (ctx.canvas.height - tileHeight) / 2
    roundRect(ctx, tilePosX, tilePosY, tileWidth, tileHeight, 10, true, false)
    ctx.filter = "none"
    ctx.fillStyle = "white"
    const lines = getLines(ctx, text, maxTextWidth)
    for (let i = 0; i < lines.length; i++) {
      const offsetY = textYOffset + i * textVerticalOffset
      if (offsetY > tileHeight) {
        break
      }
      ctx.fillText(lines[i], tilePosX + textXOffset, tilePosY + offsetY)
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
    [canvasTexture, t2],
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
  }, [myUniforms])

  // const material = new MeshBasicMaterial({ map: t2 })

  useEffect(() => {
    if (material) {
      material.uniforms.uTxtCloudNoise.value = t2
    }
  }, [material, t2])

  useFrame(() => {
    if (material) {
      // Remove cloud from scene if cloud goes off screen
      const frustum = new Frustum()
      frustum.setFromMatrix(
        new Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      )

      // Otherwise keep animating
      const scalingFactor = 3
      material.uniforms.uTime.value += 1
      const ctx = material.uniforms.canvasTexture.value.image.getContext("2d")

      if (!frustum.containsPoint(mesh.current.position)) {
        const ctx = material.uniforms.canvasTexture.value.image.getContext("2d")
        fadeCanvasOut(ctx)
        material.uniforms.canvasTexture.value.needsUpdate = true
        if (ctx.globalAlphaAnimation <= 0) {
          handleRemoveCloud(id)
        }
      } else {
        if (ctx.blurAmount < maxBlurAmount) {
          transitionCanvasToCloud(ctx, scalingFactor)
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
      }

      mesh.current.position.y += 0.0005
    }
  })

  return (
    <group ref={group}>
      <mesh ref={mesh} position={tilePosition} scale={[1, scaleHeight, 1]}>
        <planeBufferGeometry args={[1, 1, 5, 5]} attach="geometry" />
        <primitive object={material} attach="material" opacity={0.5} />
      </mesh>
    </group>
  )
}
