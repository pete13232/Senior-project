import { Button, Form, Modal } from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./edit-profile-modal-style.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from ".././redux/userReducer";
import jwt_decode from "jwt-decode";

const EditWordModal = ({ showEditProfile, setShowEditProfile, refetch }) => {
  const MySwal = withReactContent(Swal);
  const userObject = useSelector((state) => state.user.userObject);
  const dispatch = useDispatch();
  // dispatch(setUser(res.data.newUser));
  /*------------------------Form Handling--------------------------- */

  const schema = yup.object().shape({
    firstname: yup.string(),
    lastname: yup.string(),
    password: yup.string().min(8, "พาสเวิร์ดต้องมีความยาวมากกว่า 8 ตัวอักษร"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "พาสเวิร์ดไม่ตรงกัน"),
  });
  const handleClose = () => {
    setShowEditProfile(false);
    document.getElementById("editProfileForm").reset();
  };

  const submitEditWord = (values) => {
    const userForm = new FormData();
    if (values.firstName?.length > 0) {
      userForm.append("firstName", values.firstName);
    }

    if (values.lastName?.length > 0) {
      userForm.append("lastName", values.lastName);
    }
    if (values.password?.length >= 8) {
      if (values.password === values.confirmPassword) {
        userForm.append("password", values.password);
      } else {
        MySwal.fire({
          position: "center",
          title: "พาสเวิร์ดไม่ตรงกัน",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return 0;
      }
    }
    if (
      values.firstName?.length > 0 ||
      values.lastName?.length > 0 ||
      values.password?.length >= 8
    ) {
      axios
        .patch(`http://localhost:3333/users/${userObject?._id}`, userForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((editRes) => {
          localStorage.setItem("token", editRes.data.token);
          window.dispatchEvent(new Event("storage")); // update storage after set item
          const decodedToken = jwt_decode(editRes.data.token);
          delete decodedToken.user.password;
          dispatch(setUser(decodedToken.user));
          MySwal.fire({
            position: "center",
            title: "แก้ไขสำเร็จ!",
            text: `ข้อมูลถูกแก้ไขเรียบร้อย`,
            icon: "success",
          });
          refetch();
        })
        .catch((error) => {
          MySwal.fire({
            position: "center",
            title: "เกิดข้อผิดพลาด",
            html: error,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          console.error("There was an error!", error);
        });
    }
  };
  return (
    <>
      {/*-------------------------------- Edit Word Modal------------------------------------ */}
      <Modal centered show={showEditProfile} onHide={() => handleClose()}>
        <Formik
          initialValues={{
            firstname: "",
            lastName: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitEditWord(values);
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
            <Form onSubmit={handleSubmit} id="editProfileForm">
              <Modal.Header closeButton>
                <Modal.Title>แก้ไขโปรไฟล์</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="editFirstName">
                  <Form.Label>ชื่อ</Form.Label>
                  <Form.Control
                    name="firstName"
                    type="text"
                    placeholder={userObject?.firstName}
                    autoFocus
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                  />
                </Form.Group>
                <p className="errorMessage">{errors.firstName}</p>
                <Form.Group className="mb-3" controlId="editLastName">
                  <Form.Label>นามสกุล</Form.Label>
                  <Form.Control
                    name="lastName"
                    type="text"
                    placeholder={userObject?.lastName}
                    autoFocus
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                  />
                </Form.Group>
                <p className="errorMessage">{errors.lastName}</p>
                <Form.Group className="mb-3" controlId="editPassword">
                  <Form.Label>password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="อย่างน้อย 8 ตัว"
                    autoFocus
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                </Form.Group>
                <p className="errorMessage">{errors.password}</p>
                <Form.Group className="mb-3" controlId="editConfirmPassword">
                  <Form.Label>Confirm passward</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    rows={3}
                    placeholder="อย่างน้อย 8 ตัว"
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                </Form.Group>
                <p className="errorMessage">{errors.confirmPassword}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    isValid ? handleClose() : null;
                  }}
                  type="submit"
                >
                  แก้ไข
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      {/*-------------------------------- Edit Word Modal------------------------------------ */}
    </>
  );
};

export default EditWordModal;
