import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import {
  OrbitControls,
} from '@react-three/drei'
import Particles from './Particles'
import PlaneRayTracerTarget from './PlaneRayTracerTarget'


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
          <PlaneRayTracerTarget />
          <Particles />

          <OrbitControls  />
        </Canvas>
      </div>

    </div>
  )
}

export default App



