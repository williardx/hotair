import React, { useRef, useMemo } from "react"
import { useFrame } from "react-three-fiber"
import { BackSide, Color, ShaderMaterial } from "three"
import { useRawData } from "~js/hooks"

import vertex from "~shaders/default.vert"
import fragment from "~shaders/environment.frag"

// // Sky

// const canvas = document.createElement("canvas");
// canvas.width = 1;
// canvas.height = 32;

// const context = canvas.getContext("2d");
// const gradient = context.createLinearGradient(0, 0, 0, 32);
// gradient.addColorStop(0.0, "#014a84");
// gradient.addColorStop(0.5, "#0561a0");
// gradient.addColorStop(1.0, "#437ab6");
// context.fillStyle = gradient;
// context.fillRect(0, 0, 1, 32);

// const skyMaterial = new THREE.MeshBasicMaterial({
//   map: new THREE.CanvasTexture(canvas),
//   side: THREE.BackSide,
//   transparent: true,
//   opacity: 0,
// });
// sky = new THREE.Mesh(new THREE.SphereGeometry(10), skyMaterial);
// window.sky = sky;
// scene.add(sky);

export default () => {
  const mesh = useRef()
  const colorSteps = useRawData("colors.gradients")
  const radius = 8

  const uniforms = useMemo(() => {
    return {
      uAlpha: { value: 0 },
      uTopColor: { value: new Color(colorSteps[0].top) },
      uBottomColor: { value: new Color(colorSteps[0].bottom) },
      uSpot1Color: { value: new Color(colorSteps[0].spot1) },
      uSpot1Position: { value: [0.4, 0.7] },
      uSpot2Color: { value: new Color(colorSteps[0].spot2) },
      uSpot2Position: { value: [0.6, 0.4] },
    }
  }, [])

  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      transparent: true,
      uniforms: uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
    })

    return mat
  }, [])

  useFrame(() => {
    if (material.uniforms.uAlpha.value < 1) {
      material.uniforms.uAlpha.value += 0.008
    }
  })

  return (
    <>
      <mesh ref={mesh} rotation={[0, 0, 0.12]}>
        <sphereBufferGeometry attach="geometry" args={[radius, 30, 30]} />
        <primitive object={material} side={BackSide} attach="material" />
      </mesh>
    </>
  )
}
