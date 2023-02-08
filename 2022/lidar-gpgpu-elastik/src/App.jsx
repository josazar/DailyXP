import React, { Suspense, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
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


  return (
    <div className="App" onPointerMove={onPointerMoveHandler}>
      <div id="canvas-container">
        <Canvas shadows  legacy >          

          <color attach="background" args={[0x8F7991]} />
          <Suspense fallback={null}>
            <ScenePoints />
          </Suspense>
          <OrbitControls dampingFactor={0.2} />
        </Canvas>
      </div>
      <Stats showPanel={0} className="stats" />
      <Toaster />
    </div>
  );
}

export default App;