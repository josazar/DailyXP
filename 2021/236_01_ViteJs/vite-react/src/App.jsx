import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { Canvas } from '@react-three/fiber'

function App() {
  const [count, setCount] = useState(0)


  return (
    <div className="App">
      <div id="canvas-container">
        <Canvas>
          <ambientLight intensity={0.1}
            color="red"
            intensity={0.25}
          />
          <directionalLight color="green" position={[0, 4, 5]} />

          <mesh>
            <sphereBufferGeometry args={[2,20,20]} />
            <meshPhongMaterial color="white" />
          </mesh>


        </Canvas>
      </div>

    </div>
  )
}

export default App
