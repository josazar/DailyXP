import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { useStore } from '../../Store'

const lightgreen = new THREE.Color('lightgreen')
const geometry = new THREE.BoxBufferGeometry(0.01, 0.1, 0.01)
const acornMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })

export const RainManager = () => {
	const acornGroup = useRef()
	const acorns = useStore((state) => state.acorns)
	const wait = 800

	useFrame((state, delta) => {
		for (let i = 0; i < acorns.length; i++) {
			// Falling acorn
			acornGroup.current.children[i].children[0].position.y -= 0.1
			// Water rings
			// wait an instant before to see the waves circles
			let diff = Date.now() - acorns[i].time
			if (diff < wait) {
				acornGroup.current.children[i].children[1].material.opacity = 0
				acornGroup.current.children[i].children[2].material.opacity = 0
			}
			if (diff > wait && diff < wait + 200) {
				acornGroup.current.children[i].children[1].material.opacity = 1
				acornGroup.current.children[i].children[2].material.opacity = 1
			}
			if (diff > wait + 200) {
				acornGroup.current.children[i].children[1].material.opacity -= 0.01
				acornGroup.current.children[i].children[2].material.opacity -= 0.01
				acornGroup.current.children[i].children[1].geometry.scale(
					1.02 - diff / 200000,
					1.02 - diff / 200000,
					1.02 - diff / 200000
				)
				acornGroup.current.children[i].children[2].geometry.scale(
					1.02 - diff / 200000,
					1.02 - diff / 200000,
					1.02 - diff / 200000
				)
				if (diff > 3000) {
					acornGroup.current.children[i].children[1].position.y = -1
					acornGroup.current.children[i].children[2].position.y = -1
				}
			}
		}
	})

	return (
		<group ref={acornGroup}>
			{acorns.map((t, i) => (
				<group key={i} position={[acorns[i].x, 0, acorns[i].z]}>
					<mesh
						position={[0, 5, 0]}
						geometry={geometry}
						material={acornMaterial}
					/>
					{/* Water circle */}
					<mesh rotation={[Math.PI / 2, 0, 0]}>
						<ringGeometry args={[0.08, 0.084, 32]} />
						<meshBasicMaterial transparent side={THREE.DoubleSide} />
					</mesh>
					<mesh rotation={[Math.PI / 2, 0, 0]}>
						<ringGeometry args={[0.04, 0.041, 32]} />
						<meshBasicMaterial transparent side={THREE.DoubleSide} />
					</mesh>
				</group>
			))}
		</group>
	)
}
