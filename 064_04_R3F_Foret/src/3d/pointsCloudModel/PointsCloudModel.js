import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLoader, useFrame, useThree } from 'react-three-fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { fragmentShader } from './shader/fragment.js'
import { vertexShader } from './shader/vertex.js'
import { easeInOutQuart } from '../../utils/easing.utils'

// Models
import arbreDuo from './Models/arbre_duo_low.ply'
import tree_1 from './Models/tree_1_low_decoupe.ply'
import arbre_liane_1 from './Models/arbre_liane_1_low_decoupe.ply'
import arbre_liane_2 from './Models/arbre_liane_2_low_decoupe.ply'
import arbre_riviere from './Models/arbre_riviere_low_decoupe.ply'
import lieu_sacre from './Models/lieusacre_low_decoupe.ply'
import menhir from './Models/menhir_low_decoupe.ply'
import ruine from './Models/ruine_low_decoupe.ply'

export const PointsCloudModel = (props) => {
	// ******************************************************************************
	// setup - vars whom don't re-render the component while changing
	// ******************************************************************************
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
	const ratioPhytoncides = 50 // 1 sur x
	let step = 0
	let swirlStep = 0
	const ref = useRef()
	const play = useRef(false)
	const rewind = useRef(false)
	const swirl = useRef(false)
	// const { scene } = useThree()
	const { scene } = props

	// ******************************************************************************
	// LOADER
	// *************************************************************
	const { models } = props
	const geometryA = useLoader(PLYLoader, modelsUrl[models[0]])
	const geometryB = useLoader(PLYLoader, modelsUrl[models[1]])
	const material = new THREE.ShaderMaterial({
		uniforms: {
			u_time: { type: 'f', value: 0 },
			u_lerp: { type: 'f', value: 0 },
			u_swirlStep: { type: 'f', value: 0 },
			fogColor: { type: 'c', value: scene.fog.color },
			fogNear: { type: 'f', value: scene.fog.near },
			fogFar: { type: 'f', value: scene.fog.far },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
		alphaTest: 0.25,
		blending: THREE.NormalBlending,
		depthTest: true,
		fog: true,
	})

	//
	// *****************************************************
	useEffect(() => {
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
			if (i % ratioPhytoncides === 0) {
				phy = 1
			}
			// args = set(pIndex, Speeds, Sizes)
			args.set([i, Math.random(), Math.random(), phy], i * 4)
		}
		geometryA.setAttribute('colorB', new THREE.BufferAttribute(colorsB, 3))
		geometryA.setAttribute('positionB', new THREE.BufferAttribute(positionB, 3))
		geometryA.setAttribute('args', new THREE.BufferAttribute(args, 4))
	}, [
		geometryA,
		geometryB.attributes.color.array,
		geometryB.attributes.position.array,
	])

	// ******************************************************************************
	// RAF
	// ******************************************************************************
	useFrame(() => {
		ref.current.material.uniforms.u_time.value += 0.05
		// play
		if (step < 1 && play.current) step += 0.02
		else play.current = false

		// rewind
		if (step > 0 && rewind.current) step -= 0.02
		else rewind.current = false
		ref.current.material.uniforms.u_lerp.value = easeInOutQuart(step)

		// swirl
		if (swirl.current && swirlStep < 1) swirlStep += 0.015
		if (!swirl.current && swirlStep > 0) swirlStep -= 0.01
		ref.current.material.uniforms.u_swirlStep.value = easeInOutQuart(swirlStep)
	})

	// ******************************************************************************
	// KEYBOARD EVENT
	// ******************************************************************************
	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'a') {
				play.current = true
				rewind.current = false
			}
			if (e.key === 'z') {
				rewind.current = true
				play.current = false
			}
			if (e.key === ' ') {
				swirl.current = !swirl.current
			}
		})
	}, []) // By passing an an empty Array, as dependency, the useEffect hook will only run a single time.

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
