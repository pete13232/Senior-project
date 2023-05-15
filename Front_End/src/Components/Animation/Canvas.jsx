import { useEffect, useRef, useState, useImperativeHandle } from "react";
import * as dat from "dat.gui";
import model from "./FBX_Loader.js";
import SceneInit from "./SceneInit.js";
import * as THREE from "three";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import pako from "pako";
const Canvas = ({ sceneRef, clip, setClip }) => {
  const fetchData = async (url, header, data) => {
    const response = await axios.get(url, header, data);
    return response.data;
  };
  const { wordID, animationID } = useParams();

  const MySwal = withReactContent(Swal);

  // let mixer = undefined;
  let temp_init = undefined;
  // let clips = undefined;

  let temp1_mixer = undefined;
  let temp1_clips = undefined;
  let temp2_mixer = undefined;
  let temp2_clips = undefined;
  const [init, setInit] = useState(undefined);
  const [mixer, setMixer] = useState(undefined);
  const [clips, setClips] = useState([]);

  const ref = useRef(null);
  const mixerRef = useRef(null);

  const [loaded, setLoaded] = useState(false);

  useImperativeHandle(sceneRef, () => ({
    get scene() {
      return init?.scene;
    },
    get controls() {
      return init?.controls;
    },
  }));

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
    temp_init.render();
    temp_init.stats.update();
    temp_init.controls.update();

    if (temp_init.scene.children[2] !== undefined) {
      // console.log("temp_init.scene.children[2]");
      // console.log(temp_init.scene.children[2]);
      temp_init.scene.children[2].position.x = options.position_x;
      temp_init.scene.children[2].position.y = options.position_y;
      temp_init.scene.children[2].position.z = options.position_z;
      temp_init.scene.children[2].scale.set(
        options.scale,
        options.scale,
        options.scale
      );
    }
  };

  useEffect(() => {
    console.log("ref in useEffect");
    console.log(ref);
    if (!loaded && ref) {
      console.log("Init");
      temp_init = new SceneInit(ref);
      temp_init.initialize();
      animate();
      temp_init.animate();

      setInit(temp_init);
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
          MySwal.showLoading();
          model.then((object) => {
            object.animations.splice(0);
            console.log("object");
            console.log(object);
            let s = 0.28;
            object.scale.set(s, s, s);
            object.position.y = -32;
            temp_init.scene.add(object);

            setInit(temp_init);
            temp1_mixer = new THREE.AnimationMixer(object);
            setMixer(temp1_mixer);
            mixerRef.current = temp1_mixer;

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
    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, [ref, loaded]);

  useEffect(() => {
    let t0 = undefined;
    let t1 = undefined;
    if (mixer !== undefined && clips !== undefined) {
      if (animationID !== undefined) {
        MySwal.fire({
          title: "รอสักครู่",
          text: `กำลังโหลดแอนิเมชันตัวละคร`,
          allowOutsideClick: false,
          didOpen: () => {
            t0 = performance.now();
            MySwal.showLoading();
            /*-----------------------Fetch Compress JSON from cloud ------------------- */
            fetchData(`http://localhost:3333/animations/${animationID}`)
              .then((resAnimation) => {
                return fetchData(resAnimation.data.file, {
                  responseType: "arraybuffer", // Tell axios to return binary data
                });
              })
              .then((responseClip) => {
                const compressedClip = new Blob([responseClip]);

                const reader = new FileReader();
                reader.onload = () => {
                  const uint8array = new Uint8Array(reader.result);

                  // Inflate the compressed data using pako
                  const decompressedClip = pako.inflate(uint8array, {
                    to: "string",
                  });

                  temp2_mixer = mixer;
                  temp2_clips = clips;
                  if (temp2_clips.length > 0) {
                    temp2_mixer.stopAllAction();
                    temp2_clips.splice(0);
                  }

                  const animationClip = THREE.AnimationClip.parse(
                    JSON.parse(decompressedClip)
                  );
                  temp2_clips.push(temp2_mixer.clipAction(animationClip));
                  setClips(temp2_clips);

                  temp2_clips[0].play();
                  setClip(animationClip);
                  MySwal.close();
                  t1 = performance.now();
                  console.log(`myFunction took ${t1 - t0} milliseconds.`);
                };
                reader.readAsArrayBuffer(compressedClip);
              })
              /*-----------------------Fetch Compress JSON from cloud ------------------- */

              /*-----------------------Fetch Normal JSON from cloud ------------------- */
              // fetchData(`http://localhost:3333/animations/${animationID}`)
              //   .then((resAnimation) => {
              //     return fetchData(resAnimation.data.file);
              //   })
              //   .then((responseClip) => {
              //     temp2_mixer = mixer;
              //     temp2_clips = clips;
              //     if (temp2_clips.length > 0) {
              //       temp2_clips.splice(0);
              //     }

              //     temp2_clips.push(
              //       temp2_mixer.clipAction(
              //         THREE.AnimationClip.parse(responseClip)
              //       )
              //     );
              //     // clips.push(mixer.clipAction(clipTransform(responseClip)));

              //     setClips(temp2_clips);

              //     clips[0].play();
              //     MySwal.close();
              //     t1 = performance.now();
              //     console.log(`myFunction took ${t1 - t0} milliseconds.`);
              //   })
              /*-----------------------Fetch Normal JSON from cloud ------------------- */
              /*----------------------- Fetch Backend Compress JSON from cloud ------------------- */

              // fetchData(`http://localhost:3333/animations/${animationID}`)
              //   .then((resAnimation) => {
              //     const animationForm = new FormData();
              //     animationForm.append("GCS_filename", resAnimation.data.file);
              //     return fetchData(
              //       `http://localhost:3333/animations/compress/GCS?animationID=${animationID}`,
              //       {},
              //       animationForm
              //     );
              //   })
              //   .then((responseClip) => {
              //     const compressedClip = new Blob([responseClip]);

              //     const reader = new FileReader();
              //     reader.onload = () => {
              //       const uint8array = new Uint8Array(reader.result);

              //       // Inflate the compressed data using pako
              //       const decompressedClip = pako.inflate(uint8array, {
              //         to: "string",
              //       });

              //       temp2_mixer = mixer;
              //       temp2_clips = clips;
              //       if (temp2_clips.length > 0) {
              //         temp2_clips.splice(0);
              //       }

              //       temp2_clips.push(
              //         temp2_mixer.clipAction(
              //           THREE.AnimationClip.parse(JSON.parse(decompressedClip))
              //         )
              //       );

              //       setClips(temp2_clips);

              //       clips[0].play();
              //       MySwal.close();
              //       t1 = performance.now();
              //       console.log(`myFunction took ${t1 - t0} milliseconds.`);
              //     };
              //     reader.readAsArrayBuffer(compressedClip);
              //   })
              /*----------------------- Fetch Backend Compress JSON from cloud ------------------- */
              .catch((error) => {
                const err = error.message;
                MySwal.fire({
                  position: "center",
                  title: "เกิดข้อผิดพลาด",
                  html: err,
                  icon: "error",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                });
              });
          },
        });
      } else if (animationID === undefined) {
        temp2_clips = clips;
        temp2_mixer = mixer;
        if (temp2_clips.length > 0) {
          temp2_mixer.stopAllAction();
          temp2_clips.splice(0);
        }
        setClips(temp2_clips);
        setClip(undefined);
      }
    }
  }, [animationID, mixer, clips]);

  useEffect(() => {
    console.log("ref");
    console.log(ref);
  }, [ref]);

  const div = <div ref={ref} />;
  return div;
};
export default Canvas;
