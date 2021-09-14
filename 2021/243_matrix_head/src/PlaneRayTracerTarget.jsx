import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import useStore from './store'
import { Vector2 } from 'three'

function PlaneRayTracerTarget({ size }) {
	const { camera } = useThree()
	const ref = useRef()
	const refTarget = useRef()
	const pointer = new THREE.Vector3()
	const pointerSpace = new Vector2()

	// MouseEvent to get pointer 2D coordinates from -1 to 1 x/y - 0 at the center
	const onPointerMove = (event) => {
		pointer.x = event.point.x
		pointer.y = event.point.y
		pointer.z = event.point.z

		// The plane must always follow the camera
		ref.current.lookAt(camera.position)
		refTarget.current.position.set(pointer.x, pointer.y, pointer.z)

		useStore.setState({
			pointerSpace: { x: pointer.x, y: pointer.y, z: pointer.z },
		})
	}

	return (
		<group>
			<mesh ref={ref} onPointerMove={onPointerMove} visible={false}>
				<planeGeometry args={[20, 20, 1, 1]} />
			</mesh>
			<mesh ref={refTarget}>
				<sphereGeometry args={[0.025, 8, 8]} />
				<meshBasicMaterial
					color="yellow"
					// side={THREE.DoubleSide}
					transparent
					opacity={0.75}
				/>
			</mesh>
		</group>
	)
}

export default PlaneRayTracerTarget
