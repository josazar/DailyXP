import React, { useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'

const colors = ['#A2FFB6', '#AAEEB5', '#EE786E', '#EE786E']

function LeafSystem(props) {
	let { num } = props
	const coords = new Array(num)
		.fill()
		.map((i) => [
			Math.random() * 4 - 2,
			Math.random() * 4 - 2,
			Math.random() * 4 - 2,
		])
	return (
		<group {...props}>
			{coords.map(([p1, p2, p3], i) => (
				<Leaf key={i} position={[p1, p2, p3]} />
			))}
		</group>
	)
}

function Leaf(props) {
	const mesh = useRef()
	const [color] = useState(
		() => colors[parseInt(colors.length * Math.random())]
	)

	let t = Math.random() * 100
	let speed = 0.01 + Math.random() / 200
	let factor = 2 + Math.random() * 10
	let xFactor = Math.random()
	let yFactor = Math.random()
	let zFactor = Math.random()

	useFrame(() => {
		t += speed
		const s = Math.cos(t)
		mesh.current.scale.set(s, s, s)
		mesh.current.position.set(
			xFactor + Math.cos((t / 30) * factor) + (Math.sin(t * 1) * factor) / 10,
			yFactor + Math.sin((t / 20) * factor) + (Math.cos(t * 2) * factor) / 10,
			zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 20
		)
		mesh.current.rotation.z += 0.05 * xFactor
		mesh.current.rotation.y += 0.01 * yFactor
		mesh.current.translateY(-0.5)
	})

	return (
		<mesh {...props} ref={mesh}>
			<boxBufferGeometry attach="geometry" args={[0.1, 0.001, 0.05]} />
			<meshStandardMaterial attach="material" color={color} />
		</mesh>
	)
}
export { LeafSystem }
