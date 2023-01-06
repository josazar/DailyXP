import React, { Suspense, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Particles from "./Particles";
import * as THREE from "three";

const ScenePoints = () => {
  const { gl, camera } = useThree();
  const ref = useRef();

  useFrame((a) => {
    const time = a.clock.oldTime * .0002

    // camera.position.x = Math.cos(time ) * 8;
    // camera.position.z = Math.sin(time ) * 8;
  })

  return (
    <group >
      <directionalLight
        ref={ref}
        // castShadow
        position={[-8, 5, -8]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} >
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <shadowMaterial attach="material" transparent opacity={0.6} />
      </mesh>


      <Particles renderer={gl} PLYUrl="/3D/AlleeCouverteCarnac.ply" />
    </group>
  );
};

export default ScenePoints;
