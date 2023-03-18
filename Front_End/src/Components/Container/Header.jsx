import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import "./style.css";
import { FaUserCircle, } from "react-icons/fa";
const Header = () => {
  return (
    <>
      <Navbar variant="dark" className="Navbar">
        <Container
          fluid
          className="d-flex justify-content-start align-content-center px-5"
        >
          <Col sm={1}>
            <Navbar.Brand href="#home">TSL</Navbar.Brand>
          </Col>
          <Col sm={8} md={6}>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
          </Col>
          <Col>
            <div className="d-flex justify-content-end">
              <FaUserCircle color="white" size={24} />
            </div>
          </Col>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
