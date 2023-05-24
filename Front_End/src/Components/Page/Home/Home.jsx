import { useState, useEffect, useRef } from "react";
import Canvas from "../../Animation/Canvas";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";

import {
  FaPlay,
  FaFastForward,
  FaFastBackward,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { BiDownload } from "react-icons/bi";
import "./home-style.css";

import axios from "axios";
import { useParams, Link } from "react-router-dom";

import AddWordModal from "../../Modal/AddWordModal";
import EditWordModal from "../../Modal/EditWordModal";
import UploadAnimation from "../../SubComponents/UploadAnimation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { useSelector } from "react-redux";
import pako from "pako";
const Home = () => {
  const MySwal = withReactContent(Swal);

  const { wordID, animationID } = useParams();

  const fetchData = async (url, header) => {
    const response = await axios.get(url, header);
    return response.data;
  };

  const [wordList, setWordList] = useState([]);
  const [word, setWord] = useState(null);
  const [animationList, setAnimationList] = useState([]);
  const [animationLogList, setAnimationLogList] = useState([]);
  const [cameraControls, setCameraControls] = useState(undefined);
  const [sceneObject, setSceneObject] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  const [clip, setClip] = useState(undefined);
  const sceneRef = useRef(undefined);
  const userObject = useSelector((state) => state.user.userObject);
  const fetchWordList = () => {
    fetchData("http://localhost:3333/words")
      .then((res) => {
        setWordList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchWord = () => {
    fetchData(`http://localhost:3333/words/${wordID}`)
      .then((res) => {
        setWord(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAnimationList = () => {
    fetchData(`http://localhost:3333/animations/get?wordID=${wordID}`)
      .then((res) => {
        console.log("Animation List");
        console.log(res.data);
        setAnimationList(res.data);
        Promise.all(
          res.data.map((animation) =>
            fetchData(
              `http://localhost:3333/animations/validateLog/${animation._id}`
            )
              .then((response) => {
                return response.animationLog[0];
              })
              .then((log) => {
                if (log.userID !== null) {
                  return { ...log, user: log.userID };
                } else {
                  delete log.userID;
                  return { ...log, user: undefined };
                }
              })
          )
        ).then((results) => {
          console.log("Animation Log");
          console.log(results);
          setAnimationLogList(results);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const refetch = () => {
    fetchWordList();
    if (wordID !== undefined) {
      fetchWord();
      fetchAnimationList();
    }
  };

  useEffect(() => {
    fetchWordList();
  }, []);

  useEffect(() => {
    if (wordID !== undefined) {
      fetchWord();
      fetchAnimationList();
    } else {
      setWord(null);
      setAnimationList([]);
    }
  }, [wordID]);

  const [showAddWord, setShowAddWord] = useState(false);
  const [showEditWord, setShowEditWord] = useState(false);

  const deleteWordAlert = (word) => {
    MySwal.fire({
      // Delete Word confirmation
      position: "center",
      title: `ต้องการจะลบคำว่า\n"${word.word}"\nหรือไม่ ?`,
      text: "การกระทำนี้ไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      // confirm delete
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3333/words/delete/${word._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            // delete success
            MySwal.fire({
              position: "center",
              title: "ลบสำเร็จ!",
              text: `คำว่า\n"${word.word}"\nถูกลบเรียบร้อย`,
              icon: "success",
            });
            refetch(); // refetch changed data
          })
          .catch((error) => {
            console.log(error);
            //delete fail
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
      }
    });
  };

  const deleteAnimationAlert = (animation, index) => {
    MySwal.fire({
      // Delete Word confirmation
      position: "center",
      title: `ต้องการจะลบแอนิเมชัน\n"รูปแบบที่${index + 1}"\nหรือไม่ ?`,
      text: "การกระทำนี้ไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      // confirm delete
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3333/animations/delete/${animation._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            // delete success
            MySwal.fire({
              position: "center",
              title: "ลบสำเร็จ!",
              text: `"รูปแบบที่${index + 1}"\nถูกลบเรียบร้อย`,
              icon: "success",
            });
            refetch(); // refetch changed data
          })
          .catch((error) => {
            console.log(error);
            //delete fail
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
      }
    });
  };

  const validateAnimationAlert = (animation, index, stat) => {
    MySwal.fire({
      // Validate Animation confirmation
      position: "center",
      title: `ต้องการจะ${stat === true ? "แสดง" : "ลบ"}แอนิเมชัน\n"รูปแบบที่${
        index + 1
      }"\nหรือไม่ ?`,
      text: `การกระทำนี้จะทำให้ผู้ใช้งาน${
        stat === true ? "มองเห็น" : "มองไม่เห็น"
      }แอนิเมชัน`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: stat === true ? "#198754" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: stat === true ? "แสดง" : "ซ่อน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      // confirm validate
      if (result.isConfirmed) {
        const aniamtionForm = new FormData();
        aniamtionForm.append("validateStat", stat);
        axios
          .post(
            `http://localhost:3333/animations/validate/${animation._id}`,
            aniamtionForm,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            // validate success
            MySwal.fire({
              position: "center",
              title: `${stat === true ? "แสดง" : "ซ่อน"}สำเร็จ!`,
              text: `"รูปแบบที่${index + 1}"\nถูก${
                stat === true ? "แสดง" : "ซ่อน"
              }เรียบร้อย`,
              icon: "success",
            });
            refetch(); // refetch changed data
          })
          .catch((error) => {
            console.log(error);
            //delete fail
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
      }
    });
  };

  const handleDownloadGLB = () => {
    const modelToExport = sceneObject?.children[2];
    const exporter = new GLTFExporter();
    exporter.parse(
      modelToExport,

      function (result) {
        const blob = new Blob([result], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "model.glb");
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
      },
      function (error) {
        console.log("An error happened" + error);
        MySwal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาด ไม่สามารถดาวน์โหลดได้",
          html: "กรุณาเลือกแอนิเมชันก่อนดาวน์โหลด",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
      {
        binary: true,
        animations: [clip],
      }
    );

    // Update the Canvas component's state to trigger a rerender
    // sceneRef.current.setShouldRender(false);
  };

  const handleDownloadJSON = () => {
    fetchData(`http://localhost:3333/animations/${animationID}`)
      .then((resAnimation) => {
        return fetchData(resAnimation.data.file, {
          responseType: "arraybuffer",
        });
      })
      .then((responseClip) => {
        const compressedClip = new Blob([responseClip]);
        console.log("clip");
        console.log(clip);
        const reader = new FileReader();
        reader.onload = () => {
          const uint8array = new Uint8Array(reader.result);

          // Inflate the compressed data using pako
          const decompressedClip = pako.inflate(uint8array, {
            to: "string",
          });
          console.log("decompressedClip");
          console.log(JSON.parse(decompressedClip));
          const temp = JSON.parse(decompressedClip);
          const blob = new Blob([JSON.stringify(temp.tracks[270])], {
            type: "application/json",
          });
          // const blob = new Blob([decompressedClip], {
          //   type: "application/json",
          // });
          console.log("blob");
          console.log(blob);
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "model.json");
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
        };
        reader.readAsArrayBuffer(compressedClip);
      });
  };

  useEffect(() => {
    if (
      sceneRef.current.scene !== undefined &&
      sceneRef.current.controls !== undefined
    ) {
      setSceneObject(sceneRef.current?.scene);
      setCameraControls(sceneRef.current?.controls);
      console.log("sceneRef");
      console.log(sceneRef);
      console.log(sceneRef.current);
      console.log(sceneRef.current.scene);

      console.log(sceneRef.current.controls);
    }
  }, [sceneRef?.current?.scene, sceneRef?.current?.controls]);

  return (
    <>
      <Container fluid className="px-5">
        <Row className="py-2">
          <Col>
            <Card style={{ width: "max-content" }} className="mb-2">
              <Card.Body>
                <div
                  className="pa-4"
                  style={{ position: "relative", borderStyle: "groove" }}
                >
                  <Canvas
                    sceneRef={sceneRef}
                    loaded={loaded}
                    setLoaded={setLoaded}
                    clip={clip}
                    setClip={setClip}
                  />
                </div>
                <div className="d-flex justify-content-between  align-items-center pt-3 position-relative">
                  <Button
                    variant="primary"
                    className="mx-2 "
                    onClick={() => {
                      cameraControls.reset();
                    }}
                  >
                    รีเซ็ทมุมกล้อง
                  </Button>
                  <div className="d-flex justify-content-center align-items-center pt-3 position-absolute top-50 start-50 translate-middle icon-container">
                    <Button variant="primary" className="mx-2">
                      <FaFastBackward color="white" size={16} />
                    </Button>
                    <Button variant="primary" className="mx-2">
                      <FaPlay color="white" size={16} />
                    </Button>
                    <Button variant="primary" className="mx-2 ">
                      <FaFastForward color="white" size={16} />
                    </Button>
                  </div>
                  <div className="d-flex justify-content-between  align-items-center">
                    {" "}
                    <Button
                      variant="primary"
                      className="d-flex justify-content-center align-items-center mx-2 px-2 py-1"
                      onClick={() => {
                        handleDownloadGLB();
                      }}
                    >
                      <BiDownload color="white" size={28} />
                      <div>glb</div>
                    </Button>
                    <Button
                      variant="primary"
                      className="d-flex justify-content-center align-items-center mx-2 px-2 py-1"
                      onClick={() => {
                        handleDownloadJSON();
                      }}
                    >
                      <BiDownload color="white" size={28} />
                      <div>JSON</div>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header
                as="h5"
                bg="primary"
                className="d-flex justify-content-between align-items-center maincard-header"
              >
                <div className="d-flex align-items-center card-header-text">
                  รายละเอียด
                </div>
                {word !== null && userObject !== null && (
                  <Button
                    className="d-flex align-items-center"
                    onClick={() => setShowEditWord(true)}
                  >
                    <FaEdit color="white" size={16} />
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  {word !== null ? word.word : "ยังไม่ได้เลือกคำศัพท์"}
                </Card.Title>
                <Card.Text>
                  {word !== null ? word.description : " - "}
                </Card.Text>
                {word !== null && (
                  <Card>
                    <Card.Header
                      as="h5"
                      className="d-flex justify-content-between align-items-center infocard-header"
                    >
                      <div className="d-flex align-items-center pt-2">
                        แอนิเมชัน
                      </div>
                    </Card.Header>

                    {animationList.length !== 0 ? (
                      <ListGroup as="ol" variant="flush">
                        {userObject !== null
                          ? animationList.map((animation, index) => (
                              <ListGroup.Item
                                as="ul"
                                className="d-flex align-items-center"
                                key={index}
                              >
                                <div className="d-flex flex-fill  justify-content-between align-items-center">
                                  <div className="d-flex justify-content-between align-items-center ps-1">
                                    รูปแบบที่ {index + 1}
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center ps-1">
                                    <OverlayTrigger
                                      trigger="focus"
                                      placement="top"
                                      overlay={
                                        <Popover id={`popover-positioned-top`}>
                                          {/* <Popover.Header as="h3">{`Popover top`}</Popover.Header> */}
                                          <Popover.Body>
                                            {animationLogList[index]?.user !==
                                            undefined
                                              ? `ผู้ใช้งาน ${animationLogList[index]?.user.username} เป็นคนเปลี่ยนแปลงสถานะแอนิเมชันนี้`
                                              : "ยังไม่มีผู้เชี่ยวชาญมาตรวจสอบแอนิเมชันนี้"}
                                          </Popover.Body>
                                        </Popover>
                                      }
                                    >
                                      <Button
                                        variant={
                                          animationLogList[index]
                                            ?.validateStat === true
                                            ? "success"
                                            : "secondary"
                                        }
                                      >
                                        {animationLogList[index]
                                          ?.validateStat === true
                                          ? "ได้รับการตรวจสอบ"
                                          : "ไม่ได้รับการตรวจสอบ"}
                                      </Button>
                                    </OverlayTrigger>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <Link
                                      to={`/words/${wordID}/animations/${animation._id}`}
                                    >
                                      <Button
                                        variant="primary"
                                        className="mx-2 button-class"
                                      >
                                        เล่น
                                      </Button>
                                    </Link>
                                    <Button
                                      variant={
                                        animationLogList[index]
                                          ?.validateStat === true
                                          ? "secondary"
                                          : "success"
                                      }
                                      className="mx-2 button-class"
                                      onClick={() =>
                                        validateAnimationAlert(
                                          animation,
                                          index,
                                          !animationLogList[index]?.validateStat
                                        )
                                      }
                                    >
                                      {animationLogList[index]?.validateStat ===
                                      true
                                        ? "ซ่อน"
                                        : "แสดง"}
                                    </Button>
                                    {userObject?.role === "admin" && (
                                      <Button
                                        variant="danger"
                                        className="mx-2 button-class"
                                        onClick={() =>
                                          deleteAnimationAlert(animation, index)
                                        }
                                      >
                                        ลบ
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </ListGroup.Item>
                            ))
                          : animationList
                              .filter(
                                (animation, index) =>
                                  animationLogList[index]?.validateStat === true
                              )
                              .map((animation, index) => (
                                <ListGroup.Item
                                  as="ul"
                                  className="d-flex align-items-center"
                                  key={index}
                                >
                                  <div className="d-flex flex-fill  justify-content-between align-items-center">
                                    <div className="d-flex justify-content-between align-items-center ps-1">
                                      รูปแบบที่ {index + 1}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <Link
                                        to={`/words/${wordID}/animations/${animation._id}`}
                                      >
                                        <Button
                                          variant="primary"
                                          className="mx-2 button-class"
                                        >
                                          เล่น
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </ListGroup.Item>
                              ))}
                      </ListGroup>
                    ) : (
                      <ListGroup as="ol" variant="flush">
                        <ListGroup.Item
                          as="ul"
                          className="d-flex align-items-center"
                        >
                          <div className="d-flex flex-fill  justify-content-between align-items-center">
                            <div className="d-flex justify-content-between align-items-center ps-1 card-item-text">
                              ยังไม่มีแอนิเมชัน
                            </div>
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    )}
                  </Card>
                )}
                {word !== null && userObject?.role === "admin" && (
                  <UploadAnimation
                    currentWordID={word._id}
                    currentWord={word.word}
                    refetch={refetch}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header
                as="h5"
                bg="primary"
                className="d-flex justify-content-between align-items-center maincard-header"
              >
                <div className="d-flex align-items-center card-header-text">
                  คำศัพท์
                </div>
                {userObject?.role === "admin" && (
                  <Button
                    className="d-flex align-items-center"
                    onClick={() => setShowAddWord(true)}
                  >
                    <FaPlus color="white" size={16} />
                  </Button>
                )}
              </Card.Header>
              <ListGroup as="ol" numbered variant="flush">
                {wordList.map((word) => (
                  <ListGroup.Item
                    as="li"
                    className="d-flex align-items-center"
                    key={word._id}
                  >
                    <div className="d-flex flex-fill  justify-content-between align-items-center">
                      <div className="d-flex justify-content-between align-items-center ps-1">
                        {word.word}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Link to={`/words/${word._id}`}>
                          <Button
                            variant="primary"
                            className="mx-1 button-class"
                          >
                            เลือก
                          </Button>
                        </Link>
                        {userObject?.role === "admin" && (
                          <Button
                            variant="danger"
                            className="mx-1 button-class"
                            onClick={() => deleteWordAlert(word)}
                          >
                            ลบ
                          </Button>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        {/* AddWordModal */}
        <AddWordModal
          showAddWord={showAddWord}
          setShowAddWord={setShowAddWord}
          refetch={refetch}
        />
        <EditWordModal
          showEditWord={showEditWord}
          setShowEditWord={setShowEditWord}
          currentWordID={word !== null ? word._id : undefined}
          currentWord={word !== null ? word.word : "ยังไม่ได้เลือกคำศัพท์"}
          currentDesc={word !== null ? word.description : " - "}
          refetch={refetch}
        />
      </Container>
    </>
  );
};

export default Home;
