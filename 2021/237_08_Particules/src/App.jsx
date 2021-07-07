import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame } from '@react-three/fiber'
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

          <Particles />

          <OrbitControls  />
        </Canvas>
      </div>

    </div>
  )
}

export default App


