import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
const FBXtoJSON = ({ file }) =>
  new Promise((res, rej) => {
    console.log(file);
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      const fileAsArrayBuffer = event.target.result;
      console.log(event);
      console.log(fileAsArrayBuffer);
      let object = undefined;
      let result = undefined;
      const loader = new FBXLoader();
      object = loader.parse(fileAsArrayBuffer);
      console.log("object");
      console.log(object);
      if (object.animations[0] !== undefined) {
        result = object.animations[0].toJSON();
      }
      console.log("res result");
      console.log(result);
      res(result);
    });
    reader.readAsArrayBuffer(file);
  });

export default FBXtoJSON;
