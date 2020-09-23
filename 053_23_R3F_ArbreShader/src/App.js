import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls, Html } from 'drei'
import { PointsCloudModel } from './Components/pointsCloudModel/PointsCloudModel'
import { Water } from './Components/Water/Water'
import { PI } from './utils/math.utils'
import { ControlsPanel } from './UI/Controls'
import { LeafSystem } from './Components/OakLeafs/Leaf'

const Setup = () => {
	const { camera } = useThree()

	useFrame(() => {
		camera.lookAt(0, 1.5, 0)
	})

	return null
}

export default function App() {
	return (
		<>
			<Canvas camera={{ fov: 70, position: [0.5, 1.5, 5] }} colorManagement>
				<ambientLight intensity={0.5} />
				<spotLight position={[0, 10, 10]} angle={0.15} penumbra={1} />
				<Suspense fallback={<Html>loading..</Html>}>
					<PointsCloudModel position={[0, -2, 0]} />
					<Water position={[0, 0, 0]} />
					<LeafSystem position={[-1, 1, -1]} num={35} />
				</Suspense>

				<OrbitControls
					enableZoom={false}
					enableKeys={false}
					enablePan={false}
					maxPolarAngle={PI / 2.2}
				/>
				<Setup />
			</Canvas>
			<ControlsPanel />
		</>
	)
}
