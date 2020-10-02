import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { Reflector } from './Reflector'

export const Water = (props) => {
	const ref = useRef()
	var geometry = new THREE.CircleBufferGeometry(80, 32)
	let water = new Reflector(geometry, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0x0e0d27,
		depthBuffer: true,
	})
	water.material.transparent = true
	water.material.uniforms.opacity.value = 0.25
	water.rotateX(-Math.PI / 2)

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
				<circleBufferGeometry args={[82, 32]} />
				<meshBasicMaterial color={'#2b474f'} depthTest={true} />
			</mesh>
		</group>
	)
}
