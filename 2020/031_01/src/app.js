import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import './styles.scss'
import { BufferGeometryLoader } from 'three'

const _ = {}
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()
let width = window.innerWidth
let height = window.innerHeight
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.setClearColor(0x000000, 1)
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true

const app = document.getElementById('app')
app.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)

// Camera position
camera.position.set(2, -2.5, 8)

const controls = new OrbitControls(camera, renderer.domElement)
let time = 0

let paused = false

window.addEventListener('resize', () => resize())
addObjects()
resize()
render()
settings()

// -------------------------------------------------------

function addObjects() {
	// LOAD PLY File
	var loader = new PLYLoader()

	loader.load('ply/arbre-adaptation_Clean_250000.ply', function (geometry) {
		// console.log(geometry.attributes)
		geometry.computeVertexNormals()
		let colors = geometry.attributes.color

		_.material = new THREE.PointsMaterial({
			size: 0.01,

			flatShading: true,
			vertexColors: true, // Colors du PLY

			// shader
			// extensions: {
			// 	derivatives: '#extension GL_OES_standard_derivatives : enable',
			// },
			// uniforms: {
			// 	time: { type: 'f', value: 0 },
			// 	resolution: { type: 'v4', value: new THREE.Vector4() },
			// 	uvRate1: {
			// 		value: new THREE.Vector2(1, 1),
			// 	},
			// },
			// vertexShader: vertex,
			// fragmentShader: fragment,
		})

		geometry.computeBoundingSphere()

		_.mesh = new THREE.Points(geometry, _.material)
		scene.add(_.mesh)

		geometry.setAttribute(
			'initialPosition',
			geometry.attributes.position.clone()
		)
		_.initialPosition = geometry.attributes.initialPosition

		// datas
		let positions = _.mesh.geometry.attributes.position
		let count = positions.count
		_.speeds = []
		for (var i = 0; i < count; i++) {
			_.speeds.push(Math.random())
		}
	})
}

function render() {
	if (paused) return
	time += 0.05
	// console.log(Math.cos(time))
	if (_.material) {
		// _.material.size = (Math.cos(time) * 0.5 + 0.5) / 50
		// positions
		let positions = _.mesh.geometry.attributes.position
		let count = positions.count
		for (var i = 0; i < count; i++) {
			var px = _.initialPosition.getX(i)
			var py = _.initialPosition.getY(i)
			var pz = _.initialPosition.getZ(i)
			let offsetX = Math.cos(time * _.speeds[i]) * 0.01
			let offsetY = Math.sin(time * _.speeds[i]) * 0.01
			positions.setXYZ(i, px + offsetX, py + offsetY, pz)
		}
		positions.needsUpdate = true
	}
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

// ***************************************************

function settings() {
	_.settings = {
		time: 0,
	}
	_.gui = new dat.GUI()
	_.gui.add(_.settings, 'time', 0, 100, 0.01)
}
function resize() {
	width = window.innerWidth
	height = window.innerHeight
	renderer.setSize(width, height)
	camera.aspect = width / height
	camera.updateProjectionMatrix()
}
