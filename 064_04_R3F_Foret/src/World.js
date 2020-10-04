import { useFrame, useThree, useLoader } from 'react-three-fiber'
import React, { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import cameraScene from './3d/scene/CameraScene.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Deer } from './3d/Deer/Deer'
import { Water } from './3d/Water/Water'
import { PointsCloudModel } from './3d/pointsCloudModel/PointsCloudModel'
import { Firefly } from './3d/Firefly/Firefly'
import { LeafSystem } from './3d/OakLeafs/Leaf'
import { RainManager } from './3d/Rain/Rain.js'
import { OrbitControls, Html } from 'drei'

import { ExportAsPNG } from './utils/ExportAsPNG'

export const World = (props) => {
	// Load Camera Movements from Blender
	const gltf = useLoader(GLTFLoader, cameraScene)
	// This allow me to switch from defaultCamera to Blender Camera
	const { camera: defaultCamera, setDefaultCamera } = useThree()
	const mixer = useMemo(() => new THREE.AnimationMixer(), [])
	const camera = useRef()
	const group = useRef()
	const scene = useRef()
	const actions = useRef({})

	useFrame((state, delta) => {
		mixer.update(delta)
	})
	useEffect(() => {
		// Set new default cam
		setDefaultCamera(camera.current)
		console.log(gltf.animations)
		actions.current = {
			panoramique: mixer.clipAction(gltf.animations[0], group.current),
			travelling: mixer.clipAction(gltf.animations[1], group.current),
			turnAround: mixer.clipAction(gltf.animations[2], group.current),
			zoomIn: mixer.clipAction(gltf.animations[3], group.current),
		}
		// setup action
		actions.current.travelling.setLoop(THREE.LoopPingPong)
		// actions.current.travelling.clampWhenFinished = true
		actions.current.zoomIn.setLoop(THREE.LoopPingPong)
		// actions.current.zoomIn.clampWhenFinished = true
		actions.current.panoramique.setLoop(THREE.LoopPingPong)
		actions.current.turnAround.setLoop(THREE.LoopPingPong)
		// actions.current.panoramique.clampWhenFinished = true

		// Play Camera animation on mount, Root (group.current) correspond to all the World
		// actions.current.travelling.play()
		// Uncache animations and set back the original cam on unmount
		return () => {
			setDefaultCamera(defaultCamera)
			gltf.animations.forEach((clip) => mixer.uncacheClip(clip))
		}
	}, [])

	// ******************************************************************************
	// KEYBOARD EVENT
	// ******************************************************************************
	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			// travelling
			if (e.key === '0') {
				mixer.stopAllAction()
				actions.current.travelling.reset()
				actions.current.travelling.play()
			}
			// zoomIn
			if (e.key === '1') {
				mixer.stopAllAction()
				actions.current.zoomIn.reset()
				actions.current.zoomIn.play()
			}
			// panoramique
			if (e.key === '2') {
				mixer.stopAllAction()
				actions.current.panoramique.reset()
				actions.current.panoramique.play()
			}
			// turnAround
			if (e.key === '3') {
				mixer.stopAllAction()
				actions.current.turnAround.reset()
				actions.current.turnAround.play()
			}
		})
	}, []) // By passing an an empty Array, as dependency, the useEffect hook will only run a single time.

	return (
		<>
			<group ref={group} {...props}>
				<scene name="Scene" ref={scene}>
					{/* Camera replacement With Animation */}
					<object3D name="Camera">
						<perspectiveCamera
							ref={camera}
							name="Camera_Orientation"
							position={[2, 0.5, 5]}
							fov={30}
						/>
					</object3D>
					{/* 3D Models*/}
					<color attach="background" args={[0x0e0d27]} />
					<fog attach="fog" args={[0x0e0d27, 15, 25]} />
					<Water />
					<Deer position={[1.5, 0, -7.5]} />
					<PointsCloudModel
						models={[4, 6]}
						position={[4, -2, 1]}
						scene={scene.current}
					/>
					<PointsCloudModel
						models={[7, 0]}
						position={[-2, -2, -6]}
						scene={scene.current}
					/>
					<Firefly />
					<LeafSystem position={[-0.5, 1, -0.5]} />
					<RainManager />
					{/*
					<OrbitControls
						// enableZoom={false}
						enableKeys={false}
						// enablePan={false}
						maxPolarAngle={Math.PI / 2.1}
						dampingFactor={0.3}
					/> */}
				</scene>
			</group>
		</>
	)
}
