import { Suspense } from "react";
import "./App.css";
import { Canvas,  } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Toaster } from "react-hot-toast";
import { Stats } from "@react-three/drei";
import Particles from "./particles/Particles";

function App() {

  return (
    <div className="App">
      <div id="canvas-container">
        <Canvas shadows legacy camera={
          { position: [0, 20, 0], fov: 45, near: 0.1, far: 1000 }
        }>          
          <color attach="background" args={[0x8F7991]} />
          <Particles />
          <OrbitControls dampingFactor={0.8} />
        </Canvas>
      </div>
      <Stats showPanel={0} className="stats" />
      <Toaster />
    </div>
  );
}

export default App;
