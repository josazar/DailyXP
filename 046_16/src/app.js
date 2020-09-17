import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import fragmentDeer from './shader/fragmentDeer.glsl'
import vertex from './shader/vertexParticles.glsl'
import vertexDeer from './shader/vertexDeer.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
// import { Reflector } from 'three/examples//jsm/objects/Reflector.js'
import { easeInOutQuart, easeOutExpo } from './utils/easing.utils'
import { Reflector } from './app/Reflector'
import './styles.scss'
import { PI, lerp } from './utils/math.utils'

var colors = require('nice-color-palettes')
let random = colors[Math.floor(Math.random() * 100)]
const _ = {
	isUserInteracting: false,
	playMorph: false,
	rewindMorph: false,
	step: 0,
	swirling: false,
	swirlStep: 0,
	gui: new dat.GUI(),
	bgColor: 0xf010e,
	//Actions
	activeAction: null,
	lastAction: null,
}

let time = 0
let width = window.innerWidth
let height = window.innerHeight
let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({ alpha: true })
let clock

// scene size
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.setClearColor(_.bgColor, 1)
renderer.shadowMap.enabled = true
const app = document.getElementById('app')
app.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)

// Camera position
camera.position.set(0.5, 3, 3.5)
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = PI / 3.2
controls.enableZoom = false

// Reflector / Mirror
// *****************************************************

var geometry = new THREE.CircleBufferGeometry(40, 64)
_.groundMirror = new Reflector(geometry, {
	clipBias: 0.03,
	textureWidth: WIDTH * window.devicePixelRatio,
	textureHeight: HEIGHT * window.devicePixelRatio,
	color: 0x889999,
	transparent: true,
})
_.groundMirror.material.transparent = true
_.groundMirror.material.uniforms.opacity.value = 0.45
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
		let model = gltf.scene
		_.matDeer = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			// side: THREE.DoubleSide,
			uniforms: {
				u_time: { type: 'f', value: 0 },
				u_resolution: { type: 'v4', value: new THREE.Vector4() },
			},
			vertexShader: vertexDeer,
			fragmentShader: fragmentDeer,
			transparent: true,
			skinning: true,
		})

		let deerSkinnedMesh =
			model.children[0].children[0].children[0].children[0].children[0]
				.children[0].children[0].children[2]

		deerSkinnedMesh.material = _.matDeer

		let scale = 0.0075
		model.scale.set(scale, scale, scale)
		model.position.y = 2
		model.position.x = 0.8
		model.position.z = -1
		// model.rotateY(PI / 3.2)
		scene.add(model)

		// ANIMATIONS MIXER
		var animations = gltf.animations
		_.mixer = new THREE.AnimationMixer(model)
		_.mixer.timeScale = 0.8
		_.mixer.addEventListener('loop', (e) => {
			mixerLoopEventListener(e)
		})
		// Settings Actions
		_.eat1_Action = _.mixer.clipAction(animations[7])
		_.iddle2_Action = _.mixer.clipAction(animations[20])
		_.iddle3_Action = _.mixer.clipAction(animations[21])
		_.walkForward_Action = _.mixer.clipAction(animations[52])
		_.walkRight_Action = _.mixer.clipAction(animations[55])

		// Options
		// _.walkForward_Action.setLoop(THREE.LoopOnce)
		_.walkRight_Action.setLoop(THREE.LoopOnce)

		_.activeAction = _.iddle2_Action
		_.iddle2_Action.play()
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
	_.matDeer.uniforms.u_time.value = time
	_.groundMirror.material.uniforms.u_time.value = time

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
	requestAnimationFrame(render)
	renderer.render(scene, camera)

	// Mixer Animations
	var mixerUpdateDelta = clock.getDelta()
	// Update the animation mixer, the stats panel, and render this frame
	if (_.mixer) _.mixer.update(mixerUpdateDelta)
}

// KEYS EVENTS
// ****************************************************************
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
		_.swirling = !_.swirling
	}

	// Deer AnimationMixer

	if (evt.key === 'q') {
		setAction(_.iddle2_Action)
	}
	if (evt.key === 's') {
		setAction(_.iddle3_Action)
	}
	if (evt.key === 'd') {
		setAction(_.eat1_Action)
	}
	// ArrowUp / ArrowLeft /ArrowRight
	if (evt.key === 'ArrowUp') {
		setAction(_.walkForward_Action)
	}
	if (evt.key === 'ArrowRight') {
		setAction(_.walkRight_Action)
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

// setActions Animation
// ***************************************
const setAction = (toAction) => {
	if (toAction !== _.activeAction) {
		_.lastAction = _.activeAction
		_.activeAction = toAction
		//lastAction.stop()
		_.lastAction.fadeOut(0.5)
		_.activeAction.reset()
		_.activeAction.fadeIn(0.5)
		_.activeAction.play()
	}
}

function mixerLoopEventListener(e) {
	let model = e.action.getRoot()
	if (e.action === _.walkForward_Action) {
		console.log('Walk')
		model.position.z += 0.76
	}
}
