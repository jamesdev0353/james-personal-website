import './style.css'
import * as THREE from 'three';
import { throttle } from 'lodash-es';
import setCanvasDimensions from './setCanvasDimensions';

//setup
const resizeUpdateInterval = 500;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//resize window
window.addEventListener(
  'resize',
  throttle(
    () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      setCanvasDimensions(renderer.domElement, width, height);
    },
    resizeUpdateInterval,
    { trailing: true }
  )
);

//particles
const loader = new THREE.TextureLoader();
const particleTexture = loader.load('particle.png');
const particleShape = new THREE.BufferGeometry;
const particleCount = 1000;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 100;
}

particleShape.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({ size: 0.3, map: particleTexture, transparent: true});
const particleMesh = new THREE.Points(particleShape, particleMaterial)
scene.add(particleMesh)

//background
scene.background = new THREE.Color(0x1C2341);

//render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  particleMesh.rotation.x += -0.002;
  particleMesh.rotation.y += -0.002;
  particleMesh.rotation.z += -0.002;

}

animate();