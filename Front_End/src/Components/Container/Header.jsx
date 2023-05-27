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
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./../redux/userReducer";
import { setSearch, clearSearch } from "../redux/searchReducer";
import { Formik } from "formik";
import * as yup from "yup";
const Header = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage")); // update storage after set item
    dispatch(setUser(null));
  };

  const schema = yup.object().shape({
    search: yup.string(),
  });

  const submitSearch = (values) => {
    dispatch(setSearch(values.search.trim()));
  };
  return (
    <>
      <Navbar fixed="top" variant="dark" className="Navbar">
        <Container
          fluid
          className="d-flex justify-content-start align-items-center px-5"
        >
          <Col sm={1}>
            <Navbar.Brand
              onClick={() => {
                dispatch(clearSearch());
                document.getElementById("searchForm").reset();
              }}
            >
              <Link to="/">TSL</Link>
            </Navbar.Brand>
          </Col>
          <Col sm={8} md={6}>
            {location.pathname !== "/login" &&
              location.pathname !== "/signup" &&
              location.pathname !== "/profile" && (
                <Formik
                  initialValues={{
                    search: "",
                  }}
                  validationSchema={schema}
                  onSubmit={(values) => {
                    submitSearch(values);
                  }}
                >
                  {({ handleSubmit, handleChange }) => (
                    <Form
                      onSubmit={handleSubmit}
                      id="searchForm"
                      className="d-flex"
                    >
                      <Form.Control
                        name="search"
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        onChange={handleChange}
                      />
                      <Button variant="outline-light" type="submit">
                        Search
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
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
