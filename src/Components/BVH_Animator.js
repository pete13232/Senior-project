import loopMachine from "./LoopMachine";
import * as THREE from "three";
class BVH_Animator {
  constructor(mesh, clip) {
    console.log("this");
    this.mixer = new THREE.AnimationMixer(mesh);
    this.clock = new THREE.Clock();
    this.clip = this.mixer.clipAction(clip);
    console.log(this);
  }
  run() {
    this.mixer.update(this.clock.getDelta());
  }
  start() {
    loopMachine.addCallback(this.run.bind(this));
  }
  stop() {
    loopMachine.removeCallback(this.run.bind(this));
  }
  action() {
    this.clip.play();
  }
}

export default BVH_Animator;
