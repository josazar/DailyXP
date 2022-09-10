import * as THREE from 'three'
import React, { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import simVertex from '../glsl/simulation_vs.glsl?raw'
import simFragment from '../glsl/simulation_fs.glsl?raw'
import particlesVertex from '../glsl/particles_vs.glsl?raw'
import particlesFragment from '../glsl/particles_fs.glsl?raw'
import FBO from '../@utils/FBO'
import useStore from '../store'

const FBOParticles = ({ renderer }) => {
	const loadPlyFile = useStore(state => state.loadPlyFile);
	const activeGeometry = useStore(state => state.activeGeometry)

	const [particles, setParticles] = useState(null)
	const [FBO_Object, setFBO_Object] = useState(null)

	useEffect( () => {
		loadPlyFile('/3D/lidar_clean.ply')
	}, [])

	useEffect( () => {
		if (activeGeometry === null) return

		var total = activeGeometry.attributes.position.count;
		var size = parseInt( Math.sqrt( total ) + .5 );
		var data = new Float32Array( size*size*3 );
		var dataColor = new Float32Array( size*size*3 );
		
		for( var i = 0; i < total; i++ ) {
			data[i * 3] = activeGeometry.attributes.position.array[i * 3];
			data[i * 3 + 1] = activeGeometry.attributes.position.array[i * 3 + 1];
			data[i * 3 + 2] = activeGeometry.attributes.position.array[i * 3 + 2];

			// color data
			dataColor[i * 3] = activeGeometry.attributes.color.array[i * 3];
			dataColor[i * 3 + 1] = activeGeometry.attributes.color.array[i * 3 + 1];
			dataColor[i * 3 + 2] = activeGeometry.attributes.color.array[i * 3 + 2];
		}
		// const size = 256

		// Convert the data to a FloatTexture
		const positions = new THREE.DataTexture(
			data,
			size,
			size,
			THREE.RGBFormat,
			THREE.FloatType
		)
		positions.needsUpdate = true



	
		// Simulation shader material used to update the particles' positions
		const simMaterial = new THREE.ShaderMaterial({
			vertexShader: simVertex,
			fragmentShader: simFragment,
			uniforms: {
				positions: { value: positions },
				uTime: { value: 0 },
				uSpeed: { value: 0.007 },
				uCurlFreq: { value: .15 },
			},
		})

		// Render shader material to display the particles on screen
		// the positions uniform will be set after the this.fbo.update() call
		const renderMaterial = new THREE.ShaderMaterial({
			vertexShader: particlesVertex,
			fragmentShader: particlesFragment,
			uniforms: {
				positions: { value: null },
				uPointSize: { value: 4.25 },
			},
			transparent: true,
			// blending: THREE.AdditiveBlending,

		})

		// Initialize the FBO
		const fbo = new FBO(size, size, renderer, simMaterial, renderMaterial)

		// add color attributes from the lidar files
		fbo.particles.geometry.setAttribute(
			"color",
			new THREE.BufferAttribute(dataColor, 3)
		)

		setParticles(fbo.particles)
		setFBO_Object(fbo)
	}, [activeGeometry])

	useFrame(({ clock }) => {
		if (FBO_Object !== null) {
			const a = clock.getElapsedTime()
			FBO_Object.update(a)
		}
	})

	return (
		particles !== null && (
			<primitive object={particles} position={[0, 0, 0]}  ></primitive>
		)
	)
}
export default FBOParticles
