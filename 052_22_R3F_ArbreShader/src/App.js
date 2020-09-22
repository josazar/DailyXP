import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls, Html } from 'drei'
import { PointsCloudModel } from './Components/PointsCloudModel'

export default function App() {
	return (
		<div>
			<Canvas camera={{ fov: 70, position: [0.5, 2, 3] }} colorManagement>
				<ambientLight intensity={0.5} />
				<spotLight position={[0, 10, 10]} angle={0.15} penumbra={1} />
				<Suspense fallback={<Html>loading..</Html>}>
					<PointsCloudModel position={[0, -3, 0]} />
				</Suspense>
				<OrbitControls />
			</Canvas>
		</div>
	)
}
