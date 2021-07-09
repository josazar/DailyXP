import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import vertexShader from './glsl/emeter_vs.glsl?raw'
import fragmentShader from './glsl/emeter_fs.glsl?raw'
import {
  OrbitControls,
} from '@react-three/drei'
import Particles from './Particles'


function App() {


  return (
    <div className="App">
      <div id="canvas-container">
        <Canvas>
          <ambientLight intensity={0.1}
            color="red"
            intensity={0.25}
          />
          <directionalLight color="green" position={[0, 4, 5]} />
          <PlaneRayTracerTarget/>
          <Particles />

          {/* <OrbitControls  /> */}
        </Canvas>
      </div>

    </div>
  )
}

export default App




function PlaneRayTracerTarget({size}) {
  const { camera } = useThree()
  const ref = useRef()
  const refTarget = useRef()
  const pointer = new THREE.Vector3()



  useFrame(() => {
    ref.current.lookAt(camera.position)
    refTarget.current.position.set(pointer.x, pointer.y, pointer.z)
  })



  // MouseEvent to get pointer 2D coordinates from -1 to 1 x/y - 0 at the center
  const onPointerMove = (event) => {
    pointer.x = event.point.x
    pointer.y = event.point.y
    pointer.z = event.point.z

  }

  return (
    <group >
      <mesh ref={ref} onPointerMove={onPointerMove}>
        <planeGeometry args={[10,10, 1, 1]} />
        <meshBasicMaterial color="grey" side={THREE.DoubleSide} wireframe/>
      </mesh>
      <mesh ref={refTarget}>
        <sphereGeometry args={[0.1,20,20]} />
        <meshBasicMaterial color="red" side={THREE.DoubleSide} wireframe/>
      </mesh>
    </group>
  )
}
