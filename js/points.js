import * as THREE from '/js/three.module.js'
import * as BufferGeometryUtils from './BufferGeometryUtils.js';
const scene = new THREE.Scene();

// THREE.PerspectiveCamera( FOV, aspectRatio, nearClippingPlane, farClippingPlane)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)

const renderer = new THREE.WebGLRenderer()

// setSize( width, height, [false for half resolution])
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor( 0x282C34);
document.body.appendChild(renderer.domElement)

camera.position.set(0,0,100)
camera.lookAt(0,0,0)

const inputX = document.querySelector('input#x')
const inputY = document.querySelector('input#y')
const inputZ = document.querySelector('input#z')
const textOutput = document.querySelector('p#pos')
const fpsElement = document.querySelector('p#fps')

function createDrop(y, size) {
	const geometry = new THREE.CircleGeometry(size, 6)
	const material = new THREE.MeshBasicMaterial({ color: 0x424752 })
	const circle = new THREE.Mesh(geometry, material)
	circle.position.set(0, y, 0)
	circle.updateMatrix()
	return circle
}

function updateDrop({circle, x, z }) {
	circle.position.x = x
	circle.position.z = z
}

/** Variables globales */
const droplets = []
let framerate
/** Variables para setup() */
const totalGeometries = []

function setup() {
	const lines = 50
	for (let i = 0; i <= lines; i += Math.PI * 2 / lines) {
		const column = []
		for (let j = 0; j < 10; j++) {
			const newDrop = createDrop(j*4 -18, .3)
			column.push(newDrop)
			scene.add(newDrop)
			totalGeometries.push(newDrop)
		}
		droplets.push({ pilMultiplier: i, column })
	}

	console.log(totalGeometries)
	const material = new THREE.MeshBasicMaterial({ color: 0x424752 })
	// const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(totalGeometries, false)

	// scene.add(new THREE.Mesh(mergedGeometry, material))
	
	setInterval(() => {
		fpsElement.textContent = framerate + ' fps'
		framerate = 0
	}, 1000)
}

/** Variables para animate() */
const velocidad = 0.001
const radio = 30
let positionInLoop = 0

function animate() {
	requestAnimationFrame(animate)
	positionInLoop += velocidad
	
	for (let i in droplets) {
		const col = droplets[i]
		const x = radio * Math.cos(positionInLoop + col.pilMultiplier)
		const z = radio * Math.sin(positionInLoop + col.pilMultiplier) * 3 + 10
		for (let j in col.column) {
			const circle = col.column[j]
			updateDrop({ circle, x, z })
		}
	}	

	// textOutput.textContent = `${Math.floor(droplets[0][0].circle.position.x)} ${Math.floor(droplets[0][0].circle.position.y)} ${Math.floor(droplets[0][0].circle.position.z)} ${droplets[0][0].positionInLoop}`
	camera.position.z = inputZ.value

	framerate++
	renderer.render(scene, camera)
}

setup()
animate()
// http://127.0.0.1:5500/