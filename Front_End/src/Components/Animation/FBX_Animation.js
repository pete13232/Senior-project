import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
import * as THREE from "three";
import useFetchData from "../Utils/useFetchData";
const animation = new Promise((res, rej) => {
  const t0 = performance.now();
  // const { data: clipJSON } = useFetchData({
  //   url: "http://localhost:3333/file/1679744668168-testanimation_clip",
  // });

  // const file = "http://localhost:3333/file/1679744637965-Clip_4.fbx";
  // const file = "http://localhost:3333/file/1679744668168-testanimation_clip";
  // const file = "src/model/Clip_4.fbx";
  const loader = new FBXLoader();
  loader.load(file, function (object) {
    let result = undefined;
    if (object.animations[0]) {
      result = object.animations[0];
      console.log("animation track");
      console.log(result);
      res(result);
    }
  });

  // //experiment of FBX track transformation to JSON and back to FBX track again ( Success )
  // let newClip = undefined;
  // let newTrack = result.toJSON().tracks.map((keyframe) => {
  //   if (keyframe.type === "vector") {
  //     return new THREE.VectorKeyframeTrack(
  //       keyframe.name,
  //       keyframe.times,
  //       keyframe.values
  //     );
  //   } else if (keyframe.type === "quaternion") {
  //     return new THREE.QuaternionKeyframeTrack(
  //       keyframe.name,
  //       keyframe.times,
  //       keyframe.values
  //     );
  //   } else if (keyframe.type === "number") {
  //     return new THREE.NumberKeyframeTrack(
  //       keyframe.name,
  //       keyframe.times,
  //       keyframe.values
  //     );
  //   } else {
  //     return undefined;
  //   }
  // });

  // newClip = new THREE.AnimationClip("x", result.toJSON().duration, newTrack);
  // res(newClip);
  // const t1 = performance.now();
  // console.log(`myFunction took ${t1 - t0} milliseconds.`);
});

export default animation;
