import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Container,
  Table,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./profile-style.css";
import axios from "axios";

import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";

import EditProfileModal from "./../../Modal/EditProfileModal";
const Profile = () => {
  const fetchData = async (url, header) => {
    const response = await axios.get(url, header);
    return response.data;
  };
  const userObject = useSelector((state) => state.user.userObject);

  const navigate = useNavigate();

  const [validateLogList, setValidateLogList] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  // dispatch(setUser(res.data.newUser));

  const fetchLog = () => {
    fetchData(`http://localhost:3333/users/validateLog/${userObject._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      const filteredUserLog = res.userLog.filter((log) => {
        return log.animationID !== null;
      });
      setValidateLogList(filteredUserLog);
    });
  };

  const refetch = () => {
    fetchLog();
  };
  useEffect(() => {
    if (userObject !== null) {
      fetchLog();
    } else {
      navigate("/login");
    }
  }, [userObject]);



  return (
    <div className="profile-background ">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="my-3">
              <Card.Header
                as="h3"
                className="d-flex justify-content-between
                align-items-center profile-card-header "
              >
                <div className="d-flex align-items-center card-header-text">
                  Profile
                </div>
                <Button
                  className="d-flex align-items-center"
                  onClick={() => setShowEditProfile(true)}
                >
                  <FaEdit color="white" size={16} />
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={5}>
                    {" "}
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">Username :</div>
                      </div>
                    </div>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4 ">ชื่อ :</div>{" "}
                      </div>
                    </div>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">นามสกุล :</div>{" "}
                      </div>
                    </div>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">ตำแหน่ง :</div>{" "}
                      </div>
                    </div>
                  </Col>
                  <Col xs={7}>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">{userObject?.username}</div>
                      </div>
                    </div>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">{userObject?.firstName}</div>
                      </div>
                    </div>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">{userObject?.lastName}</div>
                      </div>
                    </div>
                    <div className="d-flex  justify-content-start align-items-center">
                      <div className="d-flex my-3">
                        <div className="mx-4">{userObject?.role}</div>
                      </div>
                    </div>
                  </Col>
                </Row>
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
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{log.animationID?.wordID?.word}</td>
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
        <EditProfileModal
          showEditProfile={showEditProfile}
          setShowEditProfile={setShowEditProfile}
          refetch={refetch}
        />
      </Container>
    </div>
  );
};

export default Profile;
