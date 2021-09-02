import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

import simVertex from '../glsl/simulation_vs.glsl?raw'
import simFragment from '../glsl/simulation_fs.glsl?raw'
import particlesVertex from '../glsl/particles_vs.glsl?raw'
import particlesFragment from '../glsl/particles_fs.glsl?raw'

import FBO from '../@utils/FBO'
import { getSphere } from '../@utils'

const FBOParticles = ({ renderer }) => {
	const [particles, setParticles] = useState(null)
	const [FBO_Object, setFBO_Object] = useState(null)

	useEffect(() => {
		// width and height of FBO
		const width = 256
		const height = 128

		// Populate a Float32Array of random positions
		let length = width * height * 3
		let data = getSphere(length, 2)

		// Convert the data to a FloatTexture
		const positions = new THREE.DataTexture(
			data,
			width,
			height,
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
				uSpeed: { value: 0.2 },
				uCurlFreq: { value: 0.35 },
			},
		})

		// Render shader material to display the particles on screen
		// the positions uniform will be set after the this.fbo.update() call
		const renderMaterial = new THREE.ShaderMaterial({
			vertexShader: particlesVertex,
			fragmentShader: particlesFragment,
			uniforms: {
				positions: { value: null },
				uTime: { value: 0 },
				uPointSize: { value: 2.4 },
				uOpacity: { value: 0.35 },
			},
			transparent: true,
			blending: THREE.AdditiveBlending,
		})

		// Initialize the FBO
		const fbo = new FBO(width, height, renderer, simMaterial, renderMaterial)
		setParticles(fbo.particles)
		setFBO_Object(fbo)
	}, [])

	useFrame(({ clock }) => {
		if (FBO_Object !== null) {
			const a = clock.getElapsedTime()
			FBO_Object.update(a)
		}
	})

	return (
		particles !== null && (
			<primitive object={particles} position={[-2, 0, 0]}></primitive>
		)
	)
}
export default FBOParticles
