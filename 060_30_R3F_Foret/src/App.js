import React, { Suspense } from 'react'
import * as THREE from 'three'

import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls, Html } from 'drei'
import { PointsCloudModel } from './3d/pointsCloudModel/PointsCloudModel'
import { Water } from './3d/Water/Water'
import { PI } from './utils/math.utils'
import { LeafSystem } from './3d/OakLeafs/Leaf'
import { RainManager } from './3d/Rain.js'
import { useStore } from './Store'
import FPSStats from 'react-fps-stats'
import { Deer } from './3d/Deer/Deer'

const CameraLookAt = () => {
	const { camera } = useThree()
	useFrame(() => {
		camera.lookAt(0, 1.75, 0)
	})
	return null
}

export default function App() {
	const actions = useStore((state) => state.actions)

	return (
		<>
			<Canvas
				camera={{ fov: 70, position: [0, 2, 2] }}
				colorManagement
				onClick={actions.rain}
				id="mainCanvas"
			>
				<ExportAsPNG />>
				<color attach="background" args={['#0c1216']} />
				<fog attach="fog" args={['#11191f', 2, 10]} />
				<Suspense
					fallback={
						<Html>
							<h2 className="loader-txt">Loading assets...</h2>
						</Html>
					}
				>
					<Water />
					<PointsCloudModel models={[0, 2]} position={[-1, -2, 0]} />
					<Deer />
					<LeafSystem position={[-0.5, 1, -0.5]} />
					<RainManager />
				</Suspense>
				<OrbitControls
					// enableZoom={false}
					enableKeys={false}
					// enablePan={false}
					maxPolarAngle={PI / 2}
					dampingFactor={0.3}
				/>
				<CameraLookAt />
			</Canvas>
			<div className="fps-counter">
				<FPSStats />
			</div>
		</>
	)
}

const ExportAsPNG = () => {
	const { scene, camera } = useThree()

	const rendererExport = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	})
	rendererExport.setSize(window.innerWidth, window.innerHeight)

	window.addEventListener('keydown', (e) => {
		if (e.key === 'p') {
			rendererExport.render(scene, camera)
			const dataURL = rendererExport.domElement.toDataURL('image/png')
			window.open(dataURL)
		}
	})

	return null
}
