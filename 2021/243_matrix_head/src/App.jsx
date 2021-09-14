import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { getPoint, getSphere } from './@utils'
import { OrbitControls } from '@react-three/drei'
import PlaneRayTracerTarget from './PlaneRayTracerTarget'
import ScenePoints from './scene/ScenePoints'

function App() {
	return (
		<div className="App">
			<div id="canvas-container">
				<Canvas>
					<PlaneRayTracerTarget />
					{/* <Particles /> */}
					<Suspense fallback={null}>
						<ScenePoints />
					</Suspense>
					<OrbitControls dampingFactor={0.05} />
				</Canvas>
			</div>
		</div>
	)
}

export default App
