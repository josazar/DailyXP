// Particules test with GPUComputationRenderer
import { useEffect, useMemo, Suspense } from "react";
import ParticlesSimulator from "./ParticlesSimulator";
import particlesVertex from "../glsl/particles_vs";
import particlesFragment from "../glsl/particles_fs";
import { useFrame, useThree, useLoader} from "@react-three/fiber";
import { ShaderMaterial } from "three";
import {getAttributesFromGeometryLidar} from '../@utils/CloudPoints.js';
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

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

export default function Particles({ PLYUrl } : {PLYUrl: string}) {
  const { gl } = useThree();

  const activeGeometry = useLoader(PLYLoader, PLYUrl)
  // You don't need to check for the presence of the result, when we're here
  // the result is guaranteed to be present since useLoader suspends the component
  // activeGeometry.center();

  const geometryData = useMemo(() => { 
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
  useFrame(({ clock }) => {
    if (simulator) {
      const a = clock.getElapsedTime();

      simulator.update(a);

      // Update Floor
      simulator.positionVariable.material.uniforms.floor.value = -1.5;
      simulator.velocityVariable.material.uniforms.floor.value = -1.5;
    }
  });

  return (
    <Suspense>
      <points position={[0,0.15,0]} rotation={[0,0,0]} material={renderMaterial} scale={[1,1,1]}> 
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={geometryData.positions.length / 4} array={geometryData.positions} itemSize={4} />
          <bufferAttribute attach="attributes-reference" count={geometryData.reference.length / 2} array={geometryData.reference} itemSize={2} />
        </bufferGeometry>
      </points>

      {/*  Floor */}
    </Suspense>
  );
};