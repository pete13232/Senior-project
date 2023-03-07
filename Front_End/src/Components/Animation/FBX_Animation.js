import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
import * as THREE from "three";
import { VectorKeyframeTrack } from "three";
const animation = new Promise((res, rej) => {
  const loader = new FBXLoader();
  // const file = "src/model/Opera_Biped.fbx"
  // const file = "src/model/Opera_Maya.fbx"
  // const file = "src/model/Opera_Mixamo.fbx"
  // const file = "src/model/Opera_Rokoko_newton.fbx";
  const file = "src/model/Clip_4.fbx";
  // const file = "src/model/Clip_4_Noface.fbx";
  // const file = "src/model/Casting_rokoko.fbx";
  // const file = "src/model/Taunt.fbx";
  // const file = "src/model/Clip_3_NoFace.fbx";
  // const file = "src/model/Clip_3_mixamo.fbx";
  let x = undefined;
  loader.load(file, function (object) {
    console.log("animation",object);
    // var fs = require("fs");
    let result = undefined;
    if (object.animations[0]) {
      result = object.animations[0];
      console.log("result", result);
      console.log("json result", result.toJSON());

      //experiment of FBX track transformation to JSON and back to FBX track again ( Success )
      let newTrack = result.toJSON().tracks.map((keyframe) => {
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

      console.log("New Track", newTrack);

      x = new THREE.AnimationClip("x", result.toJSON().duration, newTrack);
      console.log("clip", x);
      // fs.writeFile("saved_animation.json", result.toJSON(), function (err) {
      //   if (err) {
      //     console.log(err);
      //   }
      // });
    }
    res(x);
  });
});

export default animation;
