import { useState } from "react";
import {
  Form,
  Button,
  Card,
  Col,
  Row,
  Container,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { Link, redirect } from "react-router-dom";
import "./profile-style.css";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userReducer";

const Profile = () => {
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
    <div className="profile-background ">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="my-3">
              <Card.Header as="h3" className="profile-card-header ">
                Profile
              </Card.Header>
              <Card.Body>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4 ">First Name :</div>{" "}
                    <div className="mx-4">Chawanrat</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Last Name :</div>{" "}
                    <div className="mx-4">Nurat</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Username :</div>{" "}
                    <div className="mx-4">Altinate</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Email :</div>{" "}
                    <div className="mx-4">chawanrat.nurat@mail.kmutt.ac.th</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Role :</div>{" "}
                    <div className="mx-4">Admin</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center ">
          <Col md={5}>
            <Card className="my-3">
              <Card.Header as="h3" className="profile-card-header ">
                Validation log
              </Card.Header>
              <ListGroup as="ol" numbered variant="flush">
                <ListGroup.Item as="li" className="d-flex align-items-center">
                  <div className="d-flex flex-fill  justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center ps-1">
                      aimationID = xxxxx แก้ไขโดย Username 16:52 12/05/23
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li" className="d-flex align-items-center">
                  <div className="d-flex flex-fill  justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center ps-1">
                      aimationID = xxxxx แก้ไขโดย Username 16:52 12/05/23
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li" className="d-flex align-items-center">
                  <div className="d-flex flex-fill  justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center ps-1">
                      aimationID = xxxxx แก้ไขโดย Username 16:52 12/05/23
                    </div>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item as="li" className="d-flex align-items-center">
                  <div className="d-flex flex-fill  justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center ps-1">
                      aimationID = xxxxx แก้ไขโดย Username 16:52 12/05/23
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li" className="d-flex align-items-center">
                  <div className="d-flex flex-fill  justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center ps-1">
                      aimationID = xxxxx แก้ไขโดย Username 16:52 12/05/23
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
