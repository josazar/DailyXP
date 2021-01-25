const scene = new THREE.Scene()
const boxGeo = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({
	color: 'red',
})
const mesh = new THREE.Mesh(boxGeo, boxMaterial)
scene.add(mesh)

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = 1.5
camera.position.y = 0

scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
