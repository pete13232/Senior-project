import React, { useState, useEffect } from "react";
import { Form, Button, Card, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import "./signup-style.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    username: yup.string().required("กรุณากรอกชื่อยูสเซอร์"),
    password: yup
      .string()
      .required("กรุณากรอกพาสเวิร์ด")
      .min(8, "พาสเวิร์ดต้องมีความยาวมากกว่า 8 ตัวอักษร"),
    confirmPassword: yup
      .string()
      .required("กรุณากรอกยืนยันพาสเวิร์ด")
      .oneOf([yup.ref("password"), null], "พาสเวิร์ดไม่ตรงกัน"),
    firstname: yup.string().required("กรุณากรอกชื่อ"),
    lastname: yup.string().required("กรุณากรอกนามสกุล"),
  });
  const submitSignUp = (values) => {
    const userForm = new FormData();
    userForm.append("username", values.username);
    userForm.append("password", values.password);
    userForm.append("firstName", values.firstname);
    userForm.append("lastName", values.lastname);
    userForm.append("role", "specialist");
    axios
      .post("http://localhost:3333/users/add", userForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((addUserResponse) => {
        MySwal.fire({
          position: "center",
          title: "สมัครสมาชิกสำเร็จ!",
          text: `ยูสเซอร์"${values.username}"\nถูกสร้างเรียบร้อย`,
          icon: "success",
          didClose: () => {
            navigate("/");
          },
        });
      })
      .catch((error) => {
        console.log(error);
        MySwal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
          html: error,
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
  };
  // useEffect(() => {
  //   navigate("/login");
  // }, []);

  return (
    <div className="signup-background">
      <Col md={4}>
        <Card>
          <Card.Header as="h3" className="signupcard-header">
            Signup for Specialist
          </Card.Header>
          <Card.Body>
            <Formik
              initialValues={{
                username: "",
                password: "",
                confirmPassword: "",
                firstname: "",
                lastname: "",
              }}
              validationSchema={schema}
              onSubmit={(values) => {
                submitSignUp(values);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                setFieldValue,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <Form onSubmit={handleSubmit} id="signUpForm">
                  <Form.Group controlId="formBasicUsername" className="py-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      type="text"
                      placeholder="ภาษาอังกฤษหรือตัวเลข"
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                    />
                  </Form.Group>
                  <p className="errorMessage">{errors.username}</p>
                  <Form.Group controlId="formBasicPassword" className="py-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="อย่างน้อย 8 ตัว"
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <p className="errorMessage">{errors.password}</p>
                  </Form.Group>
                  <Form.Group
                    controlId="formBasicConfirmPassword"
                    className="py-2"
                  >
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                      name="confirmPassword"
                      type="password"
                      placeholder="อย่างน้อย 8 ตัว"
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <p className="errorMessage">{errors.confirmPassword}</p>
                  </Form.Group>

                  <Form.Group controlId="formBasicFirstname" className="py-2">
                    <Form.Label>ชื่อ</Form.Label>
                    <Form.Control
                      name="firstname"
                      type="text"
                      placeholder="ภาษาไทยหรืออังกฤษ"
                      onChange={handleChange}
                      isInvalid={!!errors.firstname}
                    />
                    <p className="errorMessage">{errors.firstname}</p>
                  </Form.Group>
                  <Form.Group controlId="formBasicLastname" className="py-2">
                    <Form.Label>นามสกุล</Form.Label>
                    <Form.Control
                      name="lastname"
                      type="text"
                      placeholder="ภาษาไทยหรืออังกฤษ"
                      onChange={handleChange}
                      isInvalid={!!errors.lastname}
                    />
                    <p className="errorMessage">{errors.lastname}</p>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="my-2">
                    สมัครสมาชิก
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

export default Signup;
