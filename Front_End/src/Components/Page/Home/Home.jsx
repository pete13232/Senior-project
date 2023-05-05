import { useState, useEffect } from "react";
import Canvas from "../../Animation/Canvas";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Form,
} from "react-bootstrap";

import {
  FaPlay,
  FaFastForward,
  FaFastBackward,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

import "./style.css";

import axios from "axios";
import { useParams, Link } from "react-router-dom";

import AddWordModal from "../../Modal/AddWordModal";
import EditWordModal from "../../Modal/EditWordModal";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Home = () => {
  const MySwal = withReactContent(Swal);

  const { wordID, animationID } = useParams();

  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const [wordList, setWordList] = useState([]);
  const [word, setWord] = useState(null);
  const [animationList, setAnimationList] = useState([]);

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
        setAnimationList(res.data);
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
                  <Canvas />
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3">
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
                {word !== null && (
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
                        {animationList.map((animation, index) => (
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
                                    แสดง
                                  </Button>
                                </Link>
                                <Button
                                  variant="danger"
                                  className="mx-2 button-class"
                                  onClick={() =>
                                    deleteAnimationAlert(animation, index)
                                  }
                                >
                                  ลบ
                                </Button>
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
                <Form.Group controlId="formFileLg" className="mb-3">
                  <Form.Label>Upload FBX File</Form.Label>
                  <Form.Control type="file" size="lg" />
                </Form.Group>
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
                <Button
                  className="d-flex align-items-center"
                  onClick={() => setShowAddWord(true)}
                >
                  <FaPlus color="white" size={16} />
                </Button>
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
                        <Button
                          variant="danger"
                          className="mx-1 button-class"
                          onClick={() => deleteWordAlert(word)}
                        >
                          ลบ
                        </Button>
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
