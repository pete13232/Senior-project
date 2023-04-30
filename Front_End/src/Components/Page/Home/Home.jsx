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
  Modal,
} from "react-bootstrap";

import {
  FaPlay,
  FaFastForward,
  FaFastBackward,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

import useFetchData from "../../Utils/useFetchData";

import "./style.css";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "../../Utils/axiosInstance";
import FBXtoJSON from "../../Utils/FBXToJSON";
import { useParams } from "react-router-dom";

import AddWordModal from "../../Modal/AddWordModal";
const Home = () => {
  const {
    data: wordList,
    loading: wordListLoading,
    success: wordListSuccess,
  } = useFetchData({
    url: "http://localhost:3333/words",
  });
  console.log(wordList);
  const { wordID, animationID } = useParams();

  const [showAddWord, setShowAddWord] = useState(false);
  return (
    <>
      {!wordListLoading && (
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
                  <div className="d-flex align-items-center pt-2">Detail</div>
                  <Button className="d-flex align-items-center">
                    <FaEdit color="white" size={16} />
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Title>word //wordID = {wordID}</Card.Title>
                  <Card.Text>description</Card.Text>
                  <Card>
                    <Card.Header
                      as="h5"
                      className="d-flex justify-content-between align-items-center infocard-header"
                    >
                      <div className="d-flex align-items-center pt-2">
                        Animation List
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
                  <div className="d-flex align-items-center pt-2">Words</div>
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
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* AddWordModal */}
          <AddWordModal
            showAddWord={showAddWord}
            setShowAddWord={setShowAddWord}
          />
        </Container>
      )}
    </>
  );
};

export default Home;
