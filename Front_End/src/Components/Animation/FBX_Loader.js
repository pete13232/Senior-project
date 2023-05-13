import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
const model = new Promise((res, rej) => {
  const loader = new FBXLoader();
  const file =
    "https://storage.googleapis.com/pete-bucket-1068/1682623765683-Clip_4.fbx";
  loader.load(file, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    res(object);
  });

});

export default model;
