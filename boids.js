var _boids = [];
var _numBoids = 100;
var _scene = new THREE.Scene();
var _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var _renderer = new THREE.WebGLRenderer();
_renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(_renderer.domElement);
_camera.position.z = 500;

function drawBoid() {
	var geometry = new THREE.ConeGeometry(1, 4, 5.3);
	var material = new THREE.MeshBasicMaterial({color: 0xffff00});
	var boid = new THREE.Mesh(geometry,  material);
	boid.position.x = Math.random() * 500 - 250;
	boid.position.y = Math.random() * 500 - 250;
	boid.position.z = Math.random() * 500 - 250;
	// boid.velocity.x = Math.random() * 2 - 1;
	// boid.velocity.y = Math.random() * 2 - 1;
	// boid.velocity.z = Math.random() * 2 - 1;
	_scene.add(boid);
	_boids.push(boid)
}


function move() {
	_boids.forEach(function(boid, index) {
		boid.position.x += 0.1
		boid.position.y += 0.1

	})

}

function animate() {
	requestAnimationFrame(animate);
	_renderer.render(_scene, _camera);
	move()
}

function drawAll() {
	for(var i = 0; i < _numBoids; i ++){
		drawBoid()
	}
}

drawAll()
animate();
