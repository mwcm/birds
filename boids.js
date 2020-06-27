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
	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
}

function drawBoid() {
	var geometry = new THREE.ConeGeometry(1, 4, 5.3);
	var material = new THREE.MeshBasicMaterial({color: 0xffff00});
	var boid = new THREE.Mesh(geometry,  material);
	boid.position.x = Math.random() * width - width/2;
	boid.position.y = Math.random() * height - height/2;
	boid.position.z = Math.random() * depth - depth/2;
	scene.add(boid);
	boids.push(boid)
}


function drawBoids() {
	for(var i = 0; i < numBoids; i ++){
		drawBoid()
	}
}

function move() {
	boids.forEach(function(boid, index) {
		boid.position.x += 0.1
		boid.position.y += 0.1
	})
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	move()
}

drawBoids()
animate();
