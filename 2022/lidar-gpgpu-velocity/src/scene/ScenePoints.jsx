import React from "react";
import { useThree } from "@react-three/fiber";
import Particles from "./Particles";
import * as THREE from "three";

const ScenePoints = () => {
  const { gl } = useThree();

  return (
    <group> 
      <Particles renderer={gl} PLYUrl="/3D/arbre_duo_low.ply" />
    </group>

  );
};

export default ScenePoints;
