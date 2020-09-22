import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { LeafSystem } from './Components/Leaf'
import { OrbitControls, Html } from 'drei'
import { PointsCloudModel } from './Components/PointsCloudModel'

export default function App() {
	return (
		<div>
			<Canvas camera={{ fov: 70, position: [0.5, 2, 5.5] }} colorManagement>
				<ambientLight intensity={0.2} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[10, 10, 10]} />
				<Suspense fallback={<Html>loading..</Html>}>
					<PointsCloudModel position={[0, -2, 0]} />
				</Suspense>
				<OrbitControls />
			</Canvas>
		</div>
	)
}
