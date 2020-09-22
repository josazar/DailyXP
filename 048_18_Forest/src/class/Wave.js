import * as THREE from 'three'
import { Vector3 } from 'three'
import { PI } from '../utils/math.utils'

export default class Wave {
	constructor(vPosition) {
		this.wavesMesh = []
		this.timer = 0
		this.speed = 0.01
		this.duration = 2
		this.nbWaves = 3
		this.died = false
		this.container = new THREE.Group()
		this.container.position.set(vPosition.x, vPosition.y, vPosition.z)
		this.container.rotation.x = PI / 2
		// init first Ring
		this.createRing()
	}
	createRing() {
		let ring = new Ring()
		this.wavesMesh.push(ring)

		this.container.add(ring.mesh)
	}
	update() {
		this.timer += this.speed
		if (this.nbWaves === 0) {
			this.died = true
			return
		}
		if (this.timer > 0.45 && this.nbWaves > 1) {
			this.createRing()
			this.timer = 0
			this.nbWaves -= 1
		}
		for (let i = 0; i < this.wavesMesh.length; i++) {
			const element = this.wavesMesh[i]
			if (!element.died) {
				element.opacity -= 0.0075
				element.scale += 0.25
				element.update()
			} else {
				this.container.remove(element.mesh)
			}
		}
	}
}

class Ring {
	constructor() {
		this.died = false
		this.opacity = 1
		this.scale = 1

		this.data = {
			innerRadius: 0.01,
			outerRadius: 0.0104,
			thetaSegments: 24,
		}
		let geometry = new THREE.RingGeometry(
			this.data.innerRadius,
			this.data.outerRadius,
			this.data.thetaSegments
		)
		let material = new THREE.MeshBasicMaterial({
			transparent: true,
			side: THREE.DoubleSide,
		})
		this.mesh = new THREE.Mesh(geometry, material)
	}
	update() {
		if (this.opacity <= 0) {
			this.died = true
			return
		}
		this.mesh.scale.set(this.scale, this.scale, this.scale)
		this.mesh.material.opacity = this.opacity
		this.mesh.scale.set(this.scale, this.scale, this.scale)
	}
}
