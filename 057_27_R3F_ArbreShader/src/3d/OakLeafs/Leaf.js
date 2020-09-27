import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame, useLoader } from 'react-three-fiber'
import texture from './texture/oak_leaf.png'

const LeafsNumber = 24

function LeafSystem(props) {
	const ref = useRef()
	const textureLeaf = useLoader(THREE.TextureLoader, texture)

	let dist = 6
	const coords = new Array(LeafsNumber)
		.fill()
		.map((i) => [
			Math.random() * dist - dist / 2,
			Math.random() * dist - dist / 2,
			Math.random() * dist - dist / 2,
		])

	useFrame(() => {
		ref.current.rotation.y += 0.005
	})
	return (
		<group {...props} ref={ref}>
			{coords.map(([p1, p2, p3], i) => (
				<Leaf key={i} position={[p1, p2, p3]} map={textureLeaf} />
			))}
		</group>
	)
}

function Leaf(props) {
	const mesh = useRef()
	const { map } = props
	const velocity = new THREE.Vector3(0, -Math.random() / 100, 0)
	let xFactor = Math.random()
	let yFactor = Math.random()

	useFrame(() => {
		if (mesh.current.position.y < -1) {
			mesh.current.position.y = 4
			velocity.y = 0
		}
		velocity.y -= Math.random() * 0.000025
		mesh.current.position.y += velocity.y
		mesh.current.rotation.z += 0.05 * xFactor
		mesh.current.rotation.y += 0.1 * yFactor
	})

	return (
		<mesh {...props} ref={mesh}>
			<planeBufferGeometry attach="geometry" args={[0.1, 0.05]} />
			<meshBasicMaterial
				attach="material"
				map={map}
				transparent
				side={THREE.DoubleSide}
			/>
		</mesh>
	)
}
export { LeafSystem }
