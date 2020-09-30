import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

import { useFrame, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { vertexShader } from './shader/vertex.js'
import { fragmentShader } from './shader/fragment.js'
import gltfURL from './gltf/scene-processed.glb'

export const Deer = () => {
	const actions = useRef({})
	let activeAction = useRef(null)
	let lastAction = useRef(null)

	// GLTF MODEL
	const gltf = useLoader(GLTFLoader, gltfURL)
	const material = new THREE.ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		uniforms: {
			u_time: { type: 'f', value: 0 },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
		skinning: true,
	})
	// Original material modification
	let deerSkinnedMesh =
		gltf.scene.children[0].children[0].children[0].children[0].children[0]
			.children[0].children[0].children[1]
	deerSkinnedMesh.material = material

	// Animations mixer
	// *******************************************
	const animations = gltf.animations
	const [mixer] = useState(() => new THREE.AnimationMixer(gltf.scene))

	// SETUP All Animations Actions
	// ********************************************
	useEffect(() => {
		actions.current = {
			eat1: mixer.clipAction(animations[7]),
			iddle2: mixer.clipAction(animations[20]),
			iddle3: mixer.clipAction(animations[21]),
			walkBack: mixer.clipAction(animations[51]),
			walkForward: mixer.clipAction(animations[52]),
			walkRight: mixer.clipAction(animations[55]),
			walkLeft: mixer.clipAction(animations[54]),
		}
		// Options
		actions.current.walkRight.setLoop(THREE.LoopOnce)
		actions.current.walkLeft.setLoop(THREE.LoopOnce)
		actions.current.walkRight.clampWhenFinished = true
		actions.current.walkLeft.clampWhenFinished = true

		// Play the initial actions
		activeAction.current = actions.current.walkForward
		activeAction.current.play()

		mixer.addEventListener('loop', (e) => {
			mixerLoopEventListener(e, actions.current)
		})

		return () => {
			animations.forEach((clip) => mixer.uncacheClip(clip))
		}
	}, [])

	// ANIMATIONS MIXER LOOP
	// ********************************************
	useFrame((state, delta) => {
		mixer.update(delta)
	})

	// setActions Animation
	// ********************************************

	const setAction = (toAction) => {
		if (toAction !== activeAction.current) {
			lastAction.current = activeAction.current
			activeAction.current = toAction
			//lastAction.stop()
			lastAction.current.fadeOut(0.5)
			activeAction.current.reset()
			activeAction.current.fadeIn(0.5)
			activeAction.current.play()
		}
	}

	return (
		<primitive
			object={gltf.scene}
			scale={[0.0075, 0.0075, 0.0075]}
			position={[0.8, 0, -1]}
		/>
	)
}

// Quoi faire après un cycle d'une action -
// Ex. "après tourner à gauche, modifier la position de l'objet" etc.
const mixerLoopEventListener = (e, actions) => {
	let model = e.action.getRoot()
	switch (e.action) {
		case actions.walkForward:
			model.position.z += 0.76
			break
		default:
			break
	}
}
