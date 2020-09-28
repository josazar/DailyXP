import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useLoader, useFrame } from 'react-three-fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { fragmentShader } from './shader/fragment.js'
import { vertexShader } from './shader/vertex.js'
import { easeInOutQuart } from '../../utils/easing.utils'

// Models
import arbreDuo from './Models/arbre_duo_low.ply'
import tree_1 from './Models/tree_1_low.ply'
import arbre_liane_1 from './Models/arbre_liane_1_low.ply'
import arbre_liane_2 from './Models/arbre_liane_2_low.ply'
import arbre_riviere from './Models/arbre_riviere_low.ply'
import lieu_sacre from './Models/lieusacre_low.ply'
import menhir from './Models/menhir_low.ply'
import ruine from './Models/ruine_low.ply'

export const PointsCloudModel = (props) => {
	// ******************************************************************************
	// LOADER
	// *************************************************************
	const { models } = props
	const modelsUrl = [
		arbreDuo, // 0
		tree_1, // 1
		arbre_liane_1, // 2
		arbre_liane_2, // 3
		arbre_riviere, // 4
		lieu_sacre, // 5
		menhir, // 6
		ruine, // 7
	]
	const geometryA = useLoader(PLYLoader, modelsUrl[models[0]])
	const geometryB = useLoader(PLYLoader, modelsUrl[models[1]])
	// SUSPENSE REACT : WAIT FOR ALL THE ASSETS

	// ******************************************************************************
	// setup - vars whom don't re-render the component while changing
	// ******************************************************************************
	const ref = useRef()
	// let play = false
	let rewind = false
	let step = 0
	let [play, setPlay] = useState(false)

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
		if (i % 100 === 0) {
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
		if (step < 1 && play) step += 0.02
		else setPlay(false)

		// rewind
		if (step > 0 && rewind) step -= 0.02
		else rewind = false

		ref.current.material.uniforms.u_lerp.value = easeInOutQuart(step)
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
