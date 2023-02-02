import loopMachine from "./LoopMachine";
import * as THREE from "three";
class Animator {
  constructor(mesh) {
    this.mixer = new THREE.AnimationMixer(mesh);
    this.clock = new THREE.Clock();
    this.clips = mesh.animations.map((animation) => {
      return this.mixer.clipAction(animation);
    });
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
  action(animationID) {
    this.clips[animationID].play();
  }
}

export default Animator;
