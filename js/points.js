import * as THREE from '/js/three.module.js'
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer()
let camera

const resizeCanvas = () => {
	// THREE.PerspectiveCamera( FOV, aspectRatio, nearClippingPlane, farClippingPlane)
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
	camera.position.set(0,0,93)
	camera.lookAt(0,0,0)
	camera.rotateZ(-90)
	renderer.setSize(window.innerWidth+1, window.innerHeight+1)
}

resizeCanvas()
renderer.setClearColor( 0x282C34);
document.body.appendChild(renderer.domElement)
window.onresize = resizeCanvas

// camera.position.z = 93

/** Variables globales */
const droplets = []
const lines = 50
let object

function setup() {
	let meshIndex = 0
	const geometry = new THREE.CircleGeometry(.3, 16)
	const material = new THREE.MeshBasicMaterial({ color: 0x424752 })
	
	for (let i = 0; i < lines; i ++) {
		let column = []
		for (let j = 0; j < 10; j++) column.push(meshIndex++)
		droplets.push(column)
	}

	object = new THREE.InstancedMesh(geometry, material, meshIndex)
	scene.add(object)
}

/** Variables para animate() */
const dummy = new THREE.Object3D()
const velocidad = 0.001
const radio = 30
let positionInLoop = 0

function animate() {
	requestAnimationFrame(animate)
	positionInLoop += velocidad
	
	for (let i in droplets) {
		i = parseInt(i) // ????? esto me estuvo volviendo loco, resulta que i era string
		const spacing = Math.PI * 2 / lines * i
		const x = radio * Math.cos(positionInLoop + spacing)
		const z = radio * Math.sin(positionInLoop + spacing) * 3 + 10

		for (let j in droplets[i]) {
			const meshPosition = droplets[i][j]
			dummy.position.set(x, j*4 -18, z)
			dummy.updateMatrix()
			object.setMatrixAt(meshPosition, dummy.matrix)
		}
	}
	object.instanceMatrix.needsUpdate = true
	
	renderer.render(scene, camera)
}

setup()
animate()
// http://127.0.0.1:5500/