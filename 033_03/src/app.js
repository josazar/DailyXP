import * as THREE from 'three'
// import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import './styles.scss'
import { BufferGeometryLoader } from 'three'

const _ = {}
_.isUserInteracting = false
_.acc = 0.0002
_.velocity = 0.001
let time = 0
let width = window.innerWidth
let height = window.innerHeight
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.setClearColor(0x132c1c, 1)
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
const app = document.getElementById('app')
app.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)

// Camera position
camera.position.set(6, 1, -4)
const controls = new OrbitControls(camera, renderer.domElement)

// EVENTS
// **************************************
document.addEventListener('mousedown', onMouseDown, false)
document.addEventListener('mousemove', onMouseMove, false)
document.addEventListener('mouseup', onMouseUp, false)
window.addEventListener('resize', () => resize())

// ADD OBJECTS & SETUP
// **************************************
addObjects()
resize()
render()

// -------------------------------------------------------

function addObjects() {
	// LOAD PLY File
	var loader = new PLYLoader()

	loader.load('ply/lieusacre1_clean.ply', function (geometry) {
		console.log(geometry.attributes)
		geometry.computeVertexNormals()
		let colors = geometry.attributes.color
		_.material = new THREE.PointsMaterial({
			size: 0.005,
			flatShading: true,
			vertexColors: true, // Colors du PLY
		})
		geometry.computeBoundingSphere()
		_.mesh = new THREE.Points(geometry, _.material)
		_.mesh.position.x = 13
		_.mesh.position.y = 1
		_.mesh.position.z = 1
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
			// user interact
			// Move up
			if (_.isUserInteracting) {
				_.velocity += _.acc
				// _.acc += _.acc
				// _.velocity *= 0.5
				offsetY = (offsetY * _.velocity * i * 0.0002) / 10000
				offsetX = (offsetX * _.velocity * i * 0.0002) / 10000
				positions.setXYZ(i, px + offsetX, py + offsetY, pz)
			} else {
				positions.setXYZ(i, px + offsetX, py + offsetY, pz)
			}
		}
		positions.needsUpdate = true
	}
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

// ***************************************************

function resize() {
	width = window.innerWidth
	height = window.innerHeight
	renderer.setSize(width, height)
	camera.aspect = width / height
	camera.updateProjectionMatrix()
}

function onMouseDown(evt) {
	_.isUserInteracting = true
}
function onMouseMove(event) {}
function onMouseUp() {
	_.isUserInteracting = false
	_.velocity = 0.01
}
