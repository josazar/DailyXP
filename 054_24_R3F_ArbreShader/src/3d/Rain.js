import * as THREE from 'three'
import { PI } from '../utils/math.utils'
import React, { useState, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { Group, Vector3 } from 'three'
import { Wave } from './Water/Wave'
import { useStore } from '../Store'

const lightgreen = new THREE.Color('lightgreen')
const geometry = new THREE.BoxBufferGeometry(0.01, 0.5, 0.01)
const laserMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })

/**
 * Rain Manager
 *
 */
export const RainManager = () => {
	const container = useRef()
	const acornGroup = useRef()
	const acorns = useStore((state) => state.acorns)
	const actions = useStore((state) => state.actions)
	let waves = []

	// window.addEventListener('keydown', (e) => {
	// 	if (e.key === 'r') {
	// 		let wave = new Wave(
	// 			new Vector3(Math.random() * 3 - 1.5, 0, Math.random() * 2 - 1)
	// 		)
	// 		container.current.add(wave.container)
	// 		waves.push(wave)
	// 	}
	// })

	useFrame(() => {
		// Water waves
		for (let i = 0; i < waves.length; i++) {
			const element = waves[i]
			element.update()
		}
		// falling acorns
		let toRemove = null
		for (let i = 0; i < acorns.length; i++) {
			const group = acornGroup.current.children[i]
			group.position.y -= 0.1
		}
	})
	return (
		<group ref={container}>
			<group ref={acornGroup}>
				{acorns.map((t, i) => (
					<group key={i}>
						<mesh
							position={[acorns[i].x, 5, acorns[i].z]}
							geometry={geometry}
							material={laserMaterial}
						/>
					</group>
					// Waves
				))}
				{acorns.map((t, i) => (
					<Wave key={i} position={[acorns[i].x, 0, acorns[i].z]}></Wave>
				))}
				{/* <Wave position={new Vector3(0, 1, 0)}></Wave> */}
			</group>
		</group>
	)
}
