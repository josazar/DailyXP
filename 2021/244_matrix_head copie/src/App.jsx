import * as THREE from 'three'
import React, { Suspense } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ScenePoints from './scene/ScenePoints'
import { Stats } from '@react-three/drei'

function App() {
	return (
		<div className="App">
			<div id="canvas-container">
				<Canvas>
					<Suspense fallback={null}>
						<ScenePoints />
					</Suspense>
					<OrbitControls dampingFactor={0.05} />
				</Canvas>
				<Stats showPanel={0} className="stats" />
			</div>
		</div>
	)
}

export default App
