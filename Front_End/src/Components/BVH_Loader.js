import { BVHLoader } from "three/addons/loaders/BVHLoader.js";

const animation = new Promise((res, rej) => {
  const loader = new BVHLoader();
  // const file = "src/model/Opera.bvh";
  // const file = "src/model/Casting_rokoko.bvh";
  // const file = "src/model/Opera_mixamo.bvh";
  const file = "src/model/Opera_maya.bvh";
  loader.load(file, function (object) {
    console.log(object);
    res(object);
  });
});

export default animation;
