import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragmentShader from './shaders/test/fragment.glsl'
import fragmentShaderIn from './shaders/test/fragmentIn.glsl'
import vertexShader from './shaders/test/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/texture_1.jpg')
const texture_2 = textureLoader.load('/textures/texture_2.jpg')
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.SphereGeometry(14, 64, 32)


const uniforms = {
    u_time: {value:0},
    u_resolution: { value: { x: sizes.width, y: sizes.height } },
    u_texture: { value: texture },
    u_texture_2: { value: texture_2 },
}
// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader : fragmentShader,
    uniforms: uniforms,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
})
const materialIn = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader : fragmentShaderIn,
    uniforms: uniforms,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
})


// Mesh
const mesh = new THREE.Mesh(geometry, material)
const sphereIn = new THREE.Mesh(geometry, materialIn)
sphereIn.scale.set(0.98,0.98,0.98)
scene.add(mesh)
scene.add(sphereIn)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, - 30, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.2
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // update material
    material.uniforms.u_time.value = elapsedTime;
    material.uniformsNeedUpdate = true

    mesh.rotation.x = elapsedTime *.1
    sphereIn.rotation.z = elapsedTime *.05
    const scale = .95 - ((Math.cos(elapsedTime)*.5+.5)*.15)
    sphereIn.scale.set(scale,scale,scale)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
