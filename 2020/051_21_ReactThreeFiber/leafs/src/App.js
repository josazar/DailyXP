import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { Box, LeafSystem } from './Components/Leaf'
import { OrbitControls } from 'drei'
import {
	EffectComposer,
	DepthOfField,
	Bloom,
	Noise,
	Vignette,
} from 'react-postprocessing'

export default function App() {
	return (
		<Canvas colorManagement>
			<ambientLight intensity={0.2} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
			<pointLight position={[-10, -10, -10]} />
			<LeafSystem position={[0, 0, 0]} />
			<OrbitControls />
			<EffectComposer>
				<DepthOfField
					focusDistance={0}
					focalLength={0.02}
					bokehScale={2}
					height={880}
				/>
				{/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.49} height={800} /> */}
				<Noise opacity={0.2} />
			</EffectComposer>
		</Canvas>
	)
}
