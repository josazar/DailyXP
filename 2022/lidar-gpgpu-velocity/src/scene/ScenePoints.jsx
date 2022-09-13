import React, { Suspense, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Particles from "./Particles";
import * as THREE from "three";

const ScenePoints = () => {
  const { gl } = useThree();
  const ref = useRef();

  useFrame((a) => {
    const time = a.clock.oldTime * .0002

    ref.current.position.x = Math.cos(time) * 4;
    ref.current.position.z = Math.sin(time) *8;
  })

  return (
    <group >
      <directionalLight
        ref={ref}
        castShadow
        position={[4, 8, 2]}
        intensity={10.}
      />    
      <Particles renderer={gl} PLYUrl="/3D/arbre_duo_low.ply" />
    </group>
  );
};

export default ScenePoints;
