import * as THREE from 'three'
// import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertexParticles.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

import './styles.scss'

var colors = require('nice-color-palettes')
let random = colors[Math.floor(Math.random() * 100)]
const _ = {}
_.isUserInteracting = false
let time = 0
let width = window.innerWidth
let height = window.innerHeight
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.setClearColor(0x081c10, 1)
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
const app = document.getElementById('app')
app.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)

// Camera position
camera.position.set(0, 4, 5)
const controls = new OrbitControls(camera, renderer.domElement)

// EVENTS
// **************************************
document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)
// document.addEventListener('mousemove', onMouseMove, false)
window.addEventListener('resize', () => resize())

addObjects()
resize()
render()

// -------------------------------------------------------

function addObjects() {
	// Plane
	var helper = new THREE.GridHelper(16, 32)
	helper.position.y = 2
	scene.add(helper)

	// Loading Manager
	var manager = new THREE.LoadingManager()
	manager.onStart = function (url, itemsLoaded, itemsTotal) {
		console.log(
			'Started loading file: ' +
				url +
				'.\nLoaded ' +
				itemsLoaded +
				' of ' +
				itemsTotal +
				' files.'
		)
	}

	manager.onLoad = function () {
		console.log('Loading complete!')

		startScene()
	}

	manager.onProgress = function (url, itemsLoaded, itemsTotal) {
		console.log(
			'Loading file: ' +
				url +
				'.\nLoaded ' +
				itemsLoaded +
				' of ' +
				itemsTotal +
				' files.'
		)
	}

	manager.onError = function (url) {
		console.log('There was an error loading ' + url)
	}

	_.sprite = new THREE.TextureLoader(manager).load('textures/disc.png')
	// Tree Mesh
	// LOAD PLY File
	let loader = new PLYLoader(manager)

	loader.load('ply/arbre_liane_clean_pivot.ply', function (geometry) {
		geometry.computeVertexNormals()
		geometry.computeBoundingSphere()

		let material = new THREE.PointsMaterial({
			size: 0.01,
			flatShading: true,
			vertexColors: true,
			map: _.sprite,
			transparent: true,
			alphaTest: 0.5,
			morphTargets: true,
		})
		_.tree1Mesh = new THREE.Points(geometry, material)
	})

	loader.load('ply/tree1_Clean_250.ply', function (geometry) {
		_.geometry2 = geometry
		_.geometry2.computeVertexNormals()
		_.geometry2.computeBoundingSphere()

		_.material2 = new THREE.PointsMaterial({
			size: 0.01,
			flatShading: true,
			vertexColors: true,
			map: _.sprite,
			transparent: true,
			alphaTest: 0.5,
			morphTargets: true,
		})
		_.geometry2.morphAttributes.position = []
	})
}

function startScene() {
	// Geometry
	let geometry = new THREE.BoxBufferGeometry(1, 2, 2, 128, 128, 128)
	// the original positions of the cube's vertices
	var positions = geometry.attributes.position.array
	// for the first morph target we'll move the cube's vertices onto the surface of a sphere
	var spherePositions = []

	for (var i = 0; i < positions.length; i += 3) {
		var x = positions[i]
		var y = positions[i + 1]
		var z = positions[i + 2]

		spherePositions.push(
			x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3),
			y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3),
			z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3)
		)
	}

	// add the spherical positions as the first morph target
	_.geometry2.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
		spherePositions,
		3
	)
	let tree1Position = _.tree1Mesh.geometry.attributes.position.array

	_.geometry2.morphAttributes.position[1] = new THREE.Float32BufferAttribute(
		tree1Position,
		3
	)

	_.tree2Mesh = new THREE.Points(_.geometry2, _.material2)
	scene.add(_.tree2Mesh)
	// scene.add(_.boxMesh)
	console.log(_.tree2Mesh.morphTargetInfluences)
}

function render() {
	time += 0.05
	let speed = 0.05

	// camera.position.x = Math.cos(time * speed) * 4
	// camera.position.z = Math.sin(time * speed) * 4

	let target = new THREE.Vector3(0, 3, 0)
	camera.lookAt(target)

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

function onKeyDown(evt) {
	let step = 0.05
	// console.log(evt)
	if (evt.key === 'a') {
		if (_.tree2Mesh.morphTargetInfluences[1] < 1)
			_.tree2Mesh.morphTargetInfluences[1] += step
	}
	if (evt.key === 'z') {
		if (_.tree2Mesh.morphTargetInfluences[1] > 0)
			_.tree2Mesh.morphTargetInfluences[1] -= step
	}

	if (evt.key === ' ') {
		_.isUserInteracting = true
	}
}
function onMouseMove(event) {}
function onKeyUp() {
	_.isUserInteracting = false
	_.velocity = 0.01
}
