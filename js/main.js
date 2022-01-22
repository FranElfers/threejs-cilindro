const scene = new THREE.Scene();

// THREE.PerspectiveCamera( FOV, aspectRatio, nearClippingPlane, farClippingPlane)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)

const renderer = new THREE.WebGLRenderer()

// setSize( width, height, [false for half resolution])
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.set(0,0,100)
camera.lookAt(0,0,0)

function cube() {
	const geometry = new THREE.BoxGeometry()
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const cube = new THREE.Mesh(geometry, material)
	scene.add(cube)
	return cube
}


function line() {
	const material = new THREE.LineBasicMaterial({ color: 0xffffff })
	const points = []
	points.push(new THREE.Vector3(-10, 0, 0))
	points.push(new THREE.Vector3(0, 10, 0))
	points.push(new THREE.Vector3(10, 0, 0))

	const geometry = new THREE.BufferGeometry().setFromPoints(points)
	const line = new THREE.Line(geometry, material)
	scene.add(line)
}

// function main() {
	// cube.rotation.x += 0.01
	// cube.rotation.y += 0.01
// }

const inputX = document.querySelector('input#x')
const inputY = document.querySelector('input#y')
const inputZ = document.querySelector('input#z')

const droplets = []

function Drop(dir) {
	this.dir = dir

	this.create = function() {
		const material = new THREE.LineBasicMaterial({ color: 0xffffff })
		const points = []
		points.push(new THREE.Vector3(0, 10, 0))
		points.push(new THREE.Vector3(this.dir, 0, 0))
	
		const geometry = new THREE.BufferGeometry().setFromPoints(points)
		this.line = new THREE.Line(geometry, material)
	}

	this.draw = function() {
		scene.add(this.line)
		// scene.remove(this.line)
	}

	this.undraw = function() {
		scene.remove(this.line)
	}
}

function animate() {
	requestAnimationFrame(animate)
	cube()
	line()
	for (let i in droplets) {
		droplets[i]?.undraw()
	}

	const random = Math.floor(Math.random() * 20 - 10)
	droplets.push(new Drop(random))
	
	for (let i in droplets) {
		droplets[i].create()
		droplets[i].draw()
		if (droplets.length > 3) {
			droplets[0].undraw()
			droplets.shift()
		}
	}
	renderer.render(scene, camera)
}


animate()