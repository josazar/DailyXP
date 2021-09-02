import React from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import TreePoints from './TreePoints'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import FBOParticles from './FBOParticles'

const ScenePoints = () => {
	const treeGeometry = useLoader(PLYLoader, '/3D/tree_2.ply')
	const josephGeometry = useLoader(PLYLoader, '/3D/JosephLow.ply')

	const { gl } = useThree()

	return (
		<group>
			<TreePoints bufferGeometry={treeGeometry} />
			<TreePoints bufferGeometry={josephGeometry} />
			<FBOParticles renderer={gl} />
		</group>
	)
}

export default ScenePoints
