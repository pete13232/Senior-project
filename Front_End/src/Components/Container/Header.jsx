import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import "./header-style.css";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./../redux/userReducer";
const Header = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage")); // update storage after set item
    dispatch(setUser(null));
  };
  return (
    <>
      <Navbar fixed="top" variant="dark" className="Navbar">
        <Container
          fluid
          className="d-flex justify-content-start align-items-center px-5"
        >
          <Col sm={1}>
            <Navbar.Brand>
              <Link to="/">TSL</Link>
            </Navbar.Brand>
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
              {userObject !== null &&
                localStorage.getItem("token") !== null &&
                userObject.role === "admin" && (
                  <Link to="/signup">
                    <Button variant="outline-light" className="mx-2">
                      Signup
                    </Button>
                  </Link>
                )}
              {userObject !== null &&
                localStorage.getItem("token") !== null && (
                  <Link to="/profile">
                    <Button variant="outline-light" className="mx-2">
                      Profile
                    </Button>
                  </Link>
                )}
              {userObject !== null && localStorage.getItem("token") !== null ? (
                <Button
                  variant="outline-light"
                  className="mw-2"
                  onClick={() => handleLogout()}
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="outline-light" className="mw-2">
                    Login
                  </Button>
                </Link>
              )}

              {/* <FaUserCircle color="white" size={24} /> */}
            </div>
          </Col>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
