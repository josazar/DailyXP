import React from "react";
import { useThree } from "@react-three/fiber";
import Particles from "./Particles";

const ScenePoints = () => {
  const { gl } = useThree();


  return (
    <group>
      <Particles renderer={gl} PLYUrl="/3D/street.ply" />
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[1,32,32]} />
        <meshPhysicalMaterial color="ghostwhite" metalness={0} roughness={1} />
      </mesh>
    </group>

  );
};

export default ScenePoints;
