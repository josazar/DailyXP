// Particules test with GPUComputationRenderer
import { useEffect, useMemo, Suspense } from "react";
import ParticlesSimulator from "./ParticlesSimulator";
import particlesVertex from "../glsl/particles_vs";
import particlesFragment from "../glsl/particles_fs";
import { useFrame, useThree, useLoader} from "@react-three/fiber";
import { ShaderMaterial } from "three";
import {getAttributesFromGeometryLidar, getAttributesOfRandomShape} from '../@utils/CloudPoints.js';
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

const K = 1000;

// Main Particules Material
const renderMaterial = new ShaderMaterial({
  vertexShader: particlesVertex,
  fragmentShader: particlesFragment,

  uniforms: {
    texturePosition: { value: null },
    textureColor: { value: null },
    uPointSize: { value: 15 * window.devicePixelRatio },
  },
  transparent: true,
});

export default function Particles() {
  const { gl } = useThree();

  const geometryData = useMemo(() => { 
    // Sphere
      return getAttributesOfRandomShape(2200*K, 2.85)
  }, [])

  // Simulator with GPGPU FBO
  const simulator = useMemo(() => {
    if (!geometryData) return;

    // GPGPU SIMULATOR
    return new ParticlesSimulator(
        geometryData.size, 
        gl, 
        renderMaterial, 
        geometryData.positions, 
        geometryData.colors
      );
  }, [geometryData])

  // EVENTS KEY PRESS
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

  const floorValue = -2;
  useFrame(({ clock }) => {
    if (simulator) {
      const a = clock.getElapsedTime();

      simulator.update(a);

      // Update Floor
      simulator.positionVariable.material.uniforms.floorValue.value = floorValue;
      simulator.velocityVariable.material.uniforms.floorValue.value = floorValue;
    }
  });

  return (
    <Suspense>
      <points position={[0,2,0]} rotation={[0,0,0]} material={renderMaterial} scale={[1,1,1]}> 
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={geometryData.positions.length / 4} array={geometryData.positions} itemSize={4} />
          <bufferAttribute attach="attributes-reference" count={geometryData.reference.length / 2} array={geometryData.reference} itemSize={2} />
        </bufferGeometry>
      </points>
    </Suspense>
  );
};