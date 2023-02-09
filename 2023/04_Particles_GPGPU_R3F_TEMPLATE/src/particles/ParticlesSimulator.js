import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import fragmentSimulationPosition from "../glsl/fragmentSimulationPosition";
import fragmentSimulationColor from "../glsl/fragmentSimulationColor";
import fragmentSimulationVelocity from "../glsl/fragmentSimulationVelocity";
import { Vector4 } from "three";

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

// For Shadows when vertex positions is modifyes use this:
// https://threejs.org/docs/index.html?q=objec#api/en/core/Object3D.customDepthMaterial
// https://qa.wujigu.com/qa/?qa=104886/three-js-how-to-update-shadows-in-modified-meshphysicalmaterial-shader

/**
 * oPosition original Texture
 * position texture
 * velocity  vel *= .99; // dampening
 * acceleration
 * life
 * 
 */


export default class ParticlesSimulator {
  constructor(
    size,
    renderer,
    renderMaterial,
    positions,
    colors,
  ) {
    this.material = renderMaterial;

    this.gpuCompute = new GPUComputationRenderer(
      size,
      size,
      renderer
    );

    // Convert the data to a FloatTexture
    // Texture Position
    this.dtPosition = new THREE.DataTexture(
      positions,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.dtPosition.needsUpdate = true

    // Texture Color
    this.dtColor = new THREE.DataTexture(
      colors,
      size,
      size,
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

    // GPGPU Variables Dependencies
    this.gpuCompute.setVariableDependencies(this.colorVariable, [
      this.colorVariable,
    ]);
    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
      this.velocityVariable
    ]);
    this.gpuCompute.setVariableDependencies(this.velocityVariable, [
      this.positionVariable,
      this.velocityVariable
    ]);


    // Add Uniforms 
    // VELOCITY
    this.velocityVariable.material.uniforms["restart"] = { value: 0 };
    this.velocityVariable.material.uniforms["originalTexture"] = { value:   this.dtVelocity };
    this.velocityVariable.material.uniforms["spherePos"] = { value:   new Vector4(0,0,0,.25) };
    this.velocityVariable.material.uniforms["floor"] = { value: -2 };

    // POSITION    
    this.positionVariable.material.uniforms["restart"] = { value: 0 };
    this.positionVariable.material.uniforms["originalTexture"] = { value: this.dtPosition };
    this.positionVariable.material.uniforms["spherePos"] = { value:   new Vector4(0,0,0,.25) };
    this.positionVariable.material.uniforms["floor"] = { value: -2 };
    this.positionVariable.material.uniforms["lifeDuration"] = { value:  1000 };

    this.gpuCompute.init();

    // Color only once
    this.material.uniforms.textureColor.value = this.gpuCompute.getCurrentRenderTarget(
      this.colorVariable
    ).texture;
  }

  update(time) {
    // Update positions
    const posRT = this.gpuCompute.getCurrentRenderTarget(
      this.positionVariable
    ).texture;
    
    this.material.uniforms.texturePosition.value = posRT;    
    this.gpuCompute.compute();
  }


  fillVelocityTexture(texture) {
    const theArray = texture.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
      
      theArray[k + 0] = .035 * (Math.random() - .5);
      theArray[k + 1] = -.01 + Math.random() * .045;     
      theArray[k + 2] = .035 * (Math.random() - .5);


      // Direction
      theArray[k + 3] = 1;
    }
  }
}
