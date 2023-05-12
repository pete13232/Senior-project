import { useEffect, useState } from "react";
import { Form, Button, Card, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./login-style.css";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userReducer";
import jwt_decode from "jwt-decode";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userObject = useSelector((state) => state.user.userObject);
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`username: ${username}, password: ${password}`);

    console.log(JSON.stringify({ username, password }));

    axios
      .post(
        "http://localhost:3333/login",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("storage")); // update storage after set item
        const decodedToken = jwt_decode(res.data.token);
        dispatch(setUser(decodedToken.user));
        MySwal.fire({
          position: "center",
          title: `Login สำเร็จ`,
          icon: "success",
          didClose: () => navigate("/"),
        });
      })
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
  };

  useEffect(() => {
    if (userObject !== null && localStorage.getItem("token") !== null) {
      navigate("/");
    }
  }, []);

  return (
    <div className="login-background">
      <Col md={4}>
        <Card>
          <Card.Header as="h3" className="login-card-header">
            Login
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="py-2">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="py-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-start align-items-center">
                <Button variant="primary" type="submit" className="d-flex my-2">
                  Login
                </Button>
              </div>
            </Form>
            <p>{userObject?.firstName}</p>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
