import { useStore } from '../Store'
import React from 'react'

function SceneCounter() {
	const currentScene = useStore((state) => state.currentScene)
	return <h1>Scéne {currentScene}</h1>
}

function Controls() {
	const nextScene = useStore((state) => state.nextScene)
	const removeAllScene = useStore((state) => state.removeAllScenes)
	return (
		<div className="controller-btns">
			<button onClick={nextScene}>one up</button>
			<button onClick={removeAllScene}>Remove all scenes</button>
		</div>
	)
}

export const ControlsPanel = () => {
	return (
		<div className="controller">
			<Controls />
			<SceneCounter />
		</div>
	)
}
