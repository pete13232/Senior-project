import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
import pako from "pako";
const FBXtoJSON = ({ file }) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      const fileAsArrayBuffer = event.target.result;
      let object = undefined;
      let result = undefined;
      const loader = new FBXLoader();
      object = loader.parse(fileAsArrayBuffer);
      if (object.animations[0] !== undefined) {
        // result = JSON.stringify(object.animations[0].toJSON());
        const JSONClip = JSON.stringify(object.animations[0].toJSON());
        console.log(JSONClip);
        result = pako.gzip(JSON.stringify(object.animations[0].toJSON()));
      }
      res(result);
    });
    reader.readAsArrayBuffer(file);
  });

export default FBXtoJSON;
