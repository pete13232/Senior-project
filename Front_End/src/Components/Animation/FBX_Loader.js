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
    console.log("model", object);
    // console.log("model in json", object.animations[0].toJSON());
    // console.log("model in json", JSON.stringify(object));
    // console.log("model in json", JSON.stringify(object.animations[0]));
    res(object);
  });

  // const fetchData = async (url) => {
  //   const response = await axios.get(url);
  //   return response.data;
  // };
  // fetchData(
  //   "https://storage.googleapis.com/pete-bucket-1068/1682623765683-Clip_4.fbx"
  // )
  //   .then((resFile) => {
  //     console.log("resFile");
  //     console.log(resFile);
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
