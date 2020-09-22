import React, { useRef } from 'react'
import * as THREE from 'three'
import { useLoader, useFrame } from 'react-three-fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { fragmentShader } from './shader/fragment.js'
import { vertexShader } from './shader/vertex.js'

// Models
import arbre from './Models/Arbre_Liane_2.ply'
import arbreDuo from './Models/Arbre_Duo.ply'

export const PointsCloudModel = (props) => {
	const ref = useRef()
	const geometryA = useLoader(PLYLoader, arbre)
	const geometryB = useLoader(PLYLoader, arbreDuo)
	// avec <suspense></suspense> Il attend que les assets soient bien loadé

	let material = new THREE.ShaderMaterial({
		uniforms: {
			u_time: { type: 'f', value: 0 },
			u_lerp: { type: 'f', value: 0 },
			u_swirlStep: { type: 'f', value: 0 },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
	})

	let number = geometryA.attributes.color.count
	let colorsB = new Float32Array(number * 3)
	let positionB = new Float32Array(number * 3)
	let args = new Float32Array(number * 4) // (pindex, speeds, sizes)

	for (let i = 0; i < number; i++) {
		// colors.set(
		// 	[
		// 		geometryA.attributes.color.array[i * 3],
		// 		geometryA.attributes.color.array[i * 3 + 1],
		// 		geometryA.attributes.color.array[i * 3 + 2],
		// 	],
		// 	i * 3
		// )
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

	// geometryA.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	geometryA.setAttribute('colorB', new THREE.BufferAttribute(colorsB, 3))
	geometryA.setAttribute('positionB', new THREE.BufferAttribute(positionB, 3))
	geometryA.setAttribute('args', new THREE.BufferAttribute(args, 4))

	// RAF
	useFrame(() => {
		ref.current.material.uniforms.u_time.value += 0.05
	})

	//  COMPONENT
	// ******************************************************************************
	return (
		<group {...props}>
			<points geometry={geometryA} ref={ref}>
				<shaderMaterial attach="material" args={[material]} />
			</points>
		</group>
	)
}
