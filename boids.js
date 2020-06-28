var height = 400;
var width = 300;
var depth = 800;
var maxSpeed = 10;

var xMin = -width;
var yMin = -width;
var zMin = 0;

var xMax = width;
var yMax = height;
var zMax = depth;

var boids = [];
var numBoids = 100;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 1000;

var Boid = function () {
  this.velocity     = new THREE.Vector3();
  this.acceleration = new THREE.Vector3();
  this.geometry     = new THREE.ConeGeometry(1, 4, 5.3);
  this.material     = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  this.mesh         = new THREE.Mesh(this.geometry, this.material);
};

// TODO COMBINE LOOOOOOOOOPS
function calculateCenter(boid, boids) {
  // calculate the perceived center position for a given
  // boid included in a group of boids
  var c = new THREE.Vector3();
  boids.forEach(function (currentBoid, index) {
    if (currentBoid !== boid) {
      c.add(currentBoid.mesh.position);
    }
  });
  c.divideScalar(boids.length - 1);
  return c;
}

function dontCollide(boid, boids) {
  var c = new THREE.Vector3();
  var d = new THREE.Vector3();
  boids.forEach(function (currentBoid, index) {
    if (currentBoid !== boid) {
      // should be based on boid geometry size, not just set at 16
      if (currentBoid.mesh.position.distanceTo(boid.mesh.position) < 16) {
        d.subVectors(currentBoid.mesh.position, boid.mesh.position);
        c.sub(d);
      }
    }
  });
  return c;
}

function matchVelocity(boid, boids) {
  var pv = new THREE.Vector3();

  boids.forEach(function (currentBoid, index) {
    if (currentBoid !== boid) {
      pv = pv.add(currentBoid.velocity);
    }
  });
  pv.divideScalar(boids.length - 1);
  pv.sub(boid.velocity);
  pv.divideScalar(8);
  return pv;
}

function limitVelocity(b) {
  var v = new THREE.Vector3()
  if (Math.abs(b.velocity.x) > maxSpeed) {
    b.velocity.x = (b.velocity.x / Math.abs(b.velocity.x)) * maxSpeed
  }
  if (Math.abs(b.velocity.y) > maxSpeed) {
    b.velocity.y = (b.velocity.y / Math.abs(b.velocity.y)) * maxSpeed
  }
  if (Math.abs(b.velocity.z) > maxSpeed) {
    b.velocity.z = (b.velocity.z / Math.abs(b.velocity.z)) * maxSpeed
  }
}

function boundPositions(b) {
  var v = new THREE.Vector3();

  if (b.mesh.position.x < xMin) {
    v.x = 4;
  } else if (b.mesh.position.x > xMax) {
    v.x = -4;
  }

  if (b.mesh.position.y < yMin) {
    v.y = 4;
  } else if (b.mesh.position.y > yMax) {
    v.y = -4;
  }

  if (b.mesh.position.z < zMin) {
    v.z = 4;
  } else if (b.mesh.position.z > zMax) {
    v.z = -4;
  }
  return v;
}

function flyTowardsCentre(boid, boids) {
  boidCenter = calculateCenter(boid, boids);
  boidCenter = boidCenter.sub(boid.mesh.position);
  boidCenter = boidCenter.divideScalar(100); // move 1% distance to center
  return boidCenter;
}

function drawBoid() {
  var boid = new Boid();
  boid.mesh.position.x = Math.random() * width - width / 2;
  boid.mesh.position.y = Math.random() * height - height / 2;
  boid.mesh.position.z = Math.random() * depth - depth / 2;
  scene.add(boid.mesh);
  boids.push(boid);
}

function drawBoids() {
  for (var i = 0; i < numBoids; i++) {
    drawBoid();
  }
}

function move() {
  boids.forEach(function (boid, index) {
    v1 = flyTowardsCentre(boid, boids);
    v2 = dontCollide(boid, boids);
    v3 = matchVelocity(boid, boids);
    v4 = boundPositions(boid);
    boid.velocity.add(v1);
    boid.velocity.add(v2);
    boid.velocity.add(v3);
    boid.velocity.add(v4);
    limitVelocity(boid)
    boid.mesh.position.add(boid.velocity);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  move();
}

drawBoids();
animate();
