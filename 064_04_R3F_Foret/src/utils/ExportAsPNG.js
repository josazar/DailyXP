import * as THREE from 'three'
import React, { useRef } from 'react'

export const ExportAsPNG = (props) => {
	const { scene, camera } = props

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
