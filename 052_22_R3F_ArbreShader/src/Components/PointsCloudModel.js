import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useLoader, useThree, useUpdate, useFrame } from 'react-three-fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { fragmentShader } from './shader/fragment.js'
import { vertexShader } from './shader/vertex.js'

import arbre from './Models/Arbre_Liane_2.ply'
import scene from './Models/scene-processed.glb'
import water from './textures/water.jpg'

function PointsCloudModel(props) {
	const geometry = useLoader(PLYLoader, arbre)
	// const scene = useThree()
	// avec <suspense></suspense> il ne lit pas la suite ?

	let material = new THREE.ShaderMaterial({
		// extensions: {
		// 	derivatives: '#extension GL_OES_standard_derivatives : enable',
		// },
		uniforms: {
			u_time: { type: 'f', value: 0 },
			u_lerp: { type: 'f', value: 0 },
			u_swirlStep: { type: 'f', value: 0 },
			u_resolution: { type: 'v4', value: new THREE.Vector4() },
			uvRate1: {
				value: new THREE.Vector2(1, 1),
			},
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
		morphTargets: true,
	})

	let number = geometry.attributes.color.count
	let sizes = new Float32Array(number)
	for (let i = 0; i < number; i++) {
		sizes.set([Math.random()], i)
	}
	let colors = new Float32Array(number * 3)
	let colorsA = new Float32Array(number * 3)
	let positionA = new Float32Array(number * 3)
	const indices = new Float32Array(number)
	const speeds = new Float32Array(number)
	const phytoncides = new Float32Array(number)

	for (let i = 0; i < number; i++) {
		colors.set(
			[
				geometry.attributes.color.array[i * 3],
				geometry.attributes.color.array[i * 3 + 1],
				geometry.attributes.color.array[i * 3 + 2],
			],
			i * 3
		)
		colorsA.set(
			[
				geometry.attributes.color.array[i * 3],
				geometry.attributes.color.array[i * 3 + 1],
				geometry.attributes.color.array[i * 3 + 2],
			],
			i * 3
		)
		positionA.set(
			[
				geometry.attributes.position.array[i * 3],
				geometry.attributes.position.array[i * 3 + 1],
				geometry.attributes.position.array[i * 3 + 2],
			],
			i * 3
		)
		indices[i] = i
		speeds[i] = Math.random()

		if (i % 100 === 0) {
			phytoncides[i] = 1
		} else {
			phytoncides[i] = 0
		}
	}
	geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	geometry.setAttribute('colorA', new THREE.BufferAttribute(colorsA, 3))
	geometry.setAttribute('positionA', new THREE.BufferAttribute(positionA, 3))
	geometry.setAttribute('pindex', new THREE.BufferAttribute(indices, 1))
	geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))
	geometry.setAttribute('phytoncide', new THREE.BufferAttribute(phytoncides, 1))

	//  COMPONENT
	// ******************************************************************************
	return (
		<group {...props}>
			<points geometry={geometry}>
				{/* <bufferGeometry attach="geometry" geometry={geometry} /> */}
				{/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
				{/* <shaderMaterial {...material} /> */}
				<shaderMaterial
					attach="material"
					args={[material]}
					// uniforms-texture-value={waterTexture}
					// uniforms-displacement-value={dispImg}
				/>
			</points>
		</group>
	)
}

export { PointsCloudModel }
