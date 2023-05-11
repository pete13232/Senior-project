import { useState } from "react";
import { Form, Button, Card, Col } from "react-bootstrap";
import { Link, redirect } from "react-router-dom";
import "./login-style.css";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userReducer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userObject = useSelector((state) => state.user.userObject);
  const dispatch = useDispatch();
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
        dispatch(setUser(res.data.newUser));
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("storage")); // update storage after set item
        console.log("localStorage = " + localStorage.getItem("token"));
        alert("Pass new User =" + res.data);
        redirect("/");
      })
      .catch((error) => {
        alert("There was an error!" + error);
        console.error("There was an error!", error);
      });
  };

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
