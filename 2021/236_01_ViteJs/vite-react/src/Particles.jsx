import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import vertexShader from './glsl/emeter_vs.glsl?raw'
import fragmentShader from './glsl/emeter_fs.glsl?raw'



const Particles = () => {


  const uniforms = {
    uTime: { type: "f", value: 0 },
    uSpeed: { type: "f", value: 3 },
    frequency: { type: "f", value: 0.6 },
    amplitude: { type: "f", value: 8 },
  }
  const [nbParticles, setNbParticles] = useState(200000)

  const pointsRef = useRef(null)

  const bufferGeometry = useMemo(() => {
    const vertices = getSphere(nbParticles, 2)
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    return bufferGeometry
  }, [nbParticles])

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime()
    pointsRef.current.material.uniforms.uTime.value = a
  })


  return (
    <points geometry={bufferGeometry} ref={pointsRef} position={[0,0,0]} >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>)

}

export default Particles
