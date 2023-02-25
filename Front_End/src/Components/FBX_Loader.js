import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";

const model = new Promise((res, rej) => {
  
  const loader = new FBXLoader();
  // const file = "src/model/Opera_Biped.fbx"
  // const file = "src/model/Opera_Maya.fbx"
  // const file = "src/model/Opera_Mixamo.fbx"
  // const file = "src/model/Opera_Rokoko_newton.fbx"
  const file = "src/model/Clip_4.fbx";
  
  // const file = "src/model/Clip_4_Noface.fbx";
  loader.load(file, function (object) {
    console.log("model",object);
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    console.log("model",object);
    console.log("model in json",object.animations[0].toJSON());
    res(object);
  });
});

export default model;
