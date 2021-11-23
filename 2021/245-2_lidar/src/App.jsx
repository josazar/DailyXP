import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ScenePoints from './scene/ScenePoints'
import { Toaster } from 'react-hot-toast'
import { Stats } from '@react-three/drei'

function App() {
	return (
		<div className="App">
			<div id="canvas-container">
				<Canvas>
					{/* <Particles /> */}
					<Suspense fallback={null}>
						<ScenePoints />
					</Suspense>
					<OrbitControls dampingFactor={0.5} />
				</Canvas>
			</div>
			<Stats showPanel={0} className="stats" />
			<Toaster/>
		</div>
	)
}

export default App
