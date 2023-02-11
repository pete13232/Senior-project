import { useState, useEffect } from 'react';
import { Canvas } from "./Components/Canvas";
import {
  Card,
  Button,
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  ListGroup,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faBackwardFast,
  faForwardFast,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  // const word_list = [
  //   "ฉัน",
  //   "รัก",
  //   "บ้าน",
  //   "กิน",
  //   "นอน",
  //   "วิ่ง",
  //   "เดิน",
  //   "เล่น",
  //   "แมงมุม",
  //   "หลังคา",
  // ];

  const [wordList, setWordList] = useState([]);
  const [word, setWord] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3333/words")
      .then(res => res.json())
      .then(
        (result) => {
          setWordList(result);
        }
      )
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/words/:wordName")
      .then(res => res.json())
      .then(
        (result) => {
          setWord(result);
        }
      )
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid className="px-5">
          <Navbar.Brand href="#home">Logo</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contract">Contract</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid className="px-5">
        <Row className="py-2">
          <Col>
            <Card style={{ width: "max-content" }}>
              <Card.Body>
                <div
                  className="pa-4"
                  style={{ position: "relative", borderStyle: "groove" }}
                >
                  <Canvas />
                </div>
              </Card.Body>
              <div className="d-flex justify-content-center align-content-center py-2">
                <Button variant="primary" className="mx-2">
                  <FontAwesomeIcon icon={faBackwardFast} />
                </Button>
                <Button variant="primary" className="mx-2">
                  <FontAwesomeIcon icon={faPlay} />
                </Button>
                <Button variant="primary" className="mx-2">
                  <FontAwesomeIcon icon={faForwardFast} />
                </Button>
              </div>
              {wordList.map((word) => (
                <Card body className="m-2" key={word.wordID}>
                  <Card.Text className="fw-bold">{word.wordName}</Card.Text>
                  <Card.Text>
                    {word.description}
                  </Card.Text>
                </Card>
              ))}
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>Words</Card.Header>
              <ListGroup as="ol" numbered variant="flush">
                {wordList.map((word) => (
                  <ListGroup.Item
                    as="li"
                    className="d-flex align-items-center"
                    key={word.wordID}
                  >
                    <div className="d-flex flex-fill  justify-content-between align-items-center">
                      <div className="d-flex justify-content-between align-items-center ps-1">
                        {word.wordName}
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
        <Row>
          <Col className="col-6">
            <Form.Group controlId="formFileLg" className="mb-3">
              <Form.Label>Upload FBX File</Form.Label>
              <Form.Control type="file" size="lg" />
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
