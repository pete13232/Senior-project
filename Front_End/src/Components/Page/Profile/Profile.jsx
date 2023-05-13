import { useState, useEffect } from "react";
import { Card, Col, Row, Container, ListGroup, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./profile-style.css";
import axios from "axios";

import { useSelector } from "react-redux";

const Profile = () => {
  const fetchData = async (url, header) => {
    const response = await axios.get(url, header);
    return response.data;
  };
  const userObject = useSelector((state) => state.user.userObject);

  const navigate = useNavigate();

  const [validateLogList, setValidateLogList] = useState([]);
  // dispatch(setUser(res.data.newUser));

  useEffect(() => {
    if (userObject !== null) {
      fetchData(`http://localhost:3333/users/validateLog/${userObject._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        setValidateLogList(res.userLog);
      });
    } else {
      navigate("/login");
    }
  }, [userObject]);

  // useEffect(() => {
  //   console.log(validateLogList);
  // }, [validateLogList]);

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
                    <div className="mx-4">{userObject?.firstName}</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Last Name :</div>{" "}
                    <div className="mx-4">{userObject?.lastName}</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Username :</div>{" "}
                    <div className="mx-4">{userObject?.username}</div>
                  </div>
                </div>
                <div className="d-flex  justify-content-start align-items-center">
                  <div className="d-flex my-3">
                    <div className="mx-4">Role :</div>{" "}
                    <div className="mx-4">{userObject?.role}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center ">
          <Col md={8}>
            <Card className="my-3">
              <Card.Header as="h3" className="profile-card-header ">
                Validation log
              </Card.Header>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Word</th>
                    <th>AnimationID</th>
                    <th>ValidateStat</th>
                  </tr>
                </thead>
                <tbody>
                  {validateLogList.map((log, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{log.animationID?.wordID.word}</td>
                      <td>{log.animationID?._id}</td>
                      <td>
                        {log.validateStat === true ? "อนุมัติ" : "ไม่อนุมัติ"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
