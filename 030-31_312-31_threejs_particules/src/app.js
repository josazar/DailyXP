import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

import fragment from './shader/fragment.glsl'
import vertex from './shader/vertexParticles.glsl'

import modelFile from '../model/scene-processed.glb'
import matcap1 from '../images/matcap_1.jpg'
import matcap2 from '../images/matcap_3.jpg'

import './styles.scss'
import { BufferGeometryLoader, Loader } from 'three'

var colors = require('nice-color-palettes')
let random = colors[Math.floor(Math.random() * 100)]

console.log(random)

const _ = {}
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()
let width = window.innerWidth
let height = window.innerHeight
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.setClearColor(0x000000, 1)
let loader = new GLTFLoader()

const app = document.getElementById('app')
app.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)
// Camera pos
camera.position.set(-2, 0, 5)
const controls = new OrbitControls(camera, renderer.domElement)
let time = 0

let paused = false

setupResize()
addObjects()
resize()
render()
settings()

// -------------------------------------------------------

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

function addObjects() {
	_.material = new THREE.ShaderMaterial({
		extensions: {
			derivatives: '#extension GL_OES_standard_derivatives : enable',
		},
		side: THREE.DoubleSide,
		uniforms: {
			time: { type: 'f', value: 0 },
			resolution: { type: 'v4', value: new THREE.Vector4() },
			uvRate1: {
				value: new THREE.Vector2(1, 1),
			},
		},
		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: true,
		// blending: THREE.AdditiveBlending,
		// depthTest: false,
		// depthWrite: false,
	})

	_.matcapMaterial = new THREE.MeshMatcapMaterial({
		matcap: new THREE.TextureLoader().load(matcap2),
	})

	loader.load(modelFile, (gltf) => {
		_.model =
			gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0]
		console.log(_.model)
		_.model.geometry.rotateX(1.8)
		_.model.geometry.rotateY(-0.25)
		_.model.geometry.rotateZ(0.5)
		_.obsidiangeometry = _.model.geometry.clone()
		_.model.material = _.material

		// create particles

		// MESH SURFACE SAMPLER
		let sampler = new MeshSurfaceSampler(_.model)
			.setWeightAttribute('uv')
			.build()

		var geometry = new THREE.BufferGeometry()
		let number = 70000
		let pointPos = new Float32Array(number * 3)
		let colors = new Float32Array(number * 3)
		let sizes = new Float32Array(number)
		let normals = new Float32Array(number * 3)

		for (let i = 0; i < number; i++) {
			let _position = new THREE.Vector3()
			let _normal = new THREE.Vector3()
			sampler.sample(_position, _normal)
			let randomColor = new THREE.Color(random[Math.floor(Math.random() * 5)])
			pointPos.set([_position.x, _position.y, _position.z], i * 3)
			colors.set([randomColor.r, randomColor.g, randomColor.b], i * 3)
			sizes.set([Math.random()], i)
			normals.set([_normal.x, _normal.y, _normal.z], i * 3)
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(pointPos, 3))
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
		geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
		geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))

		let points = new THREE.Points(geometry, _.material)

		// end of it

		let obsid = new THREE.Mesh(_.obsidiangeometry, _.matcapMaterial)
		scene.add(obsid)
		scene.add(points)
	})
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
