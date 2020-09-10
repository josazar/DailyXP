import * as THREE from 'three'
// import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertexParticles.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

import './styles.scss'

var colors = require('nice-color-palettes')
let random = colors[Math.floor(Math.random() * 100)]
const _ = {
	isUserInteracting: false,
	playMorph: false,
	rewindMorph: false,
}

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

loadObjects()
resize()

// -------------------------------------------------------

function loadObjects() {
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
		addObjects()
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

	// LOADING ASSETS
	_.sprite = new THREE.TextureLoader(manager).load('textures/disc.png')

	// LOAD PLY File
	let loader = new PLYLoader(manager)
	// Tree 1
	loader.load('ply/arbre_liane_clean_pivot.ply', function (geometry) {
		geometry.computeBoundingSphere()
		_.geometry1 = geometry
		_.material1 = new THREE.PointsMaterial({
			size: 0.02,
			flatShading: true,
			vertexColors: true,
			map: _.sprite,
			transparent: true,
			alphaTest: 0.5,
			morphTargets: true,
		})
		_.tree1Mesh = new THREE.Points(_.geometry1, _.material1)
	})

	// Tree 2
	loader.load('ply/tree1_Clean_250.ply', function (geometry) {
		_.geometry2 = geometry
		_.material2 = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: { type: 'f', value: 0 },
				lerp: { type: 'f', value: 0 },
				resolution: { type: 'v4', value: new THREE.Vector4() },
				uvRate1: {
					value: new THREE.Vector2(1, 1),
				},
			},
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			morphTargets: true,
		})
	})
}

function addObjects() {
	// Plane
	var helper = new THREE.GridHelper(16, 32)
	helper.position.y = 2
	// scene.add(helper)

	// morphAttributes

	let number = _.geometry2.attributes.color.count
	let sizes = new Float32Array(number)

	for (let i = 0; i < number; i++) {
		sizes.set([Math.random()], i)
	}

	let colors = new Float32Array(number * 3)
	let colorsA = new Float32Array(number * 3)
	let positionA = new Float32Array(number * 3)
	const indices = new Uint16Array(number)

	for (let i = 0; i < number; i++) {
		colors.set(
			[
				_.geometry2.attributes.color.array[i * 3],
				_.geometry2.attributes.color.array[i * 3 + 1],
				_.geometry2.attributes.color.array[i * 3 + 2],
			],
			i * 3
		)
		colorsA.set(
			[
				_.geometry1.attributes.color.array[i * 3],
				_.geometry1.attributes.color.array[i * 3 + 1],
				_.geometry1.attributes.color.array[i * 3 + 2],
			],
			i * 3
		)
		positionA.set(
			[
				_.geometry1.attributes.position.array[i * 3],
				_.geometry1.attributes.position.array[i * 3 + 1],
				_.geometry1.attributes.position.array[i * 3 + 2],
			],
			i * 3
		)
		indices[i] = i
	}
	_.geometry2.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
	_.geometry2.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	_.geometry2.setAttribute('colorA', new THREE.BufferAttribute(colorsA, 3))
	_.geometry2.setAttribute('positionA', new THREE.BufferAttribute(positionA, 3))
	_.geometry2.setAttribute('pindex', new THREE.BufferAttribute(indices, 1))

	_.tree2Mesh = new THREE.Points(_.geometry2, _.material2)
	scene.add(_.tree2Mesh)

	// morph Step
	_.step = 0
	render()
}

// MAIN LOOP render
// *********************************************************
function render() {
	time += 0.05
	let speed = 0.05
	_.material2.uniforms.time.value = time

	// camera.position.x = Math.cos(time * speed) * 4
	// camera.position.z = Math.sin(time * speed) * 4
	// Play
	if (_.step < 1 && _.playMorph) {
		_.step += speed * 0.3
		_.material2.uniforms.lerp.value = _.step
	} else {
		_.playMorph = false
	}

	// Rewind
	if (_.step > 0 && _.rewindMorph) {
		_.step -= speed * 0.3
		_.material2.uniforms.lerp.value = _.step
	} else {
		_.rewindMorph = false
	}

	let target = new THREE.Vector3(0, 3, 0)
	camera.lookAt(target)
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

// ***************************************************
function onKeyDown(evt) {
	if (evt.key === 'a') {
		_.isUserInteracting = true
		_.rewindMorph = false
		_.playMorph = true
	}
	if (evt.key === 'z') {
		_.isUserInteracting = true
		_.playMorph = false
		_.rewindMorph = true
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

function resize() {
	width = window.innerWidth
	height = window.innerHeight
	renderer.setSize(width, height)
	camera.aspect = width / height
	camera.updateProjectionMatrix()
}

// Function Utiles
function lerp(t, a, b) {
	return a * (1 - t) + t * b
}
