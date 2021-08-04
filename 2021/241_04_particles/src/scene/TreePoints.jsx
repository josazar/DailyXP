import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import vertexShader from '../glsl/emeter_vs.glsl?raw'
import fragmentShader from '../glsl/emeter_fs.glsl?raw'
import { Vector2, Vector3 } from 'three'

import useStore from '../store'
// import treeURL from './3D/tree.ply'



const uniforms = {
  uTime: { type: "f", value: 0 },
  uSpeed: { type: "f", value: 2 },
  frequency: { type: "f", value: 0.12 },
  amplitude: { type: "f", value: 2 },
  uCursorPos: { value: new Vector3(0,0,0)},
  u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight)}
}

const CloudPoints = ({bufferGeometry}) => {
  const [nbParticles, setNbParticles] = useState(150000)

  const ref = useRef()

  // Material
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial()
    material.uniforms = uniforms
    material.vertexShader = vertexShader
    material.fragmentShader = fragmentShader

    return material
  }, [nbParticles])


  useFrame(({ clock }) => {
    const a = clock.getElapsedTime()
    uniforms.uTime.value = a
    uniforms.uCursorPos.value = useStore.getState().pointerSpace
  })


  return (
    <points geometry={bufferGeometry} material={shaderMaterial} ref={ref} position={[0,0,0]} ></points>
  )

}

export default CloudPoints
