import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
import axios from "../Utils/axiosInstance";
const model = new Promise((res, rej) => {
  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };
  const file = "/public/model/Clip_4.fbx";
  const loader = new FBXLoader();
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
  console.log("Before fetch");
  // fetchData(
  //   "https://storage.googleapis.com/pete-bucket-1068/1682623765683-Clip_4.fbx"
  // )
  //   .then((resFile) => {
  //     loader.load(resFile, function (object) {
  //       object.traverse(function (child) {
  //         if (child.isMesh) {
  //           child.castShadow = true;
  //           child.receiveShadow = true;
  //         }
  //       });
  //       console.log("model", object);
  //       // console.log("model in json", object.animations[0].toJSON());
  //       // console.log("model in json", JSON.stringify(object));
  //       // console.log("model in json", JSON.stringify(object.animations[0]));
  //       res(object);
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

export default model;
