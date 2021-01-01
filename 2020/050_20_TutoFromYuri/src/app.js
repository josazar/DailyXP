import * as THREE from 'three'
import * as dat from 'dat.gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'
import { BufferGeometryLoader, Loader } from 'three'

import model from './model/scene-processed.glb'
import skin from './img/texture_rainbow.jpg'

import './styles.scss'

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

const app = document.getElementById('app')
app.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)
camera.position.set(0, 0, 30)
const controls = new OrbitControls(camera, renderer.domElement)

// Lights and Fog
// ************************************************************
// scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)

var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
hemiLight.position.set(0, 10, 5)
scene.add(hemiLight)

var dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(0, 5, 5)
dirLight.castShadow = true
dirLight.shadow.camera.top = 2
dirLight.shadow.camera.bottom = -2
dirLight.shadow.camera.left = -2
dirLight.shadow.camera.right = 2
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 40

scene.add(dirLight)

let time = 0
let paused = false

setupResize()

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

// LOAD ASSETS
// ****************************************

let loader = new GLTFLoader(manager)
loader.load(model, (gltf) => {
	_.gltf = gltf
})
var loaderText = new THREE.TextureLoader(manager)
loaderText.load(skin, (texture) => {
	_.skinTexture = texture
})

resize()

// settings()

// -------------------------------------------------------

function addObjects() {
	_.material = new THREE.ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		side: THREE.DoubleSide,
		uniforms: {
			time: { type: 'f', value: 0 },
			skin: { type: 't', value: _.skinTexture },
			resolution: { type: 'v4', value: new THREE.Vector4() },
			uvRate1: {
				value: new THREE.Vector2(1, 1),
			},
		},
		// wireframe: true,
		vertexShader: vertex,
		fragmentShader: fragment,
	})
	// _.gltf.scene.position.y = -3.8
	_.gltf.scene.traverse((o) => {
		if (o.isMesh) {
			o.geometry.center()
			// // // _.gltf.scene.scale.set(0.5, 0.5, 0.5)
			// o.rotateZ(Math.PI / 2)
			// o.rotateY(Math.PI / 4)
			// o.rotateX(Math.PI / 2)
			// _.material.uniforms.skin.value = skin
			o.material = _.material
		}
	})

	scene.add(_.gltf.scene)

	render()
}
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
function render() {}

function setupResize() {
	window.addEventListener('resize', () => resize())
}

function stop() {
	paused = true
}

function play() {
	paused = false
}

function render() {
	if (paused) return
	time += 0.05
	_.material.uniforms.time.value = time
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}
