import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertexParticles.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { easeInOutQuart, easeOutExpo } from './utils/easing.utils'
import { Reflector } from './Reflector/Reflector'
import './styles.scss'
import { PI, lerp } from './utils/math.utils'
import Deer from './class/Deer'
import Wave from './class/Wave'
import { Vector3 } from 'three'

var colors = require('nice-color-palettes')
let random = colors[Math.floor(Math.random() * 100)]
const _ = {
	playMorph: false,
	rewindMorph: false,
	step: 0,
	swirling: false,
	swirlStep: 0,
	gui: new dat.GUI(),
	bgColor: 0xf010e,
}
let keyControls = {
	left: false,
	right: false,
	up: false,
	down: false,
}
let waves = []

let deer
let time = 0
let clock
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(_.bgColor, 1)
renderer.shadowMap.enabled = true
const app = document.getElementById('app')
app.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.001, 1000)

// Camera position
camera.position.set(0.5, 3, 3.5)
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = PI / 3.2
controls.enableZoom = false
controls.enableKeys = false

// Reflector / Mirror
// *****************************************************
var geometry = new THREE.CircleBufferGeometry(40, 64)
_.groundMirror = new Reflector(geometry, {
	clipBias: 0.03,
	textureWidth: WIDTH * window.devicePixelRatio,
	textureHeight: HEIGHT * window.devicePixelRatio,
	color: 0x889999,
	transparent: true,
	depthBuffer: true,
})
_.groundMirror.material.transparent = true
_.groundMirror.material.uniforms.opacity.value = 0.35
_.groundMirror.position.y = 2
_.groundMirror.rotateX(-Math.PI / 2)
scene.add(_.groundMirror)

// Lights and Fog
// ************************************************************
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)

var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
hemiLight.position.set(0, 20, 0)
scene.add(hemiLight)

var dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(-3, 10, -10)
dirLight.castShadow = true
dirLight.shadow.camera.top = 2
dirLight.shadow.camera.bottom = -2
dirLight.shadow.camera.left = -2
dirLight.shadow.camera.right = 2
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 40
scene.add(dirLight)

// GUI controls
// ************************************************************
let colorsGui = _.gui.addFolder('Colors')
colorsGui.add(_, 'swirling').name('Swirl !')
colorsGui.addColor(_, 'bgColor').name('background')
colorsGui.open()
let controlsGui = _.gui.addFolder('Controls')
controlsGui.add(_, 'step', 0, 1, 0.01).name('Morph Steps')
controlsGui.open()

// EVENTS
// ************************************************************
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

	// Load Deer
	// ************************************
	let loaderGltf = new GLTFLoader(manager)
	loaderGltf.load('gltf/scene.gltf', function (gltf) {
		deer = new Deer(gltf)
	})

	// LOAD PLY File
	let loader = new PLYLoader(manager)

	// Tree 1
	// ************************************
	// lieusacre1_clean_225
	// tree1_Clean_250
	// arbre_riviere_clean_179
	// arbre_liane_clean_pivot
	// Arbre_Liane_2
	loader.load('ply/Arbre_Liane_2.ply', function (geometry) {
		geometry.computeBoundingSphere()
		_.geometry1 = geometry
		// comme 'target Morph' on utilise uniquement la geometry
		_.tree1Mesh = new THREE.Points(_.geometry1)
	})

	// Tree 2
	// ************************************
	loader.load('ply/Arbre_Duo.ply', function (geometry) {
		_.geometry2 = geometry
		_.material2 = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			side: THREE.DoubleSide,
			uniforms: {
				u_time: { type: 'f', value: 0 },
				u_lerp: { type: 'f', value: 0 },
				u_swirlStep: { type: 'f', value: 0 },
				u_resolution: { type: 'v4', value: new THREE.Vector4() },
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

	// Deer
	deer.init()
	scene.add(deer.model)

	let number = _.geometry2.attributes.color.count
	let sizes = new Float32Array(number)
	for (let i = 0; i < number; i++) {
		sizes.set([Math.random()], i)
	}
	let colors = new Float32Array(number * 3)
	let colorsA = new Float32Array(number * 3)
	let positionA = new Float32Array(number * 3)
	const indices = new Float32Array(number)
	const speeds = new Float32Array(number)
	const phytoncides = new Float32Array(number)

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
		speeds[i] = Math.random()

		if (i % 100 === 0) {
			phytoncides[i] = 1
		} else {
			phytoncides[i] = 0
		}
	}
	_.geometry2.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
	_.geometry2.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	_.geometry2.setAttribute('colorA', new THREE.BufferAttribute(colorsA, 3))
	_.geometry2.setAttribute('positionA', new THREE.BufferAttribute(positionA, 3))
	_.geometry2.setAttribute('pindex', new THREE.BufferAttribute(indices, 1))
	_.geometry2.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))
	_.geometry2.setAttribute(
		'phytoncide',
		new THREE.BufferAttribute(phytoncides, 1)
	)

	_.tree2Mesh = new THREE.Points(_.geometry2, _.material2)
	scene.add(_.tree2Mesh)

	// Wave water
	let wave = new Wave(new Vector3(1, 2.001, 1))
	scene.add(wave.container)
	waves.push(wave)

	clock = new THREE.Clock()
	render()
}

// MAIN LOOP render
// *********************************************************
function render() {
	time += 0.05
	renderer.setClearColor(_.bgColor)
	let speed = 0.05
	_.material2.uniforms.u_time.value = time
	deer.material.uniforms.u_time.value = time
	_.groundMirror.material.uniforms.u_time.value = time

	for (let i = 0; i < waves.length; i++) {
		const element = waves[i]
		element.update()
	}
	// camera.position.x = Math.cos(time * speed) * 3
	// camera.position.z = Math.sin(time * speed) * 3

	// Play
	if (_.step < 1 && _.playMorph) {
		_.step += speed * 0.33333
	} else {
		_.playMorph = false
	}

	// Rewind
	if (_.step > 0 && _.rewindMorph) {
		_.step -= speed * 0.33333
	} else {
		_.rewindMorph = false
	}
	_.material2.uniforms.u_lerp.value = easeInOutQuart(_.step)

	// swirl
	if (_.swirling && _.swirlStep < 1) {
		_.swirlStep += 0.01
	}
	if (!_.swirling && _.swirlStep > 0) {
		_.swirlStep -= 0.01
	}
	_.material2.uniforms.u_swirlStep.value = easeInOutQuart(_.swirlStep)
	let target = new THREE.Vector3(0, 3, 0)
	camera.lookAt(target)

	// Mixer Animations
	var mixerUpdateDelta = clock.getDelta()
	// Update the animation mixer, the stats panel, and render this frame
	if (deer.mixer) deer.mixer.update(mixerUpdateDelta)

	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

// KEYS EVENTS
// ****************************************************************
function onKeyDown(evt) {
	if (evt.key === 'a') {
		_.rewindMorph = false
		_.playMorph = true
	}
	if (evt.key === 'z') {
		_.playMorph = false
		_.rewindMorph = true
	}

	if (evt.key === 'e') {
		_.swirling = !_.swirling
	}

	// Deer AnimationMixer
	if (evt.key === 'q') {
		deer.setAction(deer.actions.iddle2)
	}
	if (evt.key === 's') {
		deer.setAction(deer.actions.iddle3)
	}
	if (evt.key === ' ') {
		deer.setAction(deer.actions.eat1)
	}
	// ArrowUp / ArrowLeft /ArrowRight
	if (evt.key === 'ArrowUp') {
		keyControls.up = true
		deer.setAction(deer.actions.walkForward)
	}
	if (evt.key === 'ArrowRight') {
		keyControls.right = true
		deer.setAction(deer.actions.walkRight)
	}
	if (evt.key === 'ArrowLeft') {
		keyControls.left = true
		deer.setAction(deer.actions.walkLeft)
	}
	if (evt.key === 'ArrowDown') {
		keyControls.down = true
		deer.setAction(deer.actions.walkBack)
	}
	if (evt.key === 'r') {
		// Wave water
		let wave = new Wave(
			new Vector3(Math.random() * 4 - 2, 2, Math.random() * 2 + 1)
		)
		scene.add(wave.container)
		waves.push(wave)
	}
}

function onMouseMove(event) {}
function onKeyUp(evt) {
	// ArrowUp / ArrowLeft /ArrowRight
	if (evt.key === 'ArrowUp') {
		keyControls.up = false
	}
	if (evt.key === 'ArrowRight') {
		keyControls.right = false
	}
	if (evt.key === 'ArrowLeft') {
		keyControls.left = false
	}
	if (evt.key === 'ArrowDown') {
		keyControls.down = false
	}
}

function resize() {
	WIDTH = window.innerWidth
	HEIGHT = window.innerHeight
	renderer.setSize(WIDTH, HEIGHT)
	camera.aspect = WIDTH / HEIGHT
	camera.updateProjectionMatrix()
}

export { keyControls }
