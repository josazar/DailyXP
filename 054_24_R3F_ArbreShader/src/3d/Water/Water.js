import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { Reflector } from './Reflector'

export const Water = (props) => {
	const ref = useRef()
	const waterFake = useRef()

	var geometry = new THREE.CircleBufferGeometry(40, 32)
	let water = new Reflector(geometry, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0x999999,
		depthBuffer: true,
	})
	water.material.transparent = true
	water.material.uniforms.opacity.value = 0.25
	water.rotateX(-Math.PI / 2)
	// waterFake.current.rotateX(-Math.PI / 2)
	console.log(waterFake)

	useFrame(() => {
		water.material.uniforms.u_time.value += 0.05
	})

	return (
		<group>
			<primitive object={water} ref={ref} {...props}></primitive>
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -0.1, 0]}
				name="waterFake"
			>
				<circleBufferGeometry args={[40, 32]} />
				<meshBasicMaterial color={'#15192c'} />
			</mesh>
		</group>
	)
}
