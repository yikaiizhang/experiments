import "./show.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

function showBegins() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Camera
  const fov = 75;
  const near = 0.1;
  const far = 100;
  const aspect = renderer.domElement.width / renderer.domElement.height;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 8;

  const controls = new OrbitControls(camera, canvas);
  controls.update();

  // Scene
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xededed);

  // Model
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "../node_modules/three/examples/js/libs/draco/gltf/"
  );
  loader.setDRACOLoader(dracoLoader);

  let banana;
  loader.load(
    "https://cdn.shopify.com/s/files/1/0601/6676/6614/files/banana-v1-transformed.glb?v=1676400749",
    (gltf) => {
      banana = gltf.scene;
      banana.castShadow = true;
      banana.receiveShadow = true;
      scene.add(banana);
      render();
    }
  );

  console.log(loader);

  // Light
  const lightColor = 0xffffff;
  const intensity = 8;
  const light = new THREE.DirectionalLight(lightColor, intensity);
  light.position.set(0, 5, 5);

  const ambientIntensity = 7;
  const ambientLight = new THREE.AmbientLight(lightColor, ambientIntensity); // soft white light
  scene.add(light);
  scene.add(ambientLight);

  // Resize
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // Physics
  let positionY = -25;
  let acceleration = 0.44;
  const force = -0.0038;

  function render(time) {
    banana.rotation.x = time * 0.0022;
    banana.rotation.y = -time * 0.0015;
    acceleration += force;
    positionY += acceleration;
    if (positionY <= -25 && acceleration < 0) {
      acceleration = 0.44;
    }
    banana.position.y = positionY;
    controls.update();
    renderer.render(scene, camera);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();
    }
    requestAnimationFrame(render);
  }

  // render();
}

export default showBegins;
