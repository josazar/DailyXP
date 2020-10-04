import { useFrame } from 'react-three-fiber'
import React, { useEffect, useRef } from 'react'

const posRef = []
const fireFlyNumber = 8
for (let i = 0; i < fireFlyNumber; i++) {
	let x = Math.random() * 3 - 2.5
	let y = Math.random()
	let z = Math.random() * 5 - 2.5
	let speed = Math.random()
	posRef.push([x, y, z, speed])
}

export const Firefly = () => {
	const groupRef = useRef(new Array(6))

	useFrame((state) => {
		const time = state.clock.elapsedTime
		for (let i = 0; i < posRef.length; i++) {
			let randX = posRef[i][0]
			let randY = posRef[i][1]
			let randZ = posRef[i][2]
			let speed = posRef[i][3]
			groupRef.current[i].position.x =
				Math.sin(time * randX * speed) * 0.6 + randX
			groupRef.current[i].position.y =
				Math.sin(time * randY - speed) * 0.5 + 1 + randY
			groupRef.current[i].position.z =
				Math.cos(time * randZ + speed) * 0.5 + randZ
		}
	})

	return (
		<>
			{posRef.map((item, index) => (
				<group key={index} ref={(group) => (groupRef.current[index] = group)}>
					<mesh>
						<sphereBufferGeometry args={[0.035, 24, 24]} />
						<meshBasicMaterial color={0xffff00} transparent opacity={0.45} />
					</mesh>
					<mesh>
						<sphereBufferGeometry args={[0.015, 12, 12]} />
						<meshBasicMaterial color={0xffff00} />
					</mesh>
				</group>
			))}
		</>
	)
}
