import React, { Suspense, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Particles from "./Particles";
import * as THREE from "three";

const ScenePoints = () => {
  const { gl } = useThree();
  const ref = useRef();

  useFrame((a) => {
    const time = a.clock.oldTime * .0002

    ref.current.position.x = Math.cos(time * .05) * 4;
    ref.current.position.z = Math.sin(time * .05) * 8;
  })

  return (
    <group >
      <directionalLight
        ref={ref}
        castShadow
        position={[4, 8, 2]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[200, 200]} />
        <shadowMaterial attach="material" transparent opacity={0.5} />
      </mesh>


      <Particles renderer={gl} PLYUrl="/3D/arbre_duo_low.ply" />
    </group>
  );
};

export default ScenePoints;
