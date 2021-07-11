import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import vertexShader from './glsl/emeter_vs.glsl?raw'
import fragmentShader from './glsl/emeter_fs.glsl?raw'
import { generatePositionsFromFormula } from './@utils/CloudPoints'
import ParametricEquations from './@utils/ParametricEquations'
import { Vector2 } from 'three'
import useStore from './store'


const uniforms = {
  uTime: { type: "f", value: 0 },
  uSpeed: { type: "f", value: 2 },
  frequency: { type: "f", value: 0.12 },
  amplitude: { type: "f", value: 2 },
  uMouse: { value: new Vector2(0,0)},
  u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight)}
}

const Particles = () => {
  const [nbParticles, setNbParticles] = useState(50000)

  const ref = useRef()

  // BufferGeometry from a Parametric Formula
  const bufferGeometry = useMemo(() => {
    let slices = Math.floor(Math.sqrt(nbParticles)) -1
    // const vertices = generatePositionsFromFormula(ParametricEquations.mobius3d, nbParticles, slices,slices, 1.5)
    const vertices = getSphere(nbParticles, 2)
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    return bufferGeometry
  }, [nbParticles])

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
    uniforms.uMouse.value = useStore.getState().pointerSpace
  })


  return (
    <points geometry={bufferGeometry} material={shaderMaterial} ref={ref} position={[0,0,0]} ></points>
  )

}

export default Particles
