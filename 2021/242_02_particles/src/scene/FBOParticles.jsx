import * as THREE from 'three'
import React, { useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

import simVertex from '../glsl/simulation_vs.glsl?raw'
import simFragment from '../glsl/simulation_fs.glsl?raw'
import particlesVertex from '../glsl/particles_vs.glsl?raw'
import particlesFragment from '../glsl/particles_fs.glsl?raw'

import texturePng_1 from '../assets/textures/textureMatrix_02.png'
import texturePng_2 from '../assets/textures/textureMatrix_03.png'
import texturePng_3 from '../assets/textures/textureMatrix_05.png'

import FBO from '../@utils/FBO'
import { getSphere } from '../@utils'

const FBOParticles = ({ renderer }) => {
	const texture1 = useLoader(THREE.TextureLoader, texturePng_1)
	const texture2 = useLoader(THREE.TextureLoader, texturePng_2)
	const texture3 = useLoader(THREE.TextureLoader, texturePng_3)
	// const josephGeometry = useLoader(PLYLoader, '/3D/JosephLow.ply')

	const [particles, setParticles] = useState(null)
	const [FBO_Object, setFBO_Object] = useState(null)


	useEffect(() => {
		// width and height of FBO
		const width = 156
		const height = 156

		// Populate a Float32Array of random positions
		let length = width * height * 3
		let data = getSphere(length, 4)

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
				uSpeed: { value: 0.007 },
				uCurlFreq: { value: .5 },
				uCursorPos: { value: new THREE.Vector3(0,0,0)}
			},
		})

		// Render shader material to display the particles on screen
		// the positions uniform will be set after the this.fbo.update() call
		const renderMaterial = new THREE.ShaderMaterial({
			vertexShader: particlesVertex,
			fragmentShader: particlesFragment,
			uniforms: {
				positions: { value: null },
				texture1: { value: texture1 },
				texture2: { value: texture2 },
				texture3: { value: texture3 },
				uCursorPos: { value: new THREE.Vector3(0, 0) },
				uPointSize: { value: 20. },
				uOpacity: { value: 0.75 },
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
			<primitive object={particles} position={[0, 0, 0]}  ></primitive>
		)
	)
}
export default FBOParticles
