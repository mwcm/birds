var _boids = [];
var _scene = new THREE.Scene();
var _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var _renderer = new THREE.WebGLRenderer();
_renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(_renderer.domElement);
_camera.position.z = 100;

function draw_boid() {
	var geometry = new THREE.ConeGeometry(5, 20, 32);
	var material = new THREE.MeshBasicMaterial({color: 0xffff00});
	var cone = new THREE.Mesh(geometry,  material);
	// cone.position.x = 0
	// cone.position.y = 0
	_scene.add(cone);
	_boids.push(cone)
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

draw_boid()
animate();
