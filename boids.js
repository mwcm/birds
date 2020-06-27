var height = 500;
var width = 500
var depth = 200
var maxSpeed = 4;

var boids = [];
var numBoids = 100;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 350;

var Boid = function () {
	this.geometry = new THREE.ConeGeometry(1, 4, 5.3);
	this.material = new THREE.MeshBasicMaterial({color: 0xffff00});
	this.mesh = new THREE.Mesh(this.geometry,  this.material);

	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
}

function calculateCenter(boid, boids) {
	var c = new THREE.Vector3();
	for (var i = 0; i < numBoids; i++){
		c.add(boids[i].mesh.position);
	}
	// assuming supplied boid is part of the boids group
	c = c.sub(boid.mesh.position)
	c = c.divideScalar(boids.length)
	console.log(c)
	return c
}

function drawBoid() {
	var boid = new Boid()
	boid.mesh.position.x = Math.random() * width - width/2;
	boid.mesh.position.y = Math.random() * height - height/2;
	boid.mesh.position.z = Math.random() * depth - depth/2;
	scene.add(boid.mesh);
	boids.push(boid)
}

function drawBoids() {
	for(var i = 0; i < numBoids; i ++){
		drawBoid()
	}
}

function flyTowardsCentre(boid, boids) {
	boidCenter = calculateCenter(boid, boids)
	boidCenter = boidCenter.sub(boid.mesh.position)
	boidCenter = boidCenter.divideScalar(100) // move 1% distance to center
	return boidCenter
}

function move() {
	boids.forEach(function(boid, index) {
		v1 = flyTowardsCentre(boid, boids)
		boid.velocity = boid.velocity.add(v1)
	  boid.mesh.posittion = boid.mesh.position.add(boid.velocity)
	})
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	move()
}

drawBoids()
animate()
