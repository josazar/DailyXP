import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ScenePoints from "./scene/ScenePoints";
import { Toaster } from "react-hot-toast";
import { Stats } from "@react-three/drei";
import useStore from "./store";

function App() {
  const setMouseMove = useStore((state) => state.setMouseMove);
  const setMouseCoords = useStore((state) => state.setMouseCoords);

  const onPointerMoveHandler = (event) => {
    if (event.isPrimary === false) return;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    setMouseCoords({
      x: event.clientX - windowHalfX,
      y: event.clientY - windowHalfY
    });
    setMouseMove(true);
  };

  const onKeyUp = (e) => {
  };

  return (
    <div className="App" onPointerMove={onPointerMoveHandler} onKeyUp={onKeyUp}>
      <div id="canvas-container">
        <Canvas shadows>
          <color attach="background" args={['#B4AA8A']} />

          <ambientLight intensity={0.4} />

          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[0, -10, 0]} intensity={1.5} />
      
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[200, 200]} />
            <shadowMaterial attach="material" transparent opacity={0.4} />
          </mesh>

          <Suspense fallback={null}>
            <ScenePoints />
          </Suspense>
          <OrbitControls dampingFactor={0.05} />
        </Canvas>
      </div>
      <Stats showPanel={0} className="stats" />
      <Toaster />
    </div>
  );
}

export default App;
