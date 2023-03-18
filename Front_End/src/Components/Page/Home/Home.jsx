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
import qs from "qs";
import axios from "axios";
const Home = () => {
  const {
    data: wordList,
    loading: wordListLoading,
    success: wordListSuccess,
  } = useFetchData({
    url: "http://localhost:3333/words",
  });
  console.log(wordList);

  const [showAddWord, setShowAddWord] = useState(false);

  const handleClose = (setClose) => {
    setClose(false);
  };
  const handleShow = (setShow) => {
    setShow(true);
  };

  const schema = yup.object().shape({
    word: yup.string().required(),
    description: yup.string().required(),
    animation: yup.mixed(),
  });

  const submitAddWord = (values) => {
    //delete animation property waitng for debug
    delete values.animation;

    axios
      .post("http://localhost:3333/words/add", qs.stringify(values))
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

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
                  <div className="d-flex justify-content-center align-content-center pt-3">
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
                  className="d-flex justify-content-between align-content-center"
                >
                  <div className="d-flex align-content-center pt-2">Detail</div>
                  <Button className="d-flex align-content-center">
                    <FaEdit color="white" size={16} />
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Title>word</Card.Title>
                  <Card.Text>description</Card.Text>
                </Card.Body>
              </Card>
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>Upload FBX File</Form.Label>
                <Form.Control type="file" size="lg" />
              </Form.Group>
            </Col>
            <Col>
              <Card>
                <Card.Header
                  as="h5"
                  bg="primary"
                  className="d-flex justify-content-between align-content-center"
                >
                  <div className="d-flex align-content-center pt-2">Words</div>
                  <Button
                    className="d-flex align-content-center"
                    onClick={() => handleShow(setShowAddWord)}
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
          <Modal show={showAddWord} onHide={() => handleClose(setShowAddWord)}>
            <Formik
              initialValues={{
                word: "",
                description: "",
                animation: "",
              }}
              validationSchema={schema}
              onSubmit={(values) => {
                submitAddWord(values);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Word</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group className="mb-3" controlId="addWord">
                      <Form.Label>Word</Form.Label>
                      <Form.Control
                        name="word"
                        type="text"
                        placeholder="Enter word"
                        autoFocus
                        onChange={handleChange}
                        isInvalid={!!errors.word}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="addDesc">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        name="description"
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        onChange={handleChange}
                        isInvalid={!!errors.description}
                      />
                    </Form.Group>
                    <Form.Group controlId="addAnimation" className="mb-3">
                      <Form.Label>FBX Animation File</Form.Label>
                      <Form.Control
                        name="animation"
                        type="file"
                        onChange={handleChange}
                        isInvalid={!!errors.file}
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => handleClose(setShowAddWord)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        isValid ? handleClose(setShowAddWord) : null;
                      }}
                      type="submit"
                    >
                      Add
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default Home;
