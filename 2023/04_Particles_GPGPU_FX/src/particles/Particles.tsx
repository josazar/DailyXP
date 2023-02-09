// Particules test with GPUComputationRenderer
import { useEffect, useState, useRef, useMemo } from "react";
import ParticlesSimulator from "./ParticlesSimulator";
import particlesVertex from "../glsl/particles_vs";
import particlesFragment from "../glsl/particles_fs";
import useStore from "../store";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Points, ShaderMaterial } from "three";
import {getAttributesFromGeometryLidar} from '../@utils/CloudPoints.js';
import { useTexture, shaderMaterial } from "@react-three/drei";

// Main Particules Material
const renderMaterial = new ShaderMaterial({
  vertexShader: particlesVertex,
  fragmentShader: particlesFragment,

  uniforms: {
    texturePosition: { value: null },
    textureColor: { value: null },
    uPointSize: { value: 14 * window.devicePixelRatio },
  },
  transparent: true,
});

// export const ParticlesMaterial = shaderMaterial(
//   {
//     texturePosition: null,
//     textureColor: null,
//     uPointSize: 14 * window.devicePixelRatio
//   },
//   // Vertex
//   particlesVertex
//   ,
//   // Fragment
//   particlesFragment
// )

// extend({ ParticlesMaterial })



const simSettings = {
  "floor": -1.4
}

export default function Particles({ PLYUrl } : {PLYUrl: string}) {
  const { gl } = useThree();
  const loadPlyFile = useStore((state) => state.loadPlyFile);
  const activeGeometry = useStore((state) => state.activeGeometry);
  const materialRef = useRef<ShaderMaterial>();

  const geometryData = useMemo(() => { 
    if (!activeGeometry) return

      materialRef.current = renderMaterial;

      return getAttributesFromGeometryLidar(activeGeometry)
  }, [activeGeometry])

  // Simulator with GPGPU FBO
  const simulator = useMemo(() => {
    if (!geometryData) return;

    // GPGPU SIMULATOR
    return new ParticlesSimulator(
        geometryData.size, 
        gl, 
        renderMaterial, 
        geometryData.positions, 
        geometryData.colors, 
        simSettings
      );
  }, [geometryData])


  useEffect(() => {
    loadPlyFile(PLYUrl);
  }, [loadPlyFile, PLYUrl]);

  // KEY PRESS
  useEffect(() => {
    const keydown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (simulator) {
          simulator.velocityVariable.material.uniforms["restart"].value = 1;
          simulator.positionVariable.material.uniforms["restart"].value = 1;
        }
      }
    };

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [simulator]);


  // **************************************
  // LOOP
  // **************************************
  useFrame(({ clock }) => {
    if (simulator) {
      const a = clock.getElapsedTime();

      simulator.update(a);
    }
  });

  if (!geometryData) return;

  return (
    <points position={[0,.15,0]} rotation={[0,0,0]} material={renderMaterial}>
      <bufferGeometry >
        <bufferAttribute attach="attributes-position" count={geometryData.positions.length / 4} array={geometryData.positions} itemSize={4} />
        <bufferAttribute attach="attributes-reference" count={geometryData.reference.length / 2} array={geometryData.reference} itemSize={2} />
      </bufferGeometry>
    </points>
  );
};



