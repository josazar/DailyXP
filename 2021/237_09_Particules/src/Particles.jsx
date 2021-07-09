import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import vertexShader from './glsl/emeter_vs.glsl?raw'
import fragmentShader from './glsl/emeter_fs.glsl?raw'
import { generatePositionsFromFormula } from './@utils/CloudPoints'
import ParametricEquations from './@utils/ParametricEquations'


const uniforms = {
  uTime: { type: "f", value: 0 },
  uSpeed: { type: "f", value: 3 },
  frequency: { type: "f", value: 0.06 },
  amplitude: { type: "f", value: 2 },
}

const Particles = () => {
  const [nbParticles, setNbParticles] = useState(100000)

  const ref = useRef()

  // BufferGeometry from a Parametric Formula
  const bufferGeometry = useMemo(() => {
    let slices = Math.floor(Math.sqrt(nbParticles)) -1
    const vertices = generatePositionsFromFormula(ParametricEquations.nature, nbParticles, slices,slices, 1.5)
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
  })


  return (
    <points geometry={bufferGeometry} material={shaderMaterial} ref={ref} position={[0,0,0]} ></points>
  )

}

export default Particles
