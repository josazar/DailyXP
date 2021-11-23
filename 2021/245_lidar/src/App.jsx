import * as THREE from 'three'
import React, { useEffect, Suspense } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
} from '@react-three/drei'
import ScenePoints from './scene/ScenePoints'


function App() {

  return (
    <div className="App">
      <div id="canvas-container">
        <Canvas>
          <Suspense fallback={null}>
            <ScenePoints />
          </Suspense>
          <OrbitControls dampingFactor={0.05} />
        </Canvas>
      </div>

    </div>
  )
}

export default App



