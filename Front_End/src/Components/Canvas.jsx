import { useEffect, useRef, useState } from "react";
import * as dat from "dat.gui";
import model from "./FBX_Loader.js";
// import animation from "./BVH_Loader.js";
import SceneInit from "./SceneInit.js";
import animation from "./FBX_Animation.js";
import BVH_Animator from "./BVH_Animator.js";
import { retarget } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

export function Canvas() {
  let mixer = undefined;
  let init = undefined;
  let clips = undefined;
  const ref = useRef();
  const [loaded, setLoaded] = useState(false);
  const clock = new THREE.Clock();
  let options = {
    position_x: 0,
    position_y: -20,
    position_z: 0,
    scale: 0.23,
  };

  function animate() {
    window.requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    init.render();
    init.stats.update();
    init.controls.update();
    if (init.scene.children[2] !== undefined) {
      init.scene.children[2].position.x = options.position_x;
      init.scene.children[2].position.y = options.position_y;
      init.scene.children[2].position.z = options.position_z;
      init.scene.children[2].scale.set(
        options.scale,
        options.scale,
        options.scale
      );
    }
  }

  useEffect(() => {
    if (!loaded && ref) {
      init = new SceneInit(ref);
      init.initialize();
      animate();
      init.animate();

      const gui = new dat.GUI();

      gui.add(options, "position_x", -20, 20);
      gui.add(options, "position_y", -50, 50);
      gui.add(options, "position_z", -50, 50);
      gui.add(options, "scale", 0.1, 0.5);

      // loopMachine.addCallback(() => {
      //   if (test.scene.children[2] !== undefined) {
      //     test.scene.children[2].position.x = options.position_x;
      //     test.scene.children[2].position.y = options.position_y;
      //     test.scene.children[2].position.z = options.position_z;
      //     test.scene.children[2].scale.set(
      //       options.scale,
      //       options.scale,
      //       options.scale
      //     );
      //   }
      // });
      // loopMachine.start();
      model.then((object) => {
        animation.then((track) => {
          init.scene.add(object);
          let s = 0.28;
          object.scale.set(s, s, s);
          object.position.y = -32;
          mixer = new THREE.AnimationMixer(object);
          // let fbx_skeleton = new THREE.SkeletonHelper(object);
          // fbx_skeleton.skeleton = object.children[1].skeleton;
          // init.scene.add(fbx_skeleton);

          clips = object.animations.map((animation) => {
            return mixer.clipAction(animation);
          });
          clips.push(mixer.clipAction(track));

          //selecting clips
          // clips[0].play();
          
          clips[1].play();
          // clips[2].play();
          console.log("Clips",clips);

          console.log("Scene");
          console.log(init.scene);
        });
      });


      // to see skeleton animation by loading bvh
      // animation.then((object) => {
      //   let skeletonHelper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
      //   skeletonHelper.skeleton = object.skeleton; // allow animation mixer to bind to THREE.SkeletonHelper directly

      //   const boneContainer = new THREE.Group();
      //   boneContainer.add(object.skeleton.bones[0]);

      //   init.scene.add(skeletonHelper);
      //   init.scene.add(boneContainer);
      //   mixer = new THREE.AnimationMixer(skeletonHelper);
      //   mixer.clipAction(object.clip).setEffectiveWeight(1.0).play();
      // });

      setLoaded(true);
    }
  }, [ref, loaded]);
  const div = <div ref={ref} />;
  return div;
}
/*
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import animation from "./BVH_Loader.js";
export function Canvas() {
  const clock = new THREE.Clock();

  let camera, controls, scene, renderer;
  let mixer, skeletonHelper;

  init();
  animate();
  animation.then((object) => {
    skeletonHelper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
    skeletonHelper.skeleton = object.skeleton; // allow animation mixer to bind to THREE.SkeletonHelper directly

    const boneContainer = new THREE.Group();
    boneContainer.add(object.skeleton.bones[0]);

    scene.add(skeletonHelper);
    scene.add(boneContainer);
    mixer = new THREE.AnimationMixer(skeletonHelper);
    mixer.clipAction(object.clip).setEffectiveWeight(1.0).play();
  });

  function init() {
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    scene.add(new THREE.GridHelper(400, 10));

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 300;
    controls.maxDistance = 700;

    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
  }
  const div = <div ref={ref} />;
  return div;
}
export default Canvas;
*/
