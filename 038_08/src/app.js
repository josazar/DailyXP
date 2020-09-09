import * as THREE from 'three'
// import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertexParticles.glsl'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import './styles.scss'
import { BufferGeometryLoader, Vector3 } from 'three'

var colors = require('nice-color-palettes')
let random = colors[Math.floor(Math.random() * 100)]
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
renderer.setClearColor(0x081c10, 1)
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
const app = document.getElementById('app')
app.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(70, width / height, 0.001, 1000)

// Camera position
camera.position.set(0, 2, 5)
const controls = new OrbitControls(camera, renderer.domElement)

// EVENTS
// **************************************
document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)
// document.addEventListener('mousemove', onMouseMove, false)
window.addEventListener('resize', () => resize())

// ADD OBJECTS & SETUP
// **************************************
addObjects()
resize()
render()

// -------------------------------------------------------

function addObjects() {
	// Plane
	var helper = new THREE.GridHelper(16, 32)
	// helper.rotation.x = Math.PI / 2;
	scene.add(helper)

	// LOAD PLY File
	let loader = new PLYLoader()
	let sprite = new THREE.TextureLoader().load('textures/disc.png')

	// Scène Arbre
	//********************************************
	loader.load('ply/arbre_liane_clean_pivot.ply', function (geometry) {
		geometry.computeVertexNormals()
		geometry.computeBoundingSphere()

		_.geometryClone = geometry.clone()
		_.material = new THREE.PointsMaterial({
			size: 0.01,
			flatShading: true,
			vertexColors: true,
			map: sprite,
			transparent: true,
			alphaTest: 0.5,
		})
		_.mesh = new THREE.Points(geometry, _.material)
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

		// Clone with Shader
		//********************************************
		_.material2 = new THREE.ShaderMaterial({
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
		})
		_.clone = _.mesh.clone()

		// MESH SURFACE SAMPLER
		let sampler = new MeshSurfaceSampler(_.clone)
			.setWeightAttribute('uv')
			.build()

		var geometry = new THREE.BufferGeometry()
		let number = 1000
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

		let points = new THREE.Points(geometry, _.material2)

		// add objects to the scne
		let group = new THREE.Group()
		group.add(_.mesh)
		group.add(points)
		scene.add(group)
		group.position.x = 1
		group.position.z = 0.25
		group.position.y = -0.2
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
				offsetY = (offsetY * _.velocity * i * 0.0002) / 1000
				offsetX = (offsetX * _.velocity * i * 0.0002) / 1000
				positions.setXYZ(i, px + offsetX, py + offsetY, pz)
			} else {
				positions.setXYZ(i, px + offsetX, py + offsetY, pz)
			}
		}
		positions.needsUpdate = true
		// Shader pour le clone
		_.material2.uniforms.time.value = time
	}

	camera.position.x = Math.cos(time / 5) * 3
	camera.position.z = Math.sin(time / 5) * 2
	// camera.position.y = 2 + Math.sin(time / 5) * 4

	let target = new THREE.Vector3(0, 1, 0)
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
	// console.log(evt)
	if (evt.key === 'a') {
		{
			if (_.material.blending === THREE.AdditiveBlending) {
				_.material.blending = THREE.NormalBlending
			} else {
				_.material.blending = THREE.AdditiveBlending
			}
		}
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
