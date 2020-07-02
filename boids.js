var height = 400;
var width = 400;
var depth = 400;
var maxSpeed = 3;

var xMin = -width;
var yMin = -height;
var zMin = -depth;

var xMax = width;
var yMax = height;
var zMax = depth;

var boids = [];
var numBoids = 500;
var groupRadius = 50;
var scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB)
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 475;

var Boid = function () {
  this.velocity     = new THREE.Vector3();
  this.acceleration = new THREE.Vector3();
  this.geometry     = new THREE.ConeGeometry(1, 4, 5.3);
  this.material     = new THREE.MeshBasicMaterial({ color: 0x000000 });
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
      if (currentBoid.mesh.position.distanceTo(boid.mesh.position) < 10) {
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

  if (b.mesh.position.x < xMin + 50) {
    v.x = 10;
  } else if (b.mesh.position.x > xMax - 50) {
    v.x = -10;
  }

  if (b.mesh.position.y < yMin + 50) {
    v.y = 10;
  } else if (b.mesh.position.y > yMax - 50) {
    v.y = -10;
  }

  if (b.mesh.position.z < zMin + 50) {
    v.z = 10;
  } else if (b.mesh.position.z > zMax - 50) {
    v.z = -10;
  }
  return v;
}

function flyTowardsCentre(boid, boids) {
  boidCenter = calculateCenter(boid, boids);
  boidCenter = boidCenter.sub(boid.mesh.position);
  boidCenter = boidCenter.divideScalar(200); // move 0.5% distance to center
  return boidCenter;
}

function drawBoid() {
  var boid = new Boid();
  boid.mesh.position.x = Math.floor(Math.random() * width) - width/2;
  boid.mesh.position.y = Math.floor(Math.random() * height) - height/2;
  boid.mesh.position.z = Math.floor(Math.random() * depth) - depth/2;
  // rotate geometry so cone points in .lookAt() direction
  boid.geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
  scene.add(boid.mesh);
  boids.push(boid);
}

function drawBoids() {
  for (var i = 0; i < numBoids; i++) {
    drawBoid();
  }
}

function getBoidsWithinRadius(boid, allBoids, radius) {
  var boidsWithinRadius = [];

  allBoids.forEach(function (currentBoid, index) {

      distance = boid.mesh.position.distanceTo(currentBoid.mesh.position);
      if (distance <= radius) {
        boidsWithinRadius.push(currentBoid)
      }
  });

  return boidsWithinRadius;
}

function move() {
  boids.forEach(function (boid, index) {

    var boidsInGroup = getBoidsWithinRadius(boid, boids, groupRadius)

    // need to calculate n closest boids
    // should only input n closest boids below
    v1 = flyTowardsCentre(boid, boidsInGroup);
    v2 = dontCollide(boid, boidsInGroup);
    v3 = matchVelocity(boid, boidsInGroup);

    v4 = boundPositions(boid);
    boid.velocity.add(v1);
    boid.velocity.add(v2);
    boid.velocity.add(v3);
    boid.velocity.add(v4.divideScalar(0.001));


    var t = new THREE.Vector3();
    if (v4 != t){
      limitVelocity(boid)
    }

    var pos = new THREE.Vector3()
    pos.addVectors(boid.velocity, boid.mesh.position)
    boid.mesh.lookAt(pos)

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
