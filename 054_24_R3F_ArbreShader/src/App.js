import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls, Html } from 'drei'
import { PointsCloudModel } from './3d/pointsCloudModel/PointsCloudModel'
import { Water } from './3d/Water/Water'
import { PI } from './utils/math.utils'
import { ControlsPanel } from './UI/Controls'
import { LeafSystem } from './3d/OakLeafs/Leaf'
import { RainManager } from './3d/Rain.js'
import { useStore } from './Store'

const CameraLookAt = () => {
	const { camera } = useThree()
	useFrame(() => {
		camera.lookAt(0, 1.5, 0)
	})

	return null
}

export default function App() {
	const actions = useStore((state) => state.actions)
	return (
		<>
			<Canvas
				camera={{ fov: 70, position: [0.5, 1.5, 4] }}
				colorManagement
				onClick={actions.rain}
			>
				<ambientLight intensity={0.5} />
				<spotLight position={[0, 10, 10]} angle={0.15} penumbra={1} />
				<Suspense
					fallback={
						<Html>
							<h2 className="loader-txt">Loading assets...</h2>
						</Html>
					}
				>
					{/* <PointsCloudModel position={[0, -2, 0]} /> */}
					<Water />
					<RainManager />
					<LeafSystem position={[-0.5, 1, -0.5]} />
				</Suspense>

				<OrbitControls
					// enableZoom={false}
					enableKeys={false}
					enablePan={false}
					maxPolarAngle={PI / 2.2}
				/>
				<CameraLookAt />
			</Canvas>
			<ControlsPanel />
		</>
	)
}
