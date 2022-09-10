import React from "react";
import { useThree } from "@react-three/fiber";
import Particles from "./Particles";

const ScenePoints = () => {
  const { gl } = useThree();


  return (
    <group>
      <Particles renderer={gl} PLYUrl="/3D/street.ply" />
    </group>
  );
};

export default ScenePoints;
