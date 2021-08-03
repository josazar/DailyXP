import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import {
  OrbitControls,
} from '@react-three/drei'
import Particles from './Particles'
import PlaneRayTracerTarget from './PlaneRayTracerTarget'
import TreePoints from './TreePoints'


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
          {/* <Particles /> */}
          <Suspense fallback={null}>
            <TreePoints />
          </Suspense>
          <OrbitControls  />
        </Canvas>
      </div>

    </div>
  )
}

export default App



