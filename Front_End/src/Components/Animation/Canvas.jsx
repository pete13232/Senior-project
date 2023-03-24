import { useEffect, useRef, useState } from "react";
import * as dat from "dat.gui";
import model from "./FBX_Loader.js";
// import animation from "./BVH_Loader.js";
import SceneInit from "./SceneInit.js";
import animation from "./FBX_Animation.js";
import { retarget } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

const Canvas = () => {
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
          console.log("Clips", clips);

          console.log("Scene");
          console.log(init.scene);
        });
      });

      setLoaded(true);
    }
  }, [ref, loaded]);
  const div = <div ref={ref} />;
  return div;
};
export default Canvas;
