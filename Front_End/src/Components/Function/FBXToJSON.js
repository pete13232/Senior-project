import { FBXLoader } from "three/examples/jsm//loaders/FBXLoader.js";
import pako from "pako";
const FBXtoJSON = ({ file }) =>
  new Promise((res, rej) => {
    const AnimationOptimizer = (clip, samplingConstant) => {
      let optimizedTracks = clip.tracks;

      for (let i = 0; i < optimizedTracks.length; i++) {
        let track = { ...optimizedTracks[i] };
        const timesLength = track.times.length;
        const numValuesPerKeyframe = track.values.length / timesLength;
        // Find index of keyframe to remove
        for (
          let indexToRemove = 1;
          indexToRemove < timesLength;
          indexToRemove = indexToRemove + 1
        ) {
          if (indexToRemove > 0) {
            // Remove keyframe at specified index
            track.times.splice(indexToRemove, samplingConstant);
            track.values.splice(
              indexToRemove * numValuesPerKeyframe,
              numValuesPerKeyframe * samplingConstant
            );
          }
        }
        optimizedTracks[i] = { ...track };
      }
      let temp_clip = { ...clip };
      temp_clip.tracks = optimizedTracks.slice();

      return temp_clip;
    };

    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      const fileAsArrayBuffer = event.target.result;
      let object = undefined;
      let result = undefined;
      const loader = new FBXLoader();
      object = loader.parse(fileAsArrayBuffer);
      if (object.animations[0] !== undefined) {
        // result = JSON.stringify(object.animations[0].toJSON());
        const JSONClip = object.animations[0].toJSON();
        const originalClip = JSON.parse(JSON.stringify(JSONClip));
        const optimizedClip = AnimationOptimizer(JSONClip, 20);
        // result = pako.gzip(JSON.stringify(object.animations[0].toJSON()));
        result = pako.gzip(JSON.stringify(optimizedClip));
      }
      res(result);
    });
    reader.readAsArrayBuffer(file);
  });

export default FBXtoJSON;
