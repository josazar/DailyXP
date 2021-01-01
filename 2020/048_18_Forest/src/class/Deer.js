import * as THREE from 'three'

import vertexDeer from '../shader/vertexDeer.glsl'
import fragmentDeer from '../shader/fragmentDeer.glsl'
import { keyControls } from '../app.js'

export default class Deer {
	constructor(gltf) {
		this.gltf = gltf
		this.model = gltf.scene
		this.position = null
		this.direction = new THREE.Vector2(0, 0)

		this.actions = {}
		this.activeAction
		this.lastAction
		this.material = null
		this.mixer = null
	}
	init() {
		this.material = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			// side: THREE.DoubleSide,
			uniforms: {
				u_time: { type: 'f', value: 0 },
				u_resolution: { type: 'v4', value: new THREE.Vector4() },
			},
			vertexShader: vertexDeer,
			fragmentShader: fragmentDeer,
			transparent: true,
			skinning: true,
		})

		let deerSkinnedMesh = this.model.children[0].children[0].children[0]
			.children[0].children[0].children[0].children[0].children[2]

		deerSkinnedMesh.material = this.material

		let scale = 0.0075
		this.model.scale.set(scale, scale, scale)
		this.model.position.y = 2
		this.model.position.x = 0.8
		this.model.position.z = -1
		// model.rotateY(PI / 3.2)
		// scene.add(model)

		// ANIMATIONS MIXER
		var animations = this.gltf.animations
		this.mixer = new THREE.AnimationMixer(this.model)
		this.mixer.timeScale = 0.8
		this.mixer.addEventListener('loop', (e) => {
			this.mixerLoopEventListener(e)
		})
		// Settings Actions
		this.actions.eat1 = this.mixer.clipAction(animations[7])
		this.actions.iddle2 = this.mixer.clipAction(animations[20])
		this.actions.iddle3 = this.mixer.clipAction(animations[21])
		this.actions.walkBack = this.mixer.clipAction(animations[51])
		this.actions.walkForward = this.mixer.clipAction(animations[52])
		this.actions.walkRight = this.mixer.clipAction(animations[55])
		this.actions.walkLeft = this.mixer.clipAction(animations[54])

		// Options
		this.actions.walkRight.setLoop(THREE.LoopOnce)
		this.actions.walkLeft.setLoop(THREE.LoopOnce)
		this.actions.walkRight.clampWhenFinished = true
		this.actions.walkLeft.clampWhenFinished = true
		// Default Action
		this.activeAction = this.actions.iddle2
		this.actions.iddle2.play()
	}

	// setActions Animation
	// ***************************************
	setAction(toAction) {
		if (toAction !== this.activeAction) {
			this.lastAction = this.activeAction
			this.activeAction = toAction
			//lastAction.stop()
			this.lastAction.fadeOut(0.5)
			this.activeAction.reset()
			this.activeAction.fadeIn(0.5)
			this.activeAction.play()
		}
	}

	setDirection(controls) {}

	rotate() {}

	move() {
		this.model.position.x += this.direction.x
	}
	/**
	 *
	 * @param {*} e
	 */
	mixerLoopEventListener(e) {
		let model = e.action.getRoot()

		switch (e.action) {
			case this.actions.walkForward:
				model.position.z += 0.76
				break
			case this.actions.walkBack:
				model.position.z -= 0.76
				break
			case this.actions.walkLeft:
				model.position.z -= 0.76
				break
			case this.actions.walkRight:
				model.position.z -= 0.76
				break
		}
	}
}
