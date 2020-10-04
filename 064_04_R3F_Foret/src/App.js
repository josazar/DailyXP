import React, { Suspense } from 'react'
import * as THREE from 'three'

import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls, Html } from 'drei'
import { PointsCloudModel } from './3d/pointsCloudModel/PointsCloudModel'
import { Water } from './3d/Water/Water'
import { PI } from './utils/math.utils'
import { LeafSystem } from './3d/OakLeafs/Leaf'
// import { RainManager } from './3d/Rain.js'
import { useStore } from './Store'
import FPSStats from 'react-fps-stats'
import { Deer } from './3d/Deer/Deer'
import { Firefly } from './3d/Firefly/Firefly'
import { World } from './World'

export default function App() {
	const actions = useStore((state) => state.actions)

	return (
		<>
			<Canvas
				camera={{ fov: 70, position: [0, 2, 4] }}
				colorManagement
				onClick={actions.rain}
				id="mainCanvas"
			>
				{/* <OrbitControls
					enableZoom={false}
					enableKeys={false}
					enablePan={false}
					maxPolarAngle={PI / 2.4}
					dampingFactor={0.3}
				/> */}
				<Suspense fallback={null}>
					<World />
				</Suspense>
			</Canvas>
			<div className="fps-counter">
				<FPSStats />
			</div>
		</>
	)
}
