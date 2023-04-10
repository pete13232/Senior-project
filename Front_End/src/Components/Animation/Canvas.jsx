import { useEffect, useRef, useState } from "react";
import * as dat from "dat.gui";
import model from "./FBX_Loader.js";
// import animation from "./BVH_Loader.js";
import SceneInit from "./SceneInit.js";
import * as THREE from "three";
import axios from "axios";

const Canvas = () => {
  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  let mixer = undefined;
  let init = undefined;
  let clips = undefined;
  const ref = useRef();
  const [loaded, setLoaded] = useState(false);
  const [clip, setClip] = useState(undefined);
  const clock = new THREE.Clock();
  let options = {
    position_x: 0,
    position_y: -30,
    position_z: 20,
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

  const clipTransform = (clip) => {
    const newTrack = clip.tracks.map((keyframe) => {
      if (keyframe.type === "vector") {
        return new THREE.VectorKeyframeTrack(
          keyframe.name,
          keyframe.times,
          keyframe.values
        );
      } else if (keyframe.type === "quaternion") {
        return new THREE.QuaternionKeyframeTrack(
          keyframe.name,
          keyframe.times,
          keyframe.values
        );
      } else if (keyframe.type === "number") {
        return new THREE.NumberKeyframeTrack(
          keyframe.name,
          keyframe.times,
          keyframe.values
        );
      } else {
        return undefined;
      }
    });

    const newClip = new THREE.AnimationClip(
      "AnimationClip",
      clip.duration,
      newTrack
    );
    return newClip;
  };

  useEffect(() => {
    console.log("useEffect");
  }, []);
  useEffect(() => {
    fetchData("http://localhost:3333/file/1679744668168-testanimation_clip")
      .then((responseClip) => {
        const t0 = performance.now();

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

          /*model.then((object) => {
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
            });
          });*/

          model.then((object) => {
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
            clips.push(mixer.clipAction(clipTransform(responseClip)));

            //selecting clips
            // clips[0].play();

            clips[1].play();
            // clips[2].play();
          });

          setLoaded(true);
        }
        const t1 = performance.now();
        console.log(`myFunction took ${t1 - t0} milliseconds.`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref, loaded]);
  const div = <div ref={ref} />;
  return div;
};
export default Canvas;
