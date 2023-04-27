import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";

const model = new Promise((res, rej) => {
  const loader = new FBXLoader();
  const file = "/model/Clip_4.fbx";
  loader.load(file, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    console.log("model", object);
    // console.log("model in json", object.animations[0].toJSON());
    // console.log("model in json", JSON.stringify(object));
    // console.log("model in json", JSON.stringify(object.animations[0]));
    res(object);
  });
});

export default model;
