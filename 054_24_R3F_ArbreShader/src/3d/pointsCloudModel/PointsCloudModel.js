import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useLoader, useFrame, useThree } from 'react-three-fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { fragmentShader } from './shader/fragment.js'
import { vertexShader } from './shader/vertex.js'

// Models
import arbre from './Models/Arbre_Liane_2.ply'
import arbreDuo from './Models/Arbre_Duo.ply'
import arbre_1 from './Models/tree_1.ply'
import arbre_liane from './Models/arbre_liane_clean_pivot.ply'

export const PointsCloudModel = (props) => {
	// ******************************************************************************
	// LOADER
	// *************************************************************
	const geometryA = useLoader(PLYLoader, arbreDuo)
	const geometryB = useLoader(PLYLoader, arbre_liane)
	// SUSPENSE REACT : WAIT FOR ALL THE ASSETS

	// ******************************************************************************
	// setup - vars whom don't re-render the component while changing
	// ******************************************************************************
	const ref = useRef()
	let play = false
	let rewind = false
	const material = new THREE.ShaderMaterial({
		uniforms: {
			u_time: { type: 'f', value: 0 },
			u_lerp: { type: 'f', value: 0 },
			u_swirlStep: { type: 'f', value: 0 },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
	})
	const number = geometryA.attributes.color.count
	let colorsB = new Float32Array(number * 3)
	let positionB = new Float32Array(number * 3)
	let args = new Float32Array(number * 4) // (pindex, speeds, sizes)

	for (let i = 0; i < number; i++) {
		colorsB.set(
			[
				geometryB.attributes.color.array[i * 3],
				geometryB.attributes.color.array[i * 3 + 1],
				geometryB.attributes.color.array[i * 3 + 2],
			],
			i * 3
		)
		positionB.set(
			[
				geometryB.attributes.position.array[i * 3],
				geometryB.attributes.position.array[i * 3 + 1],
				geometryB.attributes.position.array[i * 3 + 2],
			],
			i * 3
		)
		let phy = 0
		if (i % 200 === 0) {
			phy = 1
		}
		// args = set(pIndex, Speeds, Sizes)
		args.set([i, Math.random(), Math.random(), phy], i * 4)
	}
	geometryA.setAttribute('colorB', new THREE.BufferAttribute(colorsB, 3))
	geometryA.setAttribute('positionB', new THREE.BufferAttribute(positionB, 3))
	geometryA.setAttribute('args', new THREE.BufferAttribute(args, 4))

	// ******************************************************************************
	// RAF
	// ******************************************************************************
	useFrame(() => {
		ref.current.material.uniforms.u_time.value += 0.05
		// play
		if (ref.current.material.uniforms.u_lerp.value < 1 && play)
			ref.current.material.uniforms.u_lerp.value += 0.02
		else play = false

		// rewind
		if (ref.current.material.uniforms.u_lerp.value > 0 && rewind)
			ref.current.material.uniforms.u_lerp.value -= 0.02
		else rewind = false
	})

	// ******************************************************************************
	// KEYBOARD EVENT
	// ******************************************************************************
	window.addEventListener('keydown', (e) => {
		if (e.key === 'a') {
			play = true
			rewind = false
		}
		if (e.key === 'z') {
			rewind = true
			play = false
		}
	})

	// ******************************************************************************
	//  COMPONENT
	// ******************************************************************************
	return (
		<group {...props}>
			<points geometry={geometryA} ref={ref}>
				<shaderMaterial args={[material]} />
			</points>
		</group>
	)
}
