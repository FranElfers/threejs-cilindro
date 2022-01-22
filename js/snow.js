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
const textOutput = document.querySelector('p')

function Drop(vel, posx) {
	this.vel = vel || .5

	this.randomize = x => this.circle.position.set(posx || 0, Math.random() * 50 + x, Math.random() * 50 + 50)
	
	this.create = function() {
		const geometry = new THREE.CircleGeometry(.1,32)
		const material = new THREE.MeshBasicMaterial({ color: 0xaaaaff })
		this.circle = new THREE.Mesh(geometry, material)
		this.randomize(0)
	}

	this.draw = function() {
		scene.add(this.circle)
	}

	this.undraw = function() {
		scene.remove(this.circle)
	}

	this.update = function() {
		const pos = this.circle.position
		pos.y -= this.vel
		if (pos.y < -60) {
			pos.y = 50
			this.randomize(50)
		}
	}
}

const fran = new Drop()
const droplets = []

function setup() {
	fran.create()
	for (let i = 0; i < 1000; i++) {
		const randomVel = Math.random() * .01
		const randomX = Math.random() * 80 - 40
		droplets[i] = new Drop(randomVel, randomX)
		droplets[i].create()
	}
}

function animate() {
	requestAnimationFrame(animate)

	for (let i in droplets) {
		droplets[i].draw()
		droplets[i].update()
	}

	// textOutput.textContent = `${Math.floor(droplets[0].circle.position.x)} ${Math.floor(droplets[0].circle.position.y)} ${Math.floor(droplets[0].circle.position.z)}`
	renderer.render(scene, camera)
}

setup()
animate()