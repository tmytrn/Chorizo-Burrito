import { GLTFLoader } from "./GLTFLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import {
  Scene,
  Color,
  PerspectiveCamera,
  DirectionalLight,
  WebGLRenderer,
} from "./three.module.js";

let scene, camera, renderer, burrito;

function init() {
  let loader = new GLTFLoader();
  loader.load("images/2021/Burrito.gltf", function (gltf) {
    burrito = gltf.scene;
    burrito.rotation.z = (10 / 180) * Math.PI;
    burrito.rotation.y = (200 / 180) * Math.PI;
    burrito.rotation.x = (290 / 180) * Math.PI;

    // car.scale.set(0.5, 0.5, 0.5);
    scene.add(gltf.scene);
  });
  scene = new Scene();
  // scene.background = new Color(0xffffff);
  camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.rotation.y = (300 / 180) * Math.PI;
  camera.rotation.z = (100 / 180) * Math.PI;
  camera.position.x = 150;
  camera.position.y = 100;
  camera.position.z = 150;

  // let hlight = new AmbientLight(0x202020, 1);
  // scene.add(hlight);
  let directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 0, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  let controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.minDistance = 2;
  controls.maxDistance = 1000;
  controls.target.set(0, 0, -0.2);
  controls.update();
}
function animate() {
  // console.log("animate();");
  requestAnimationFrame(render);
  // burrito.rotation.z += 0.001;
  renderer.render(scene, camera);
}
function render() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
init();
animate();
