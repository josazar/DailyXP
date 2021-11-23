import React from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import FBOParticles from './FBOParticles'

const ScenePoints = () => {
	const { gl } = useThree()

	return (
		<group>
			<FBOParticles renderer={gl} />
		</group>
	)
}

export default ScenePoints
