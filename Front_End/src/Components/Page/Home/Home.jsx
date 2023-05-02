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
const Home = () => {
  const { wordID, animationID } = useParams();

  const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const [wordList, setWordList] = useState([]);
  const [word, setWord] = useState(undefined);

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
  const refetch = () => {
    fetchWordList();
    fetchWord();
  };

  useEffect(() => {
    fetchWordList();
    console.log("useEffect1");
  }, []);

  useEffect(() => {
    if (wordID !== undefined) {
      fetchWord();
    } else {
      setWord(undefined);
    }
    console.log("useEffect2");
  }, [wordID]);

  console.log(wordList);

  const [showAddWord, setShowAddWord] = useState(false);
  const [showEditWord, setShowEditWord] = useState(false);
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
                {wordID !== undefined && (
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
                  {word !== undefined ? word.word : "ยังไม่ได้เลือกคำศัพท์"}
                </Card.Title>
                <Card.Text>
                  {word !== undefined ? word.description : " - "}
                </Card.Text>
                {word !== undefined && (
                  <Card>
                    <Card.Header
                      as="h5"
                      className="d-flex justify-content-between align-items-center infocard-header"
                    >
                      <div className="d-flex align-items-center pt-2">
                        แอนิเมชัน
                      </div>
                    </Card.Header>
                    <ListGroup as="ol" numbered variant="flush">
                      <ListGroup.Item
                        as="li"
                        className="d-flex align-items-center"
                      >
                        <div className="d-flex flex-fill  justify-content-between align-items-center">
                          <div className="d-flex justify-content-between align-items-center ps-1">
                            Pattern 1 // animationID = {animationID}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <Button variant="primary" className="mx-2">
                              Play
                            </Button>
                            <Button variant="warning" className="mx-2">
                              Edit
                            </Button>
                            <Button variant="danger" className="mx-2">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
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
                        <Button variant="danger" className="mx-1 button-class">
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
          currentWordID={word !== undefined ? word._id : undefined}
          currentWord={word !== undefined ? word.word : "ยังไม่ได้เลือกคำศัพท์"}
          currentDesc={word !== undefined ? word.description : " - "}
          refetch={refetch}
        />
      </Container>
    </>
  );
};

export default Home;
