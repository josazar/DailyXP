import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'

import './styles.scss'
import { BufferGeometryLoader } from 'three'

const _ = {}
let spheres = []
let mouseX = 0,
	mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2
//Scene
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()
let width = window.innerWidth
let height = window.innerHeight
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.setClearColor(0xeeeeee, 1)
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding

const app = document.getElementById('app')
app.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)
camera.position.set(20, 40, 80)
const controls = new OrbitControls(camera, renderer.domElement)
let time = 0
document.addEventListener('mousemove', onDocumentMouseMove, false)

settings()
setupResize()
resize()
addObjects()
render()

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

function addObjects() {
	let uniforms = {
		mRefractionRatio: { value: 1.02 },
		mFresnelBias: { value: 0.1 },
		mFresnelPower: { value: 2.0 },
		mFresnelScale: { value: 1.0 },
		tCube: { value: null },
		time: { value: time },
	}
	let path = 'textures/TropicalSunnyDay_'
	var format = '.jpg'
	var urls = [
		path + 'px' + format,
		path + 'nx' + format,
		path + 'py' + format,
		path + 'ny' + format,
		path + 'pz' + format,
		path + 'nz' + format,
	]
	var textureCube = new THREE.CubeTextureLoader().load(urls)

	uniforms['tCube'].value = textureCube
	_.material = new THREE.ShaderMaterial({
		side: THREE.DoubleSide,
		uniforms: uniforms,
		wireframe: false,
		vertexShader: vertex,
		fragmentShader: fragment,
	})

	_.geometry = new THREE.SphereBufferGeometry(2, 20, 20)

	for (var i = 0; i < 20; i++) {
		var mesh = new THREE.Mesh(_.geometry, _.material)
		let dif = 40
		mesh.position.x = Math.random() * dif
		mesh.position.y = Math.random() * dif
		mesh.position.z = Math.random() * dif
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1
		scene.add(mesh)
		spheres.push(mesh)
	}
	scene.background = textureCube
}

function render() {
	time += 0.005
	// _.material.uniforms.time.value = time
	camera.position.x += (mouseX - camera.position.x) * 0.005
	camera.position.y += (-mouseY - camera.position.y) * 0.005

	camera.lookAt(scene.position)
	for (var i = 0; i < spheres.length; i++) {
		var sphere = spheres[i]

		sphere.position.x = 50 * Math.cos(time + i)
		sphere.position.y = 50 * Math.sin(time + i * 1.1)
	}
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}
//-------------------------------------------------------
function setupResize() {
	window.addEventListener('resize', () => resize())
}

function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX
	mouseY = event.clientY - windowHalfY
}
