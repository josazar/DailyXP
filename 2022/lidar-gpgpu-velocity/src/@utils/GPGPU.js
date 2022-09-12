import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import fragmentSimulationPosition from "../glsl/fragmentSimulationPosition";
import fragmentSimulationColor from "../glsl/fragmentSimulationColor";
import fragmentSimulationVelocity from "../glsl/fragmentSimulationVelocity";

/**
 * USE of GPUComputationRenderer
 * 
 * GPUComputationRenderer, based on SimulationRenderer by zz85
 * 
The GPUComputationRenderer uses the concept of variables. These variables are RGBA float textures that hold 4 floats for each compute element (texel)
Each variable has a fragment shader that defines the computation made to obtain the variable in question.

You can use as many variables you need, and make dependencies so you can use textures of other variables in the shader 
(the sampler uniforms are added automatically) 
Most of the variables will need themselves as dependency.

The renderer has actually two render targets per variable, to make ping-pong. 
Textures from the current frame are used as inputs to render the textures of the next frame.
The render targets of the variables can be used as input textures for your visualization shaders.
Variable names should be valid identifiers and should not collide with THREE GLSL used identifiers.

A common approach could be to use 'texture' prefixing the variable name; i.e texturePosition, textureVelocity...
The size of the computation (sizeX * sizeY) is defined as 'resolution' automatically in the shader. For example:

#DEFINE resolution vec2( 1024.0, 1024.0 )

 */

// Maybe check that too https://github.com/cabbibo/PhysicsRenderer

// Also that is an inspiration: https://quentinlengele.com/index.php/2017/06/04/point-cloud-sandbox/
// 
// +https://dev.miaumiau.cat/curl_particles_collision/js/main.js
// check shadowMapRT in that script
// https://discourse.threejs.org/t/implement-your-own-shadow-mapping/13537
//https://oimo.io/works
// STUDIES
// https://www.clicktorelease.com/code/THREE.FBOHelper/#512

/**
 * oPosition original Texture
 * position texture
 * velocity  vel *= .99; // dampening
 * acceleration
 * life
 * 
 */

export default class GPGPU {
  // initialPositions is not mandatory
  constructor(
    size,
    renderer,
    renderMaterial,
    initialPositions,
    initialColors
  ) {
    this.material = renderMaterial;
    this.width = size;
    this.renderer = renderer;
    this.initialPositions = initialPositions;
    this.initialColors = initialColors;

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

    // Simulation Shader for the Positions computing
    this.positionVariable = this.gpuCompute.addVariable(
      "texturePosition",
      fragmentSimulationPosition,
      this.dtPosition
    );
    // original Texture


    // Simulation Shader for the Colors computing
    // at the moment not really computing... but we can
    this.colorVariable = this.gpuCompute.addVariable(
      "textureColor",
      fragmentSimulationColor,
      this.dtColor
    );

    // Simulation Shader for the Velocity computing
    // Texture Velocity
    this.dtVelocity = this.gpuCompute.createTexture();
    this.fillVelocityTexture(this.dtVelocity);

    this.velocityVariable = this.gpuCompute.addVariable(
      "textureVelocity",
      fragmentSimulationVelocity,
      this.dtVelocity
    );

    // add uniform texturePosition Automaticaly to the Shader
    this.gpuCompute.setVariableDependencies(this.colorVariable, [
      this.colorVariable,
    ]);
    // add uniform textureColor Automaticaly to the Shader
    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
      this.velocityVariable
    ]);
    // add uniform textureVelocity Automaticaly to the Shader
    this.gpuCompute.setVariableDependencies(this.velocityVariable, [
      this.positionVariable,
      this.velocityVariable
    ]);


    // Add Uniforms 
    this.velocityVariable.material.uniforms["restart"] = { value: 0 };
    this.velocityVariable.material.uniforms["originalTexture"] = { value:   this.dtVelocity };
    // this.velocityVariable.material.uniforms["time"] = { value: 0. };
    
    this.positionVariable.material.uniforms["restart"] = { value: 0 };
    this.positionVariable.material.uniforms["originalTexture"] = { value: this.dtPosition };


    // this.velocityVariable.material.uniforms["mousePos"] = {
    //   value: new THREE.Vector2(0, 0)
    // };
    // this.positionVariable.material.uniforms["frequency"] = { value: 0.1 };
    // this.positionVariable.material.uniforms["amplitude"] = { value: 55 };
    // this.positionVariable.material.uniforms["maxDistance"] = { value: 65 };
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
      
      theArray[k + 0] = .035 * (Math.random() - .5);
      theArray[k + 1] = -.01 + Math.random() * .085;     
      theArray[k + 2] = .035 * (Math.random() - .5);


      // Direction
      theArray[k + 3] = 1;
    }
  }
}
