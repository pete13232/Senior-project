import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class SceneInit {
  constructor(ref) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.ref = ref;

    // NOTE: Additional components.
    this.clock = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.z = 48;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

    this.ref.current.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);

    //NOTE: Load space background.

    this.scene.background = new THREE.Color(0x000000);
  }

  animate() {
    // NOTE: Window is implied.
    window.requestAnimationFrame(this.animate.bind(this));

    this.render();
    this.controls.update();
  }

  render() {
    // NOTE: Update uniform data on each render.
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  }
}
