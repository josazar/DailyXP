import * as THREE from 'three'
import useStore from '../store'

export default class FBO {
	constructor(width, height, renderer, simulationMaterial, renderMaterial) {
		this.width = width
		this.height = height
		this.renderer = renderer
		this.simulationMaterial = simulationMaterial
		this.renderMaterial = renderMaterial

		this.gl = this.renderer.getContext()
		this.init()
	}

	init() {
		this.createTarget()
		this.simSetup()
		this.createParticles()
	}

	createTarget() {
		// Render target's scene and camera
		this.scene = new THREE.Scene()
		this.camera = new THREE.OrthographicCamera(
			-1,
			1,
			1,
			-1,
			1 / Math.pow(2, 53),
			1
		)

		// Create a render target texture
		this.rtt = new THREE.WebGLRenderTarget(this.width, this.height, {
			minFilter: THREE.NearestFilter, // Important because we want to sample square pixels
			magFilter: THREE.NearestFilter,
			format: THREE.RGBFormat, // Or RGBAFormat instead (to have a color for each particle, for example)
			type: THREE.FloatType, // Important because we need precise coordinates (not ints)
		})
	}

	simSetup() {
		// Simulation
		// Create a bi-unit quadrilateral that uses the simulation material to update the float texture
		const geometry = new THREE.BufferGeometry()
		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(
				new Float32Array([
					-1, -1, 0, 1, -1, 0, 1, 1, 0,

					-1, -1, 0, 1, 1, 0, -1, 1, 0,
				]),
				3
			)
		)

		geometry.setAttribute(
			'uv',
			new THREE.BufferAttribute(
				new Float32Array([
					0, 1, 1, 1, 1, 0,

					0, 1, 1, 0, 0, 0,
				]),
				2
			)
		)

		this.mesh = new THREE.Mesh(geometry, this.simulationMaterial)

		this.scene.add(this.mesh)
	}

	createParticles() {
		// Create a vertex buffer of size width * height with normalized coordinates
		const length = this.width * this.height
		let vertices = new Float32Array(length * 3)
		for (let i = 0; i < length; i++) {
			let i3 = i * 3
			vertices[i3 + 0] = (i % this.width) / this.width
			vertices[i3 + 1] = i / this.width / this.height
		}

		// Create the particles geometry
		const geometry = new THREE.BufferGeometry()
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

		// The renderMaterial is used to render the particles
		this.particles = new THREE.Points(geometry, this.renderMaterial)
	}

	update(time) {
		// Update the simulation and render the result to a target texture
		this.renderer.setRenderTarget(this.rtt)
		this.renderer.clear()
		this.renderer.render(this.scene, this.camera)
		this.renderer.setRenderTarget(null)

		// Use the result of the swap as the new position for the particles' renderer
		this.particles.material.uniforms.positions.value = this.rtt.texture
		this.particles.material.uniforms.uCursorPos.value = useStore.getState().pointerSpace


		this.simulationMaterial.uniforms.uTime.value = time
	}
}
