import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import fragmentSimulationPosition from "../glsl/fragmentSimulationPosition";
import fragmentSimulationColor from "../glsl/fragmentSimulationColor";
import fragmentSimulationVelocity from "../glsl/fragmentSimulationVelocity";

export default class GPGPU {
  // initialPositions is not mandatory
  constructor(
    width,
    renderer,
    renderMaterial,
    initialPositions,
    initialColors
  ) {
    this.material = renderMaterial;
    this.width = width;
    this.renderer = renderer;
    this.initialPositions = initialPositions;
    this.initialColors = initialColors;
    this.init();
  }

  init() {
    this.gpuCompute = new GPUComputationRenderer(
      this.width,
      this.width,
      this.renderer
    );

    // Convert the data to a FloatTexture
    // Texture Position
    this.dtPosition = new THREE.DataTexture(
      this.initialPositions,
      this.width,
      this.width,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.dtPosition.needsUpdate = true

    // Texture Color
    this.dtColor = new THREE.DataTexture(
      this.initialColors,
      this.width,
      this.width,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.dtColor.needsUpdate = true;

    // Texture Velocity
    this.dtVelocity = this.gpuCompute.createTexture();
    this.fillVelocityTexture(this.dtVelocity);

    // Simulation Shader for the Positions computing
    this.positionVariable = this.gpuCompute.addVariable(
      "texturePosition",
      fragmentSimulationPosition,
      this.dtPosition
    );

    // Simulation Shader for the Colors computing
    // at the moment not really computing... but we can
    this.colorVariable = this.gpuCompute.addVariable(
      "textureColor",
      fragmentSimulationColor,
      this.dtColor
    );

    // Simulation Shader for the Velocity computing
    this.velocityVariable = this.gpuCompute.addVariable(
      "textureVelocity",
      fragmentSimulationVelocity,
      this.dtVelocity
    );

    // add uniform texturePosition Automaticaly to the Shader
    this.gpuCompute.setVariableDependencies(this.colorVariable, [
      this.positionVariable,
      this.colorVariable,
      this.velocityVariable
    ]);
    // add uniform textureColor Automaticaly to the Shader
    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
      this.colorVariable,
      this.velocityVariable
    ]);

    // add uniform textureVelocity Automaticaly to the Shader
    this.gpuCompute.setVariableDependencies(this.velocityVariable, [
      this.positionVariable,
      this.colorVariable,
      this.velocityVariable
    ]);

    // Add Uniforms to the Positions simulation
    this.velocityVariable.material.uniforms["mousePos"] = {
      value: new THREE.Vector2(0, 0)
    };
    this.positionVariable.material.uniforms["timer"] = { value: 0.1 };
    this.positionVariable.material.uniforms["frequency"] = { value: 0.1 };
    this.positionVariable.material.uniforms["amplitude"] = { value: 55 };
    this.positionVariable.material.uniforms["maxDistance"] = { value: 65 };

    // velocity
    this.velocityVariable.material.uniforms["restart"] = { value: false };

    this.velocityVariable.wrapS = THREE.RepeatWrapping;
    this.velocityVariable.wrapT = THREE.RepeatWrapping;

    this.gpuCompute.init();

    // Color only once
    this.material.uniforms.colorTexture.value = this.gpuCompute.getCurrentRenderTarget(
      this.colorVariable
    ).texture;
  }

  update(time) {
    // Update positions
    this.material.uniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(
      this.positionVariable
    ).texture;

    // Update velocity
    this.material.uniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(
      this.velocityVariable
    ).texture;

    this.gpuCompute.compute();
  }

  fillVelocityTexture(texture) {
    const theArray = texture.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;

      theArray[k + 0] = x * 1;
      theArray[k + 1] = y * 1;
      theArray[k + 2] = z * 1;
      theArray[k + 3] = 1;
    }
  }
}
