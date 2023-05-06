import { useEffect, useRef, useState } from "react";
import * as dat from "dat.gui";
import model from "./FBX_Loader.js";
import SceneInit from "./SceneInit.js";
import * as THREE from "three";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Canvas = () => {
  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };
  const { wordID, animationID } = useParams();

  const MySwal = withReactContent(Swal);

  // let mixer = undefined;
  let init = undefined;
  // let clips = undefined;

  let temp1_mixer = undefined;
  let temp1_clips = undefined;
  let temp2_mixer = undefined;
  let temp2_clips = undefined;
  const [mixer, setMixer] = useState(undefined);
  const [clips, setClips] = useState([]);

  const ref = useRef();
  const [loaded, setLoaded] = useState(false);
  const [clip, setClip] = useState(undefined);
  const clock = new THREE.Clock();
  let options = {
    position_x: 0,
    position_y: -50,
    position_z: 0,
    scale: 0.39,
  };

  const animate = () => {
    window.requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (temp1_mixer) temp1_mixer.update(delta);
    init.render();
    init.stats.update();
    init.controls.update();
    if (init.scene.children[2] !== undefined) {
      init.scene.children[2].position.x = options.position_x;
      init.scene.children[2].position.y = options.position_y;
      init.scene.children[2].position.z = options.position_z;
      init.scene.children[2].scale.set(
        options.scale,
        options.scale,
        options.scale
      );
    }
  };

  const clipTransform = (clip) => {
    const newTrack = clip.tracks.map((keyframe) => {
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

    const newClip = new THREE.AnimationClip(
      "AnimationClip",
      clip.duration,
      newTrack
    );
    return newClip;
  };

  useEffect(() => {
    console.log("useEffect run");
    console.log("loaded", loaded);
    console.log("ref", ref);
    if (!loaded && ref) {
      console.log("in if");
      init = new SceneInit(ref);
      init.initialize();
      animate();
      init.animate();

      // const gui = new dat.GUI();
      // gui.add(options, "position_x", -20, 20);
      // gui.add(options, "position_y", -50, 50);
      // gui.add(options, "position_z", -50, 50);
      // gui.add(options, "scale", 0.1, 0.5);
      MySwal.fire({
        title: "รอสักครู่",
        text: `กำลังโหลดโมเดลตัวละคร`,
        allowOutsideClick: false,
        didOpen: () => {
          console.log("swal fire");
          MySwal.showLoading();
          model.then((object) => {
            console.log("Loaded model");
            init.scene.add(object);
            let s = 0.28;
            object.scale.set(s, s, s);
            object.position.y = -32;
            temp1_mixer = new THREE.AnimationMixer(object);
            setMixer(temp1_mixer);

            temp1_clips = object.animations.map((animation) => {
              return temp1_mixer.clipAction(animation);
            });

            temp1_clips.splice(0);
            setClips(temp1_clips);
            MySwal.close();
          });
        },
      });

      setLoaded(true);
    }
  }, [ref, loaded]);

  useEffect(() => {
    if (mixer !== undefined && clips !== undefined) {
      if (animationID !== undefined) {
        MySwal.fire({
          title: "รอสักครู่",
          text: `กำลังโหลดแอนิเมชันตัวละคร`,
          allowOutsideClick: false,
          didOpen: () => {
            MySwal.showLoading();
          },
        });
        fetchData(`http://localhost:3333/animations/${animationID}`)
          .then((resAnimation) => {
            console.log("fetch for url success");
            return fetchData(resAnimation.data.file);
          })
          .then((responseClip) => {
            console.log("fetch JSON success");
            temp2_mixer = mixer;
            temp2_clips = clips;
            if (temp2_clips.length > 0) {
              temp2_clips.splice(0);
            }
            console.log(clips);
            const t0 = performance.now();
            temp2_clips.push(
              temp2_mixer.clipAction(clipTransform(responseClip))
            );
            // clips.push(mixer.clipAction(clipTransform(responseClip)));

            setClips(temp2_clips);

            clips[0].play();
            MySwal.close();
            const t1 = performance.now();
            console.log(`myFunction took ${t1 - t0} milliseconds.`);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (animationID === undefined) {
        temp2_clips = clips;
        temp2_mixer = mixer;
        if (temp2_clips.length > 0) {
          temp2_mixer.stopAllAction();
          temp2_clips.splice(0);
        }
        setClips(temp2_clips);
      }
    }
  }, [animationID, mixer, clips]);
  const div = <div ref={ref} />;
  return div;
};
export default Canvas;
