// Particules test with GPUComputationRenderer
import * as THREE from "three";
import React, { useEffect, useState } from "react";
import GPGPU from "../@utils/GPGPU";

import particlesVertex from "../glsl/particles_vs";
import particlesFragment from "../glsl/particles_fs";
import useStore from "../store";
import { useFrame } from "@react-three/fiber";


// Main Particules Material
const renderMaterial = new THREE.ShaderMaterial({
  vertexShader: particlesVertex,
  fragmentShader: particlesFragment,

  uniforms: {
    texturePosition: { value: null },
    originalTexture: { value: null },
    textureVelocity: { value: null },
    colorTexture: { value: null },
    uPointSize: { value: 20 }
  },
  transparent: true,
  // blending : THREE.MultiplyBlending,
});

const Particles = ({ renderer, PLYUrl }) => {
  const loadPlyFile = useStore((state) => state.loadPlyFile);
  const activeGeometry = useStore((state) => state.activeGeometry);
  const [particles, setParticles] = useState(null);
  const [gpuCompute, setGpuCompute] = useState(null);
  const mouseCoords = useStore((state) => state.mouseCoords);
  //  const [helper] = useState(new FBOHelper(renderer));
  const [size, setSize] = useState(null);

  useEffect(() => {
    loadPlyFile(PLYUrl);
  }, [loadPlyFile, PLYUrl]);

  useEffect(() => {
    const keydown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (gpuCompute !== null) {
          gpuCompute.velocityVariable.material.uniforms["restart"].value = 1;
          gpuCompute.positionVariable.material.uniforms["restart"].value = 1;
        }
      }
      
    };

    const keyup = (event) => {
      if (event.code === "Space") {
        event.preventDefault();

        // Reset Velocity
        if (gpuCompute !== null) {
          // gpuCompute.velocityVariable.material.uniforms[
          //   "restart"
          // ].value = 0;
          // gpuCompute.positionVariable.material.uniforms[
          //   "restart"
          // ].value = 0;
        }
      }
    
    };

    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyup);
    };
  }, [gpuCompute]);

  // Init GPGPU
  useEffect(() => {
    if (activeGeometry === null) return;

    // Positions from Geometry LIDAR
    var total = activeGeometry.attributes.position.count;
    var size = parseInt(Math.sqrt(total) + 0.5);
    setSize(size);
    var positions = new Float32Array(size * size * 4);
    var dataColor = new Float32Array(size * size * 4);
    var reference = new Float32Array(size * size * 2);

    for (var i = 0; i < size * size; i++) {
      // positions
      positions[i * 4] = activeGeometry.attributes.position.array[i * 3];
      positions[i * 4 + 1] = activeGeometry.attributes.position.array[i * 3 + 1];
      positions[i * 4 + 2] = activeGeometry.attributes.position.array[i * 3 + 2];
      positions[i * 4 + 3] = Math.random() * 5; // Life

      // colors
      dataColor[i * 4] = activeGeometry.attributes.color.array[i * 3];
      dataColor[i * 4 + 1] = activeGeometry.attributes.color.array[i * 3 + 1];
      dataColor[i * 4 + 2] = activeGeometry.attributes.color.array[i * 3 + 2];
      dataColor[i * 4 + 3] = 0;

      // reference to easily get the xy positions of the vertices
      // Lidar Color can now be well be sort on Windows and Linux Machine
      // Found the solution via https://www.youtube.com/watch?v=oLH00MXTqNg
      let xx = (i % size) / size;
      let yy = ~~(i / size) / size; 
      reference.set([xx, yy], i * 2);
    }


    // Custom Depht Materila for Points Shadowing
    // Shadow Custom 
    const depthMaterial = new THREE.MeshDepthMaterial(
      {
        depthPacking: THREE.RGBADepthPacking,
        alphaTest: 0.5,
      }
    )

    // GPGPU CLASS
    setGpuCompute(
      new GPGPU(size, renderer, renderMaterial, positions, dataColor, depthMaterial)
    );

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 4));
    // Reference will help to find the right colors at the right position (windows, linux)
    geometry.setAttribute("reference", new THREE.BufferAttribute(reference, 2));

    let particles = new THREE.Points(geometry, renderMaterial);
    

   particles.customDepthMaterial = depthMaterial;


    setParticles(particles);
  }, [activeGeometry, renderer]);



  // **************************************
  // LOOP
  // **************************************
  useFrame(({ clock, gl }) => {
    if (particles !== null && gpuCompute !== null) {
      const a = clock.getElapsedTime();

      // update Mouse
      // gpuCompute.velocityVariable.material.uniforms["mousePos"].value = {
      //   x: (0.5 * mouseCoords.x) / window.innerWidth / 2,
      //   y: (-0.5 * mouseCoords.y) / window.innerHeight / 2
      // };

     gpuCompute.update(a);
    }
  });

  return (
    particles !== null && (
      <>
        <group  position={[0,-.49,0]}>
          <primitive object={particles} castShadow />
        </group>
      </>
    )
  );
};

export default Particles;
