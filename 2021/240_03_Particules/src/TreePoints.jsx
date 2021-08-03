import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import vertexShader from './glsl/emeter_vs.glsl?raw'
import fragmentShader from './glsl/emeter_fs.glsl?raw'
import { generatePositionsFromFormula } from './@utils/CloudPoints'
import ParametricEquations from './@utils/ParametricEquations'
import { Vector2 } from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

import useStore from './store'
// import treeURL from './3D/tree.ply'



const uniforms = {
  uTime: { type: "f", value: 0 },
  uSpeed: { type: "f", value: 2 },
  frequency: { type: "f", value: 0.12 },
  amplitude: { type: "f", value: 2 },
  uMouse: { value: new Vector2(0,0)},
  u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight)}
}

const TreePoints = () => {
  const [nbParticles, setNbParticles] = useState(150000)
  const bufferGeometry = useLoader(PLYLoader, '/3D/tree.ply')

  const ref = useRef()

  // Material
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial()
    material.uniforms = uniforms
    material.vertexShader = vertexShader
    material.fragmentShader = fragmentShader

    return material
  }, [nbParticles])

  // Camera position
  const {camera} = useThree()

  useEffect(() => {
    camera.position.set(0,5,2)
    camera.lookAt(ref.current.position)
  }, [])

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime()
    uniforms.uTime.value = a
    uniforms.uMouse.value = useStore.getState().pointerSpace
  })


  return (
    <points geometry={bufferGeometry} material={shaderMaterial} ref={ref} position={[0,0,0]} ></points>
  )

}

export default TreePoints
